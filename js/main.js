/* =========================================================
   SaaSQube Solutions — site scripts
   ---------------------------------------------------------
   Update CONTACT below with your real details. Every phone,
   email and WhatsApp link on the page is filled from here.
   ========================================================= */
const CONTACT = {
  phone: "+91 00000 00000",          // shown on the page and used for tel: links
  whatsapp: "910000000000",          // country code + number, digits only
  email: "hello@saasqube.example",
  address: "Tamil Nadu, India",
};

document.documentElement.classList.add("js");

/* ---------- Fill contact details ---------- */
const digits = (s) => s.replace(/\D/g, "");
document.querySelectorAll("[data-config]").forEach((el) => {
  const key = el.dataset.config;
  if (key === "phone") {
    el.textContent = CONTACT.phone;
    el.href = `tel:+${digits(CONTACT.phone)}`;
  } else if (key === "email") {
    el.textContent = CONTACT.email;
    el.href = `mailto:${CONTACT.email}`;
  } else if (key === "whatsapp") {
    el.href = `https://wa.me/${CONTACT.whatsapp}`;
  } else if (key === "address") {
    el.textContent = CONTACT.address;
  }
});

/* ---------- Year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Header shadow + mobile nav ---------- */
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const setNav = (open) => {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

/* ---------- Active nav link on scroll ---------- */
const navLinks = [...nav.querySelectorAll('ul a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

/* ---------- Pricing buttons pre-select service ---------- */
const form = document.getElementById("contact-form");
const planToService = { Starter: "Business website", Business: "Business website", "E-commerce": "E-commerce store" };
document.querySelectorAll("[data-plan]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan;
    form.elements.service.value = planToService[plan] || "Not sure yet";
    const msg = form.elements.message;
    if (!msg.value) msg.value = `I'm interested in the ${plan} package.`;
  });
});

/* ---------- Prefill from a template's "Use this design" link (?template=Name) ---------- */
const chosenTemplate = new URLSearchParams(location.search).get("template");
if (chosenTemplate) {
  form.elements.service.value = "Business website";
  if (!form.elements.message.value) {
    form.elements.message.value = `I'd like a website based on your ${chosenTemplate} template.`;
  }
}

/* ---------- Contact form → WhatsApp or email ---------- */
const statusEl = form.querySelector(".form-status");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const via = e.submitter?.dataset.send || "whatsapp";
  const f = form.elements;

  let ok = true;
  ["name", "phone"].forEach((n) => {
    const valid = f[n].value.trim().length > 1;
    f[n].classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    statusEl.textContent = "Please add your name and phone number so we can reach you.";
    form.querySelector(".invalid").focus();
    return;
  }

  const lines = [
    "Hello SaaSQube Solutions!",
    `Name: ${f.name.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    f.business.value.trim() && `Business: ${f.business.value.trim()}`,
    `City: ${f.city.value}`,
    `Looking for: ${f.service.value}`,
    f.message.value.trim() && `Details: ${f.message.value.trim()}`,
  ].filter(Boolean);
  const text = lines.join("\n");

  if (via === "email") {
    const subject = `Website enquiry — ${f.business.value.trim() || f.name.value.trim()}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    statusEl.textContent = "Opening your email app…";
  } else {
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    statusEl.textContent = "Opening WhatsApp… Thank you! We'll reply within one working day.";
  }
});
