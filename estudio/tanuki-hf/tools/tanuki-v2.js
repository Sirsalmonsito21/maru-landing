var TN = { out: "#24160f", fur: "#9a6d45", sh: "#74502f", hl: "#bb8c5e", dark: "#4a3120", darkHl: "#6a4a32", mask: "#5a3b26", cream: "#f3e4c8", creamSh: "#d9c29c",
  coat: "#27365e", coatSh: "#1b2645", coatHl: "#3a4f86", trim: "#f4efe4", obi: "#C8452C", leaf: "#5fa04a", leafSh: "#3d7a32", eye: "#1a0e08" };
var TN_OLD = { fur: "#a39b91", sh: "#7f776e", hl: "#c4bdb4", dark: "#5e5750", darkHl: "#7a726a", mask: "#6e665e", cream: "#f2efea", creamSh: "#d6d0c8" };
var TN_STONE = { out: "#2c2c31", fur: "#8f8f96", sh: "#6d6d74", hl: "#b0b0b7", dark: "#66666d", darkHl: "#7d7d84", mask: "#77777e", cream: "#a9a9b0", creamSh: "#8e8e95",
  coat: "#7e7e86", coatSh: "#66666e", coatHl: "#9a9aa2", trim: "#a4a4ac", obi: "#86868e", leaf: "#8a8a92", leafSh: "#6a6a72", eye: "#56565d" };

/* Don Tanuki chibi. (cx, base) = pies. o: eyes, mouth, arm, armK, beard, age, stone, cane, hunch, cracks */
function tanuki(cx, base, k, o, t) {
  o = o || {};
  var age = o.age || 0, st = o.stone || 0, hunch = o.hunch || 0, ag = clamp(age * 1.4 - .2);
  var C = {};
  Object.keys(TN).forEach(function (n) { var c = TN_OLD[n] ? mixHex(TN[n], TN_OLD[n], ag) : TN[n]; C[n] = mixHex(c, TN_STONE[n] || c, st); });
  var X = function (v) { return cx + v * k; }, Y = function (v) { return base + v * k; };
  var hy = hunch * 3, bob = o.bob ? Math.sin(t * 8) * .6 : 0;
  // cola esponjosa rayada
  for (var i = 5; i >= 0; i--) blob(X(10 + i * 1.9), Y(-6 - i * 2.2), (4.2 - i * .2) * k, (4.2 - i * .2) * k, i % 2 ? C.dark : C.fur, C.out, i % 2 ? null : C.sh);
  // patitas oscuras
  blob(X(-5.5), Y(-2.6), 4.2 * k, 3.2 * k, C.dark, C.out, null, C.darkHl); blob(X(5.5), Y(-2.6), 4.2 * k, 3.2 * k, C.dark, C.out, null, C.darkHl);
  var BY = -13 + hy * .3 + bob;
  // cuerpo + panza
  blob(X(0), Y(BY), 11 * k, 11.5 * k, C.fur, C.out, C.sh, C.hl);
  blob(X(0), Y(BY + 2), 6.5 * k, 7.5 * k, C.cream, null, C.creamSh);
  // happi (chaqueta) abierta
  quad([X(-10.5), Y(BY - 8), X(-3.5), Y(BY - 9), X(-4.5), Y(BY + 9), X(-10), Y(BY + 7)], C.coat);
  quad([X(10.5), Y(BY - 8), X(3.5), Y(BY - 9), X(4.5), Y(BY + 9), X(10), Y(BY + 7)], C.coatSh);
  quad([X(-4.6), Y(BY - 9), X(-3.2), Y(BY - 9), X(-3.9), Y(BY + 9), X(-5.2), Y(BY + 9)], C.trim);
  quad([X(4.6), Y(BY - 9), X(3.2), Y(BY - 9), X(3.9), Y(BY + 9), X(5.2), Y(BY + 9)], C.trim);
  rect(X(-10.5), Y(BY + 3), 21 * k, 2.2 * k, C.obi); rect(X(-10.5), Y(BY + 3), 21 * k, .7 * k, mixHex(C.obi, "#ffffff", .25));
  blob(X(-7.2), Y(BY - 3), 1.6 * k, 1.6 * k, st ? C.coatHl : "#f4efe4", null); if (!st) blob(X(-7.2), Y(BY - 3), .8 * k, .8 * k, "#C8452C", null);
  // brazos
  var arm = function (side, hx, hy2) { limb(X(side * 8.5), Y(BY - 6), X(hx), Y(hy2), 2.6 * k, C.coat, C.out); blob(X(hx), Y(hy2), 2.8 * k, 2.6 * k, C.dark, C.out, null, C.darkHl); };
  var mode = o.arm || "down", ak = o.armK === undefined ? 1 : o.armK;
  var R = [11.5, BY + 4], Lh = [-11.5, BY + 4];
  if (mode === "wave") R = [lerp(11.5, 13.5, ak), lerp(BY + 4, -38, ak) + Math.sin(t * 16) * 2.2 * ak];
  if (mode === "up") R = [lerp(11.5, 12.5, ak), lerp(BY + 4, -38, ak)];
  if (mode === "present") { R = [5, BY - 3]; Lh = [-5, BY - 3]; }
  if (o.cane) R = [12.5, BY + 1];
  if (o.cane) { var cc = mixHex("#6a4428", "#6d6d74", st); line(X(13), Y(BY + 1), X(14.5), Y(0), cc, Math.max(1, k * .8)); blob(X(12), Y(BY - .5), 1.8 * k, 1.4 * k, null, cc); }
  arm(-1, Lh[0], Lh[1]); arm(1, R[0], R[1]);
  // ===== cabeza grande =====
  var HX = cx + hunch * 1.5 * k, HY = base + (-35 + hy + bob) * k;
  var Hx = function (v) { return HX + v * k; }, Hy = function (v) { return HY + v * k; };
  blob(Hx(-10), Hy(-10), 4.6 * k, 4.6 * k, C.dark, C.out, null, C.darkHl); blob(Hx(-10), Hy(-9.5), 2.2 * k, 2.2 * k, C.creamSh, null);
  blob(Hx(10), Hy(-10), 4.6 * k, 4.6 * k, C.dark, C.out, null, C.darkHl); blob(Hx(10), Hy(-9.5), 2.2 * k, 2.2 * k, C.creamSh, null);
  blob(Hx(0), Hy(0), 15 * k, 12.6 * k, C.fur, C.out, C.sh, C.hl);
  blob(Hx(-9.5), Hy(4.5), 5.2 * k, 4 * k, C.cream, null); blob(Hx(9.5), Hy(4.5), 5.2 * k, 4 * k, C.cream, null);
  blob(Hx(0), Hy(5.5), 7.5 * k, 5 * k, C.cream, null, C.creamSh);
  // antifaz del tanuki (lágrimas hacia afuera)
  [-1, 1].forEach(function (s) { blob(Hx(s * 6), Hy(.3), 5 * k, 4 * k, C.mask, null); blob(Hx(s * 8.4), Hy(2.8), 2.8 * k, 2.4 * k, C.mask, null); });
  // ojos grandes y brillantes
  var e = o.eyes || "normal", K = C.out, w = Math.max(1, k * .7);
  var eye = function (s) {
    var ex = s * 5.8, ey = .2;
    if (st > .6) { line(Hx(ex - 2.2), Hy(ey + .4), Hx(ex + 2.2), Hy(ey + .4), C.sh, w); return; }
    if (e === "normal" || e === "hopeful" || e === "wide") {
      var rx = e === "wide" ? 3.3 : e === "hopeful" ? 3 : 2.6, ry = e === "wide" ? 3.8 : e === "hopeful" ? 3.5 : 3.1;
      blob(Hx(ex), Hy(ey), rx * k, ry * k, C.eye, null);
      blob(Hx(ex - rx * .35), Hy(ey - ry * .4), rx * .42 * k, ry * .36 * k, "#ffffff", null);
      px(Hx(ex + rx * .4), Hy(ey + ry * .45), "#ffffff");
      if (e === "hopeful") px(Hx(ex + rx * .1), Hy(ey + ry * .1), "#9fd0ff");
    }
    if (e === "happy") { line(Hx(ex - 2.4), Hy(ey + 1), Hx(ex), Hy(ey - 1.4), K, w); line(Hx(ex), Hy(ey - 1.4), Hx(ex + 2.4), Hy(ey + 1), K, w); }
    if (e === "sad") { blob(Hx(ex), Hy(ey + .6), 2.2 * k, 2.6 * k, C.eye, null); blob(Hx(ex - .7), Hy(ey - .2), .9 * k, .9 * k, "#ffffff", null); rect(Hx(ex - 2.6), Hy(ey + 3), 5.2 * k, .9 * k, "#8fd0ff");
      line(Hx(ex - 2.4 * s), Hy(ey - 4.2), Hx(ex + 2 * s), Hy(ey - 3.2), K, w); }
    if (e === "closed" || e === "old") { line(Hx(ex - 2.2), Hy(ey + .2), Hx(ex), Hy(ey + 1.3), K, w); line(Hx(ex), Hy(ey + 1.3), Hx(ex + 2.2), Hy(ey + .2), K, w); }
  };
  eye(-1); eye(1);
  // nariz y boquita
  blob(Hx(0), Hy(3.6), 2.2 * k, 1.5 * k, C.out, null); px(Hx(-.6), Hy(3.1), "#8a6a5a");
  var m = o.mouth || "smile";
  if (m === "smile") { line(Hx(-2.6), Hy(6), Hx(-1.2), Hy(7), K, w); line(Hx(-1.2), Hy(7), Hx(0), Hy(6), K, w); line(Hx(0), Hy(6), Hx(1.2), Hy(7), K, w); line(Hx(1.2), Hy(7), Hx(2.6), Hy(6), K, w); }
  if (m === "big") { blob(Hx(0), Hy(7.2), 3 * k, 2.4 * k, "#8a2a2a", K); blob(Hx(0), Hy(8.2), 1.8 * k, 1 * k, "#e87a7a", null); }
  if (m === "flat") line(Hx(-1.6), Hy(6.6), Hx(1.6), Hy(6.6), K, w);
  if (m === "sad") { line(Hx(-2.2), Hy(7.4), Hx(0), Hy(6.2), K, w); line(Hx(0), Hy(6.2), Hx(2.2), Hy(7.4), K, w); }
  if (m === "o") blob(Hx(0), Hy(7), 1.4 * k, 1.7 * k, "#8a2a2a", K);
  if (!st && age < .5) { g.save(); g.globalAlpha = .55; blob(Hx(-10), Hy(4.4), 2.4 * k, 1.3 * k, "#f08a8a", null); blob(Hx(10), Hy(4.4), 2.4 * k, 1.3 * k, "#f08a8a", null); g.restore(); }
  // vejez: cejas largas, lentes y barba ondulada
  if (age > .35) {
    var bw = mixHex("#e6e0d6", "#9e9ea5", st);
    [-1, 1].forEach(function (s) { var L = 2 + clamp(age * 1.5 - .5) * 4; for (var q = 0; q < L; q++) rect(Hx(s * (3.4 + q * .9)), Hy(-4.4 + q * .55), 1.2 * k, 1.1 * k, bw); });
    if (age > .55) [-1, 1].forEach(function (s) { blob(Hx(s * 5.8), Hy(.4), 3.6 * k, 3.4 * k, null, mixHex("#c9a44a", "#8a8a90", st)); });
    if (age > .55) line(Hx(-2.2), Hy(.2), Hx(2.2), Hy(.2), mixHex("#c9a44a", "#8a8a90", st), 1);
  }
  var b = o.beard || 0;
  if (b > 0) {
    var L2 = 2 + b * 30, bc = mixHex(mixHex("#e8d7b8", "#f4f4f2", clamp(age * 1.6 - .3)), "#b2b2b8", st), bs = mixHex(mixHex("#c8b08a", "#d2d2d6", clamp(age * 1.6 - .3)), "#8e8e95", st);
    for (var r = 0; r < L2; r++) { var f = r / L2, ww = (6.5 * Math.pow(1 - f, .6) + .6) * k, sx = Math.sin(r * .35 + t * 2) * 1.2 * k * f, yy = Hy(7 + r * .95);
      rect(HX - ww + sx - 1, yy, ww * 2 + 2, k + 1, C.out); rect(HX - ww + sx, yy, ww * 2, k + 1, bc); rect(HX - ww + sx, yy, ww * .5, k + 1, bs); if (r % 4 === 2) rect(HX + sx - ww * .2, yy, ww * .35, 1, bs); }
    blob(Hx(0), Hy(7.4), 6.8 * k, 3 * k, bc, null);
  }
  // hojita en la cabeza (el símbolo del tanuki)
  var lx = Hx(2.5), ly = Hy(-12.6), lr = Math.sin(t * 2.5) * .08;
  g.save(); g.translate(lx, ly); g.rotate(-.5 + lr);
  var LK = k; blob(0, -3 * LK, 3 * LK, 4.6 * LK, C.leaf, C.out, C.leafSh); line(0, 1.2 * LK, 0, -7 * LK, C.leafSh, Math.max(1, LK * .5)); rect(-.3 * LK, 1 * LK, .8 * LK, 2.4 * LK, C.leafSh);
  g.restore();
  if (o.cracks) { var ck = o.cracks, cr = "#3a3a42"; line(Hx(-3), Hy(-11), Hx(-5), Hy(-3), cr, 1); if (ck > .3) line(Hx(-5), Hy(-3), Hx(0), Hy(3), cr, 1); if (ck > .5) line(X(-6), Y(BY - 8), X(3), Y(BY + 4), cr, 1); if (ck > .7) line(X(3), Y(BY + 4), X(-2), Y(-2), cr, 1); if (ck > .85) line(Hx(8), Hy(-8), Hx(12), Hy(2), cr, 1); }
}
