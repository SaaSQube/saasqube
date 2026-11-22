/* =========================================================
   SaaSQube — intro loader
   The logo is built as a real 3D cube: six thick, rounded
   tiles fly in and lock together, the cube flips through a
   few quick 90° turns (tiles pop out on each one), then it
   settles at the logo's exact angle, flattens into the logo,
   the name types in letter by letter and the logo flies into
   the header. Click / tap / any key skips it.
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var loader = document.getElementById("loader");
  if (!loader) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var pageReady = new Promise(function (r) {
    if (document.readyState === "complete") r(); else window.addEventListener("load", r, { once: true });
  });
  var skipped = false, finished = false, anims = [], skipNow;
  var skipSignal = new Promise(function (r) { skipNow = r; });

  /* ---------- The cube (built by js/cube.js) ---------- */
  var DUR = 2300; // cube choreography length (ms)
  var lc = null;

  function animateCube(host) {
    lc = new window.SQLogoCube(host);
    var done = lc.assemble(DUR);
    // Strong perspective while it tumbles; nearly flat at the end so it matches the 2D logo.
    anims.push(host.animate([
      { perspective: "720px", opacity: 0 },
      { perspective: "720px", opacity: 1, offset: .12 },
      { perspective: "720px", offset: .8 },
      { perspective: "4000px", opacity: 1 },
    ], { duration: DUR, fill: "forwards", easing: "ease-in-out" }));
    return done;
  }

  /* ---------- Finish & exit ---------- */
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(window.__sqLoaderFailsafe);
    root.classList.remove("loading");
    loader.remove();
    document.querySelectorAll(".site-header .sq-mark").forEach(function (m) {
      m.classList.add("is-landing");
      m.addEventListener("animationend", function () { m.classList.remove("is-landing"); }, { once: true });
    });
    document.dispatchEvent(new CustomEvent("sq:loaded"));
  }

  function skip() {
    if (skipped) return;
    skipped = true;
    anims.forEach(function (a) { try { a.finish(); } catch (e) { /* already done */ } });
    if (lc) lc.finish();
    skipNow();
  }
  loader.addEventListener("click", skip);
  window.addEventListener("keydown", function onKey() { skip(); window.removeEventListener("keydown", onKey); });

  async function exit() {
    var mark = loader.querySelector(".loader-mark");
    var target = document.querySelector(".site-header .brand-mark");
    loader.classList.add("is-solved", "is-leaving");
    var a = mark.getBoundingClientRect(), b = target ? target.getBoundingClientRect() : null;
    if (b && b.width && !reduce) {
      var dx = b.left + b.width / 2 - (a.left + a.width / 2);
      var dy = b.top + b.height / 2 - (a.top + a.height / 2);
      var s = b.width / a.width;
      var fly = mark.animate([
        { transform: "translate(0,0) scale(1) rotate(0deg)" },
        { transform: "translate(" + dx * .35 + "px," + (dy * .2 - 30) + "px) scale(" + (.55 + s * .45) + ") rotate(-90deg)", offset: .45 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ") rotate(-360deg)" },
      ], { duration: 900, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" });
      await fly.finished.catch(function () {});
    } else {
      await wait(reduce ? 150 : 450);
    }
  }

  async function run() {
    loader.classList.add("is-in");

    if (reduce || !window.SQLogoCube) {
      loader.classList.add("is-solved");
      await Promise.race([Promise.all([pageReady, wait(700)]), wait(1800)]);
      await exit();
      finish();
      return;
    }

    var host = loader.querySelector(".loader-cube");
    loader.classList.add("is-building");
    await Promise.race([animateCube(host), skipSignal]);

    loader.classList.add("is-solved"); // cube → flat logo
    if (!skipped) await Promise.race([Promise.all([pageReady, wait(650)]), wait(2400), skipSignal]);
    await exit();
    finish();
  }

  run().catch(function (err) { console.error(err); finish(); });
})();
