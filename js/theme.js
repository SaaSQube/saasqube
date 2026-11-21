/* =========================================================
   SaaSQube Solutions — light / dark theme switch
   ---------------------------------------------------------
   Shared by the homepage and the templates gallery.
   The saved choice is applied before first paint by a tiny
   inline script in each page's <head>; this file wires up
   the header switch. Light is the default; dark is used only
   after the visitor picks it.
   ========================================================= */
(function () {
  var KEY = "sq-theme";
  var root = document.documentElement;

  function saved() {
    try { var t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : null; } catch (e) { return null; }
  }
  function current() { return root.dataset.theme === "dark" ? "dark" : "light"; }

  function syncButtons() {
    var dark = current() === "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-checked", String(dark));
      btn.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#070a1c" : "#ffffff");
  }

  function apply(theme) {
    root.classList.add("theme-anim");
    root.dataset.theme = theme;
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode: still switches for this page */ }
    syncButtons();
    setTimeout(function () { root.classList.remove("theme-anim"); }, 350);
  }

  var s = saved();
  if (s) root.dataset.theme = s;

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () { apply(current() === "dark" ? "light" : "dark"); });
  });

  // Keep several open tabs in step.
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY) return;
    if (e.newValue === "light" || e.newValue === "dark") root.dataset.theme = e.newValue;
    else delete root.dataset.theme;
    syncButtons();
  });

  syncButtons();
})();
