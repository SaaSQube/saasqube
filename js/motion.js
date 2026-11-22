/* =========================================================
   SaaSQube — motion & interaction layer
   Scroll progress, word reveals, parallax, tilt + spotlight
   cards, magnetic buttons, counters, scroll-linked "why" and
   "process" sections, smooth FAQ, back-to-top, animated logo
   marks and the interactive cube in the About section.
   Everything respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var hasIO = "IntersectionObserver" in window;

  /* ---------- 1. Split headings into words for a staggered reveal ---------- */
  function splitWords(el) {
    var i = 0;
    function wrap(node) {
      var w = document.createElement("span");
      w.className = "w";
      node.parentNode.insertBefore(w, node);
      w.appendChild(node);
      if (node.nodeType === 1) node.style.setProperty("--wi", i++);
      return w;
    }
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"), inner = document.createElement("span");
            w.className = "w";
            inner.textContent = part;
            inner.style.setProperty("--wi", i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          // Gradient text must stay one piece (background-clip: text).
          if (n.classList.contains("grad")) wrap(n); else walk(n);
        }
      });
    })(el);
    el.classList.add("split");
  }
  if (!reduce) $$(".hero h1, .section-head h2, .why-copy h2, .about-copy h2, .contact-copy h2").forEach(splitWords);

  /* ---------- 2. Scroll-driven effects (one rAF per scroll) ---------- */
  var header = $(".site-header");
  var nav = $("#site-nav");
  var bar = $(".scroll-progress");
  var toTop = $(".to-top");
  var hero = $(".hero");
  var whyList = $(".why-list");
  var steps = $(".steps");
  var stepItems = steps ? $$(".step", steps) : [];
  var headerMark = $(".site-header .sq-mark");
  var lastY = window.scrollY, ticking = false, burstT;

  function progressThrough(el, start, end) {
    // 0 when el's top is at `start`·vh, 1 when it reaches `end`·vh.
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * start - r.top) / (vh * (start - end) + r.height * .35), 0, 1);
  }

  function onFrame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var p = max > 0 ? y / max : 0;

    if (bar) bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (toTop) {
      toTop.style.setProperty("--p", p.toFixed(4));
      toTop.classList.toggle("show", y > vh * .8);
    }

    // Hide the header while reading down, bring it back on the way up.
    if (header && !root.classList.contains("loading")) {
      var navOpen = nav && nav.classList.contains("open");
      if (y > lastY + 6 && y > 420 && !navOpen && !header.contains(document.activeElement)) header.classList.add("hide");
      else if (y < lastY - 6 || y < 200) header.classList.remove("hide");
    }

    if (hero && !reduce && y < vh * 1.4) hero.style.setProperty("--hsy", y.toFixed(1));

    if (whyList) {
      whyList.style.setProperty("--wp", progressThrough(whyList, .65, .3).toFixed(4));
    }
    if (steps) {
      var sp = progressThrough(steps, .85, .45);
      steps.style.setProperty("--pp", sp.toFixed(4));
      stepItems.forEach(function (s, i) {
        s.classList.toggle("lit", sp >= (stepItems.length > 1 ? i / (stepItems.length - 1) : 0) - .02);
      });
    }

    // The header logo "opens up" a little with scroll speed.
    if (headerMark && !reduce) {
      var v = Math.abs(y - lastY);
      headerMark.style.setProperty("--burst", Math.min(9, v * .35).toFixed(2));
      clearTimeout(burstT);
      burstT = setTimeout(function () { headerMark.style.setProperty("--burst", "0"); }, 140);
    }
    lastY = y;
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);
  if (header) header.addEventListener("focusin", function () { header.classList.remove("hide"); });
  onFrame();

  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var brand = $(".site-header .brand");
    if (brand) brand.focus({ preventScroll: true });
  });

  /* ---------- 3. Hero: pointer parallax + spotlight ---------- */
  if (hero && finePointer && !reduce) {
    var hx = 0, hy = 0, tx = 0, ty = 0, raf = null;
    var loop = function () {
      hx += (tx - hx) * .08; hy += (ty - hy) * .08;
      hero.style.setProperty("--px", hx.toFixed(4));
      hero.style.setProperty("--py", hy.toFixed(4));
      raf = Math.abs(tx - hx) + Math.abs(ty - hy) > .001 ? requestAnimationFrame(loop) : null;
    };
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 2 - 1;
      ty = (e.clientY - r.top) / r.height * 2 - 1;
      hero.style.setProperty("--hx", (e.clientX - r.left) + "px");
      hero.style.setProperty("--hy", (e.clientY - r.top) + "px");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- 4. Tilt + spotlight cards ---------- */
  $$(".spot").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      if (finePointer && !reduce && el.classList.contains("tilt")) {
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", ((x / r.width - .5) * 9).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((.5 - y / r.height) * 7).toFixed(2) + "deg");
      }
    });
    el.addEventListener("pointerleave", function () {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  /* ---------- 5. Magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = (dx * .22).toFixed(1) + "px " + (dy * .32).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });
  }

  /* ---------- 6. Count-up numbers ---------- */
  var fmt = function (n) { return Math.round(n).toLocaleString("en-IN"); };
  function countUp(el) {
    var to = parseFloat(el.dataset.count), pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = pre + fmt(to) + suf; return; }
    var t0 = performance.now(), dur = 1600;
    (function step(now) {
      var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(2, -10 * t);
      el.textContent = pre + fmt(to * (t === 1 ? 1 : e)) + suf;
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  var counters = $$("[data-count]");
  if (hasIO) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: .6 });
    counters.forEach(function (c) { c.textContent = (c.dataset.prefix || "") + "0" + (c.dataset.suffix || ""); cio.observe(c); });
  }

  /* ---------- 7. "Why us" list: highlight the item in focus ---------- */
  if (whyList && hasIO) {
    var items = $$("li", whyList);
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) items.forEach(function (li) { li.classList.toggle("active", li === e.target); }); });
    }, { rootMargin: "-42% 0px -42% 0px" });
    items.forEach(function (li) { wio.observe(li); });
  }

  /* ---------- 8. FAQ: smooth open / close, one at a time ---------- */
  var faqs = $$(".faq-list details");
  function faqClose(d) {
    if (!d.open) return;
    var p = $("p", d);
    if (d._anim) d._anim.cancel();
    d.classList.remove("is-open");
    d._anim = p.animate([{ height: p.offsetHeight + "px", opacity: 1 }, { height: "0px", paddingBottom: "0px", opacity: 0 }],
      { duration: 260, easing: "cubic-bezier(.4,0,.2,1)" });
    d._anim.onfinish = function () { d.open = false; d._anim = null; };
  }
  function faqOpen(d) {
    var p = $("p", d);
    if (d._anim) d._anim.cancel();
    d.open = true;
    d.classList.add("is-open");
    d._anim = p.animate([{ height: "0px", paddingBottom: "0px", opacity: 0 }, { height: p.offsetHeight + "px", opacity: 1 }],
      { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    d._anim.onfinish = function () { d._anim = null; };
  }
  faqs.forEach(function (d) {
    if (d.open) d.classList.add("is-open");
    $("summary", d).addEventListener("click", function (e) {
      if (reduce) return;
      e.preventDefault();
      if (d.open && d.classList.contains("is-open")) { faqClose(d); return; }
      faqs.forEach(function (o) { if (o !== d) faqClose(o); });
      faqOpen(d);
    });
  });

  /* ---------- 9. Logo marks: twist on hover, assemble when seen ---------- */
  $$(".brand").forEach(function (brand) {
    var mark = $(".sq-mark", brand);
    if (!mark || reduce) return;
    brand.addEventListener("mouseenter", function () {
      if (mark.classList.contains("is-twisting")) return;
      mark.classList.add("is-twisting");
    });
    mark.addEventListener("animationend", function (e) {
      if (e.animationName === "sq-twist") mark.classList.remove("is-twisting");
    });
  });
  var footMark = $(".site-footer .sq-mark");
  if (footMark && hasIO && !reduce) {
    footMark.classList.add("pre-assemble");
    var fio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      footMark.classList.remove("pre-assemble");
      footMark.classList.add("is-assembling");
      fio.disconnect();
    }, { threshold: .8 });
    fio.observe(footMark);
  }

  /* ---------- 10. About: the 3D logo cube ---------- */
  // Builds itself when scrolled into view, then flips every few seconds while visible.
  // Tilts toward the pointer; click / tap / Enter rebuilds it from scattered tiles.
  var play = $("[data-cube-play]");
  if (play && window.SQLogoCube) {
    var lcube = new window.SQLogoCube($(".cube-host", play), { fit: .3 });
    var inView = false, built = false, loopT = null;
    var schedule = function () {
      clearTimeout(loopT);
      if (reduce || !inView) return;
      loopT = setTimeout(function () {
        if (!inView || document.hidden) return schedule();
        lcube.flips(2800).then(schedule);
      }, 3200);
    };
    var rebuild = function () {
      if (reduce) return;
      clearTimeout(loopT);
      play.classList.add("is-built");
      lcube.assemble(2300).then(schedule);
    };
    if (reduce) play.classList.add("is-built");

    if (finePointer && !reduce) {
      play.addEventListener("pointermove", function (e) {
        var r = play.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        lcube.tilt.style.transform = "rotateX(" + (-y * 24).toFixed(1) + "deg) rotateY(" + (x * 30).toFixed(1) + "deg)";
      });
      play.addEventListener("pointerleave", function () { lcube.tilt.style.transform = ""; });
    }
    play.addEventListener("click", rebuild);
    play.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rebuild(); }
    });
    var replay = $("[data-cube-replay]");
    if (replay) replay.addEventListener("click", rebuild);

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView && !built) { built = true; rebuild(); }
        else if (inView && !lcube.busy) schedule();
        else if (!inView) clearTimeout(loopT);
      }, { threshold: .4 }).observe(play);
    } else {
      play.classList.add("is-built");
    }
  }
})();
