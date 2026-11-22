/* =========================================================
   SaaSQube — homepage (v2) interactions
   - Rotating word in the hero headline
   - "What do you need?" chips feed the form's hidden `service`
     field (used by EmailJS / WhatsApp in main.js)
   - Service cards, pricing buttons and ?template= links
     preselect the matching chip
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Rotating hero word ---------- */
  var word = document.querySelector(".hx-word");
  if (word && !reduce) {
    var words = ["websites", "online stores", "mobile apps", "web apps"], i = 0;
    setInterval(function () {
      if (document.hidden) return;
      word.classList.add("is-out");
      setTimeout(function () {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove("is-out");
        word.classList.add("is-in");
        void word.offsetWidth; // restart the transition from below
        word.classList.remove("is-in");
      }, 450);
    }, 2600);
  }

  /* ---------- Service chips <-> hidden service field ---------- */
  var form = document.getElementById("contact-form");
  if (!form || !form.elements.service) return;
  var hidden = form.elements.service;
  var boxes = Array.prototype.slice.call(form.querySelectorAll(".chip-opt input"));
  var norm = function (s) { return String(s).toLowerCase().replace(/&amp;/g, "&").trim(); };

  function sync() {
    var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
    hidden.value = picked.length ? picked.join(", ") : "Not sure yet";
  }
  function pick(value, only) {
    boxes.forEach(function (b) {
      if (norm(b.value) === norm(value)) b.checked = true;
      else if (only) b.checked = false;
    });
    sync();
  }
  boxes.forEach(function (b) { b.addEventListener("change", sync); });

  // Other scripts set the hidden field directly (pricing buttons, ?template= links): mirror it into the chips.
  function reflect() { if (hidden.value && norm(hidden.value) !== "not sure yet") pick(hidden.value, true); }
  document.querySelectorAll("[data-plan]").forEach(function (b) { b.addEventListener("click", function () { setTimeout(reflect, 0); }); });
  document.querySelectorAll("[data-service]").forEach(function (a) { a.addEventListener("click", function () { pick(a.dataset.service, true); }); });
  reflect();
  form.addEventListener("reset", function () { setTimeout(sync, 0); });
})();
