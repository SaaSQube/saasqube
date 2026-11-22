/* =========================================================
   SaaSQube — 3D logo cube (shared by the loader + About)
   ---------------------------------------------------------
   The logo built as a real cube: six thick, rounded tiles
   (stacked SVG copies give them depth). Seen from its home
   angle — rotateX(-20deg) rotateY(45deg) — the three visible
   faces are exactly the logo's pieces.

   const c = new SQLogoCube(host, { fit })
     fit       optional: tile size = host width × fit
     c.assemble(ms)  tiles fly in, lock together, flip, settle
     c.flips(ms)     a loop of quarter-turn flips back to home
     c.finish()      jump every running animation to its end
   Rest states are inline styles, so animations use fill
   "backwards" and nothing is left pinned when they end.
   ========================================================= */
(function () {
  "use strict";
  if (!("animate" in Element.prototype)) return;

  var LAYERS = 7, GAP = 1.7;
  var SIDE = '<polygon points="10 10 90 10 90 90 10 90" fill="url(#G)" stroke="url(#G)" stroke-width="9" stroke-linejoin="round"/>';
  var TOP = '<polygon points="10 10 81 10 10 81" fill="url(#lg-top-a)" stroke="url(#lg-top-a)" stroke-width="9" stroke-linejoin="round"/>' +
            '<polygon points="90 19 90 90 19 90" fill="url(#lg-top-b)" stroke="url(#lg-top-b)" stroke-width="9" stroke-linejoin="round"/>';
  // From the home angle: front = logo's right face, left = logo's left face,
  // top = the split triangles. The other three only show mid-flip.
  var FACES = [
    { base: "", art: SIDE.replace(/G/g, "lg-front") },
    { base: "rotateY(-90deg)", art: SIDE.replace(/G/g, "lg-left") },
    { base: "rotateX(90deg)", art: TOP },
    { base: "rotateY(90deg)", art: SIDE.replace(/G/g, "lg-h1") },
    { base: "rotateY(180deg)", art: SIDE.replace(/G/g, "lg-h2") },
    { base: "rotateX(-90deg)", art: SIDE.replace(/G/g, "lg-h3") },
  ];
  var SNAP = "cubic-bezier(.75,0,.25,1)";
  var rot = function (rx, ry, rz, s) {
    return "rotateX(" + rx + "deg) rotateY(" + ry + "deg) rotateZ(" + rz + "deg) scale(" + (s == null ? 1 : s) + ")";
  };
  var HOME = rot(-20, 45, 0, 1);

  function el(cls, parent) {
    var d = document.createElement("div");
    d.className = cls;
    parent.appendChild(d);
    return d;
  }

  function SQLogoCube(host, opts) {
    opts = opts || {};
    this.host = host;
    this.fit = opts.fit || 0;
    this.anims = [];
    this.float = el("lc-float", host);
    this.tilt = el("lc-tilt", this.float);
    this.cube = el("lc-cube", this.tilt);
    this.cube.style.transform = HOME;
    var html = function (art) {
      var s = "";
      for (var k = 0; k < LAYERS; k++) {
        s += '<div class="lc-layer' + (k ? " deep" : "") + '" style="transform:translateZ(' + (-k * GAP).toFixed(1) + 'px)">' +
             '<svg viewBox="0 0 100 100" aria-hidden="true">' + art + "</svg></div>";
      }
      return s;
    };
    var self = this;
    this.faces = FACES.map(function (f) {
      var face = el("lc-face", self.cube);
      face.innerHTML = html(f.art);
      return { el: face, base: f.base };
    });
    this._measure();
    if (this.fit && "ResizeObserver" in window) new ResizeObserver(function () { self._measure(); }).observe(host);
  }

  SQLogoCube.prototype._measure = function () {
    if (this.fit) this.host.style.setProperty("--e", Math.round(Math.max(60, this.host.clientWidth * this.fit)) + "px");
    this.h = (parseFloat(getComputedStyle(this.host).getPropertyValue("--e")) || 122) / 2;
    var self = this;
    this.faces.forEach(function (f) { f.el.style.transform = self._tf(f, 0, 0, 0, 0); });
  };

  SQLogoCube.prototype._tf = function (f, d, x, y, r) {
    return f.base + " translateZ(" + (this.h + d) + "px) translate(" + x + "px," + y + "px) rotate(" + r + "deg)";
  };

  // Face keyframes: optional fly-in, then a small outward pop at each flip moment.
  SQLogoCube.prototype._faceKF = function (f, i, pops, scatter) {
    var self = this, rest = this._tf(f, 0, 0, 0, 0), kf = [];
    if (scatter) {
      kf.push({ offset: 0, transform: this._tf(f, 140 + Math.random() * 120, (Math.random() - .5) * 220, (Math.random() - .5) * 220, (Math.random() - .5) * 300), easing: "cubic-bezier(.15,.75,.25,1)" });
      kf.push({ offset: scatter + i * .012, transform: rest, easing: "linear" });
    } else {
      kf.push({ offset: 0, transform: rest, easing: "linear" });
    }
    pops.forEach(function (p) {
      kf.push({ offset: p - .05, transform: rest, easing: "cubic-bezier(.3,0,.3,1)" });
      kf.push({ offset: p, transform: self._tf(f, Math.max(10, self.h * .26), 0, 0, 0), easing: "cubic-bezier(.3,0,.3,1)" });
      kf.push({ offset: p + .05, transform: rest, easing: "linear" });
    });
    kf.push({ offset: 1, transform: rest });
    return kf;
  };

  SQLogoCube.prototype._run = function (cubeKF, pops, scatter, ms) {
    var self = this;
    this.finish();
    var anims = this.faces.map(function (f, i) {
      return f.el.animate(self._faceKF(f, i, pops, scatter), { duration: ms, fill: "backwards" });
    });
    anims.push(this.cube.animate(cubeKF, { duration: ms, fill: "backwards" }));
    this.anims = anims;
    this.busy = true;
    return Promise.all(anims.map(function (a) { return a.finished; }))
      .catch(function () {})
      .then(function () { self.busy = false; });
  };

  // Tiles fly in and lock together, three quarter-turn flips, settle on the logo angle.
  SQLogoCube.prototype.assemble = function (ms) {
    return this._run([
      { offset: 0, transform: rot(-65, -260, 35, .5), easing: "cubic-bezier(.2,.7,.25,1)" },
      { offset: .3, transform: rot(-25, -135, 0), easing: "linear" },
      { offset: .42, transform: rot(-25, -135, 0), easing: SNAP },
      { offset: .52, transform: rot(-25, -45, 0), easing: "linear" },
      { offset: .59, transform: rot(-25, -45, 0), easing: SNAP },
      { offset: .69, transform: rot(65, -45, 0), easing: "linear" },
      { offset: .75, transform: rot(65, -45, 0), easing: SNAP },
      { offset: .9, transform: rot(-20, 45, 0, 1.06), easing: "cubic-bezier(.3,1.4,.5,1)" },
      { offset: 1, transform: HOME },
    ], [.47, .64, .8], .3, ms || 2300);
  };

  // From home: two quarter turns, a full tumble, a half turn — and back to home.
  SQLogoCube.prototype.flips = function (ms) {
    return this._run([
      { offset: 0, transform: rot(-20, 45, 0), easing: SNAP },
      { offset: .2, transform: rot(-20, 135, 0), easing: "linear" },
      { offset: .3, transform: rot(-20, 135, 0), easing: SNAP },
      { offset: .5, transform: rot(-20, 225, 0), easing: "linear" },
      { offset: .58, transform: rot(-20, 225, 0), easing: SNAP },
      { offset: .8, transform: rot(340, 225, 0), easing: "linear" },
      { offset: .84, transform: rot(340, 225, 0), easing: "cubic-bezier(.6,0,.3,1.25)" },
      { offset: 1, transform: rot(340, 405, 0) },
    ], [.1, .4, .69, .92], 0, ms || 2800);
  };

  SQLogoCube.prototype.finish = function () {
    this.anims.forEach(function (a) { try { a.finish(); } catch (e) { /* idle */ } });
    this.anims = [];
    this.busy = false;
  };

  window.SQLogoCube = SQLogoCube;
})();
