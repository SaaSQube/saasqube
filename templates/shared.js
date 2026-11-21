/* Shared behaviour for SaaSQube demo templates. */

// Hide the demo bar and floating buttons when shown as a preview inside the gallery.
if (window.self !== window.top) document.documentElement.classList.add("in-frame");

// Mobile navigation
const tToggle = document.querySelector(".t-toggle");
const tNav = document.getElementById("t-nav");
if (tToggle && tNav) {
  const setOpen = (open) => {
    tNav.classList.toggle("open", open);
    tToggle.setAttribute("aria-expanded", String(open));
    tToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  tToggle.addEventListener("click", () => setOpen(!tNav.classList.contains("open")));
  tNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

// Current year
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

// Tabs: <div class="tabs" data-tabs> with .tab[data-tab="panel-id"]; panels are .tab-panel siblings in the same parent.
document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = group.querySelectorAll(".tab");
  const scope = group.parentElement;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      scope.querySelectorAll(".tab-panel").forEach((p) => { p.hidden = p.id !== tab.dataset.tab; });
    });
  });
});

// Filters: <div data-filter-group="target-selector"> with buttons [data-filter]; items carry data-cat.
document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const items = document.querySelectorAll(group.dataset.filterGroup);
  const buttons = group.querySelectorAll("[data-filter]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      items.forEach((it) => { it.hidden = !(btn.dataset.filter === "all" || it.dataset.cat === btn.dataset.filter); });
    });
  });
});

// Demo forms: show a friendly message instead of sending anything.
document.querySelectorAll("form[data-demo]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = form.querySelector(".form-msg");
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (msg) msg.textContent = form.dataset.demoMsg || "Thank you! This is a demo — on your live website, this goes straight to your WhatsApp or email.";
    form.reset();
  });
});
