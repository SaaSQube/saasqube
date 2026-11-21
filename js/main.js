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

/* EmailJS: sends the contact form straight to your inbox (emailjs.com).
   Until templateId and publicKey are filled in, "Send by email" opens the
   visitor's email app instead. autoReplyTemplateId is optional: when set,
   visitors who give an email address get a thank-you copy. */
const EMAILJS = {
  serviceId: "service_olwui3b",
  templateId: "template_d7paoko",   // enquiry email to you
  autoReplyTemplateId: "",   // thank-you email to the visitor (optional)
  publicKey: "hciiQLOWsSsZyLHNN",  // Account → General → Public Key (safe to publish)
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

/* ---------- Template slider ---------- */
const slider = document.querySelector(".tslider");
if (slider) {
  const track = slider.querySelector(".ts-track");
  const slides = [...track.children];
  const prev = slider.querySelector(".ts-prev");
  const next = slider.querySelector(".ts-next");
  const dotsWrap = slider.querySelector(".ts-dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Load each live preview only when its slide comes near the visible area.
  const loadFrame = (slide) => {
    const f = slide.querySelector("iframe[data-src]");
    if (!f) return;
    f.addEventListener("load", () => f.classList.add("loaded"), { once: true });
    f.src = f.dataset.src;
    f.removeAttribute("data-src");
  };
  if ("IntersectionObserver" in window) {
    const lazy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { loadFrame(e.target); lazy.unobserve(e.target); } });
    }, { root: track, rootMargin: "0px 60% 0px 60%" });
    const outer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      slides.forEach((s) => lazy.observe(s));
      outer.disconnect();
    }, { rootMargin: "300px 0px" });
    outer.observe(slider);
  } else {
    slides.forEach(loadFrame);
  }

  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
  const pageCount = () => Math.max(1, slides.length - perView() + 1);
  const current = () => Math.round(track.scrollLeft / step());
  const goTo = (i) => track.scrollTo({ left: Math.max(0, Math.min(i, pageCount() - 1)) * step(), behavior: reduceMotion ? "auto" : "smooth" });

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pageCount(); i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => { goTo(i); pause(); });
      dotsWrap.appendChild(b);
    }
    update();
  };
  const update = () => {
    const i = current();
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    [...dotsWrap.children].forEach((d, n) => d.setAttribute("aria-current", String(n === i)));
  };

  prev.addEventListener("click", () => { goTo(current() - 1); pause(); });
  next.addEventListener("click", () => { goTo(current() + 1); pause(); });
  track.addEventListener("keydown", (e) => {
    if (e.target !== track) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); pause(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); pause(); }
  });
  let raf;
  track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(buildDots, 150); });

  // Autoplay: advances every 5s, pauses on hover, focus, touch or when off-screen.
  let timer = null, hovering = false, focused = false, visible = false, stopped = reduceMotion;
  const tick = () => goTo(current() + 1 >= pageCount() ? 0 : current() + 1);
  const sync = () => {
    clearInterval(timer); timer = null;
    if (!stopped && !hovering && !focused && visible && !document.hidden) timer = setInterval(tick, 5000);
  };
  const pause = () => { stopped = true; sync(); };
  slider.addEventListener("mouseenter", () => { hovering = true; sync(); });
  slider.addEventListener("mouseleave", () => { hovering = false; sync(); });
  slider.addEventListener("focusin", () => { focused = true; sync(); });
  slider.addEventListener("focusout", () => { focused = false; sync(); });
  track.addEventListener("touchstart", pause, { passive: true });
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: .3 }).observe(slider);
  }

  buildDots();
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
const emailjsReady = () => Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);
const setStatus = (msg, isError = false) => { statusEl.textContent = msg; statusEl.classList.toggle("error", isError); };

const sendEmailJS = (templateId, params) =>
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id: EMAILJS.serviceId, template_id: templateId, user_id: EMAILJS.publicKey, template_params: params }),
  }).then(async (res) => { if (!res.ok) throw new Error(`${res.status} ${await res.text()}`); });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const via = e.submitter?.dataset.send || "whatsapp";
  const f = form.elements;
  const val = (n) => f[n].value.trim();

  let ok = true;
  ["name", "phone"].forEach((n) => {
    const valid = val(n).length > 1;
    f[n].classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  const emailOk = !val("email") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("email"));
  f.email.classList.toggle("invalid", !emailOk);
  if (!ok || !emailOk) {
    setStatus(!ok ? "Please add your name and phone number so we can reach you." : "That email address doesn't look right. Please check it, or leave it empty.", true);
    form.querySelector(".invalid").focus();
    return;
  }

  // Bots fill the hidden field: pretend it worked and send nothing.
  if (val("company_site")) { setStatus("Thank you! We'll reply within one working day."); form.reset(); return; }

  const lines = [
    "Hello SaaSQube Solutions!",
    `Name: ${val("name")}`,
    `Phone: ${val("phone")}`,
    val("email") && `Email: ${val("email")}`,
    val("business") && `Business: ${val("business")}`,
    val("city") && `City: ${val("city")}`,
    `Looking for: ${f.service.value}`,
    val("message") && `Details: ${val("message")}`,
  ].filter(Boolean);
  const text = lines.join("\n");
  const openMailApp = () => {
    const subject = `Website enquiry — ${val("business") || val("name")}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  if (via === "whatsapp") {
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setStatus("Opening WhatsApp… Thank you! We'll reply within one working day.");
    return;
  }

  if (!emailjsReady()) {
    openMailApp();
    setStatus("Opening your email app…");
    return;
  }

  const params = {
    name: val("name"),
    phone: val("phone"),
    email: val("email"),
    reply_to: val("email"),
    business: val("business") || "—",
    city: val("city") || "—",
    service: f.service.value,
    message: val("message") || "—",
  };
  const buttons = form.querySelectorAll(".form-actions .btn");
  buttons.forEach((b) => (b.disabled = true));
  setStatus("Sending your enquiry…");
  try {
    await sendEmailJS(EMAILJS.templateId, params);
    if (params.email && EMAILJS.autoReplyTemplateId) {
      // The thank-you copy is a bonus: a failure here doesn't affect the enquiry.
      sendEmailJS(EMAILJS.autoReplyTemplateId, params).catch((err) => console.warn("Auto-reply not sent:", err));
    }
    setStatus(params.email
      ? "Thank you! Your enquiry has been sent, and a copy is on its way to your inbox. We'll reply within one working day."
      : "Thank you! Your enquiry has been sent. We'll reply within one working day.");
    form.reset();
  } catch (err) {
    console.error("EmailJS error:", err);
    setStatus("Sorry, we couldn't send that just now. Please use “Send on WhatsApp”, or try again in a moment.", true);
  } finally {
    buttons.forEach((b) => (b.disabled = false));
  }
});
