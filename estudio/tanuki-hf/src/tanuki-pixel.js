/* ===== Don Tanuki, Maru maneki-neko y la calle del ramen (se suma al motor pixel de Maru) ===== */
function hx2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function mixHex(a, b, k) {
  if (k <= 0) return a; if (k >= 1) return b;
  var A = hx2rgb(a), B = hx2rgb(b), r = "#";
  for (var i = 0; i < 3; i++) { var v = Math.round(A[i] + (B[i] - A[i]) * k).toString(16); r += v.length < 2 ? "0" + v : v; }
  return r;
}
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

/* Maru maneki-neko sentada. o: paw 0..1 (patita arriba), dust 0..1, awake bool, glow 0..1, wink */
function maneki(cx, base, k, o, t) {
  o = o || {};
  var X = function (v) { return cx + v * k; }, Y = function (v) { return base + v * k; };
  blob(X(0), Y(-12), 12 * k, 12.5 * k, M.w, M.k, M.wsh);
  blob(X(5), Y(-16), 5 * k, 4 * k, M.o, null); blob(X(-6), Y(-7), 3.5 * k, 3 * k, M.o, null);
  blob(X(0), Y(-8), 7 * k, 6 * k, "#fffaf4", null);
  blob(X(-5), Y(-2), 3.6 * k, 2.8 * k, M.w, M.k); blob(X(3), Y(-2), 3.6 * k, 2.8 * k, M.w, M.k);
  // patita que llama
  var pw = o.paw || 0, tr = o.tremble ? Math.sin(t * 50) * .8 : 0;
  var PX = lerp(9, 12, pw) + tr, PY = lerp(-8, -33, pw);
  var drawPaw = function () { limb(X(8), Y(-18), X(PX), Y(PY), 3.2 * k, M.w, M.k);
    blob(X(PX), Y(PY), 4 * k, 4 * k, M.w, M.k); blob(X(PX), Y(PY + .6), 1.8 * k, 1.5 * k, M.p, null); };
  if (!o.pawFront) drawPaw();
  // collar y cascabel
  rect(X(-9), Y(-23), 18 * k, 2.6 * k, "#C8452C"); blob(X(0), Y(-19.5), 2.4 * k, 2.4 * k, "#f2c14e", "#8a5a14", null, "#fff2b0");
  // cabeza
  var hk = k * .92, HX = cx, HY = base - 33 * k;
  maruFace(HX, HY, hk, { glint: o.awake }, t);
  var ex = function (s) { return HX + s * 6 * hk; }, ey = HY - hk;
  if (!o.awake) { [-1, 1].forEach(function (s) { rect(ex(s) - 4 * hk, ey - 3 * hk, 8 * hk, 5 * hk, s > 0 ? M.w : M.w); line(ex(s) - 3 * hk, ey + .5 * hk, ex(s) + 3 * hk, ey + .5 * hk, M.k, Math.max(1, hk * .8)); }); }
  if (o.wink) { rect(ex(1) - 4 * hk, ey - 3 * hk, 8 * hk, 5 * hk, M.w); line(ex(1) - 3 * hk, ey + hk, ex(1), ey - hk, M.k, Math.max(1, hk * .8)); line(ex(1), ey - hk, ex(1) + 3 * hk, ey + hk, M.k, Math.max(1, hk * .8)); }
  if (o.glow > 0) { g.save(); g.globalAlpha = o.glow * .55; blob(ex(-1), ey, 6 * hk, 5 * hk, "#ffe7a0", null); blob(ex(1), ey, 6 * hk, 5 * hk, "#ffe7a0", null); g.restore(); }
  if (o.pawFront) drawPaw();
  // polvo
  var d = o.dust || 0;
  if (d > 0) {
    g.save(); g.globalAlpha = d * .55;
    blob(X(0), Y(-12), 12 * k, 12.5 * k, "#8e8474", null); blob(HX, HY, 16 * hk, 13 * hk, "#8e8474", null);
    g.globalAlpha = d * .9;
    for (var i = 0; i < 70; i++) px(X((hash(i + 3) - .5) * 30), Y(-2 - hash(i + 7) * 46), i % 3 ? "#6f6658" : "#a89e8c");
    g.restore();
  }
}

/* Peatón con paraguas. dir: 1 → derecha; phone: mira el celular */
function walker(x, base, k, o, t) {
  o = o || {};
  var X = function (v) { return x + v * k; }, Y = function (v) { return base + v * k; };
  var step = o.still ? 0 : Math.sin(t * 11 + (o.seed || 0));
  var coat = o.coat || "#2a3348", skin = o.skin || "#e0b48e", hair = o.hair || "#1c1418";
  rect(X(-3 + step * 1.5), Y(-12), 2.4 * k, 12 * k, "#15171f"); rect(X(1 - step * 1.5), Y(-12), 2.4 * k, 12 * k, "#15171f");
  quad([X(-6), Y(-30), X(6), Y(-30), X(7), Y(-10), X(-7), Y(-10)], coat);
  rect(X(-6), Y(-30), 2 * k, 20 * k, mixHex(coat, "#ffffff", .12));
  blob(X(0), Y(-35), 4.4 * k, 4.8 * k, skin, "#2a1a14");
  blob(X(0), Y(-37.5), 4.8 * k, 3 * k, hair, null); if (o.bob) { rect(X(-5), Y(-37), 2 * k, 5 * k, hair); rect(X(3), Y(-37), 2 * k, 5 * k, hair); }
  var d = o.dir || 1;
  px(X(d * 2), Y(-35), "#1a1014");
  if (o.phone) { rect(X(d * 4), Y(-27), 2 * k, 3 * k, "#0e0f16"); g.save(); g.globalAlpha = .5; blob(X(d * 2.5), Y(-33), 3 * k, 3 * k, "#9fd8ff", null); g.restore(); rect(X(d * 4.3), Y(-26.6), 1.4 * k, 2.2 * k, "#bfe8ff"); }
  if (o.umbrella) {
    var uc = o.umbrella, ux = X(o.phone ? -d * 1 : 0), uy = Y(-44);
    line(ux, uy, ux, Y(-26), "#2a2a30", Math.max(1, k * .5));
    for (var r = 0; r < 7 * k; r++) { var ww = Math.sqrt(1 - Math.pow(1 - r / (7 * k), 2)) * 12 * k; rect(ux - ww, uy - 7 * k + r, ww * 2, 1, r < 2 ? mixHex(uc, "#ffffff", .25) : uc); }
    for (var s = -2; s <= 2; s++) px(ux + s * 5 * k, uy, mixHex(uc, "#000000", .35));
  }
}

/* Paloma */
function pigeon(x, y, k, fly, t) {
  var X = function (v) { return x + v * k; }, Y = function (v) { return y + v * k; };
  blob(X(0), Y(0), 4 * k, 3 * k, "#7c8494", "#2a2e38", "#5c6474"); blob(X(3.5), Y(-3), 2.2 * k, 2.2 * k, "#6a7282", "#2a2e38"); px(X(4.2), Y(-3.4), "#f0d060");
  tri(X(5.4), Y(-3), X(7), Y(-2.4), X(5.4), Y(-2), "#e0a060");
  if (fly) { var f = Math.sin(t * 40) * 4; tri(X(-1), Y(-1), X(-6), Y(-5 - f), X(2), Y(-2), "#8c94a4"); } else { rect(X(-1), Y(3), 1, 2 * k, "#e0a060"); rect(X(1), Y(3), 1, 2 * k, "#e0a060"); }
}

/* ===== LA CALLE DEL RAMEN (v2: local con vida) ===== */
var NIGHT = ["#060812", "#0b1024", "#141536", "#211846", "#2c1c4e"];
var DAY = ["#6aa6d8", "#8cbfe2", "#b4d6ec", "#d8e8f2", "#eef2f4"];
function skyAt(env) {
  var d = env.day || 0;
  if (d <= 0) return NIGHT;
  return NIGHT.map(function (c, i) { return mixHex(c, DAY[i], d); });
}
function glowRect(x, y, w, h, c, a) { g.save(); g.globalAlpha = a; rect(x, y, w, h, c); g.restore(); }
function glowBlob(x, y, r, c, a) { g.save(); g.globalAlpha = a; blob(x, y, r, r, c, null); g.globalAlpha = a * .5; blob(x, y, r * 1.8, r * 1.6, c, null); g.restore(); }
function glyph(x, y, s, c, n) { // pseudo-kanji en bloques
  var h = hash(n + 1), h2 = hash(n + 2);
  rect(x, y + s * .2, s, Math.max(1, s * .15), c); rect(x + s * .42, y, Math.max(1, s * .16), s, c);
  if (h > .5) rect(x, y + s * .7, s, Math.max(1, s * .15), c); else rect(x + s * .1, y + s * .55, s * .8, Math.max(1, s * .14), c);
  if (h2 > .5) rect(x + s * .1, y + s * .35, Math.max(1, s * .14), s * .5, c); else rect(x + s * .75, y + s * .35, Math.max(1, s * .14), s * .5, c);
}
/* env: day, lantern 0..1, neon2x1, sunA, dust, snow, oy, maneki(false), manekiO */
function ramenStreet(t, env) {
  env = env || {};
  var oy = env.oy || 0, d = env.day || 0, dust = env.dust || 0, ln = env.lantern === undefined ? 1 : env.lantern, night = 1 - d;
  var warm = ln * (1 - dust * .75);
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (!env.shopOnly) gradient(skyAt(env), 0, PH);
  g.setTransform(1, 0, 0, 1, 0, Math.round(oy));
  if (!env.shopOnly) {
  if (env.sunA !== undefined) {
    var a = env.sunA, sx = 135 + Math.cos(a) * 150, sy = 120 - Math.sin(a) * 150;
    if (d > .4) glowBlob(sx, sy, 11, "#fff2b0", .9); else { blob(sx, sy, 8, 8, "#eef0ff", null); blob(sx + 4, sy - 2, 7, 7, skyAt(env)[1], null); }
  }
  // estrellas y torre de Tokio al fondo
  for (var s0 = 0; s0 < 40; s0++) if (night > .5 && (Math.sin(t * 2 + s0) + 1) > .6) px(hash(s0) * PW, -280 + hash(s0 + 9) * 300, "#cfd6ff");
  var tx = 196, ty = -40;
  var tc = mixHex("#c8452c", "#8a4a3a", d);
  tri(tx - 16, 150, tx + 16, 150, tx, ty, "#1a1426"); line(tx - 14, 150, tx, ty, tc, 1); line(tx + 14, 150, tx, ty, tc, 1);
  for (var tb = 0; tb < 7; tb++) { var yy = ty + 20 + tb * 18, ww = (yy - ty) / 190 * 16; line(tx - ww, yy, tx + ww, yy, tc, 1); }
  rect(tx - 7, 60, 14, 4, tc); rect(tx - 4, 20, 8, 3, tc); if (Math.floor(t * 2) % 2) px(tx, ty - 1, "#ff6a5a");
  // skyline lejano
  for (var i = 0; i < 10; i++) {
    var bx = i * 29 - 10, bh = 180 + hash(i + 3) * 200, top = 190 - bh, bw = 28;
    rect(bx, top, bw, bh + 10, mixHex(i % 2 ? "#10132a" : "#0c0f22", "#6a7a90", d * .7));
    for (var r = 0; r < bh / 11; r++) for (var c = 0; c < 3; c++) if (hash(i * 17 + r * 3 + c) > .78) rect(bx + 4 + c * 8, top + 6 + r * 11, 4, 5, d > .5 ? "#5a6a80" : ((Math.floor(t * 1.5 + r + c) % 13) ? "#d8b46a" : "#5a4a34"));
    if (i % 3 === 1) { var ny = top + 24 + hash(i) * 50, nc = ["#ff4f9a", "#4fe0ff", "#ffd24f"][Math.floor(hash(i + 1) * 3)];
      glowRect(bx + 6, ny - 3, 18, 58, nc, .22 * night); rect(bx + 9, ny, 12, 52, mixHex(nc, "#333344", d)); for (var q = 0; q < 4; q++) glyph(bx + 11, ny + 4 + q * 12, 8, mixHex("#fff6ee", nc, .3), i * 7 + q); }
  }
  // cables de luz
  for (var cw = 0; cw < 2; cw++) for (var xx = 0; xx < PW; xx++) { var cy = 118 + cw * 9 + Math.pow((xx - 135) / 135, 2) * -14 + 14; px(xx, cy, "#05060c"); }
  rect(252, 90, 4, 110, "#0a0b14"); rect(244, 98, 20, 3, "#0a0b14");
  // ===== vecino izquierdo (2x1) + máquina expendedora =====
  rect(0, 150, 42, 250, "#15111f"); rect(0, 150, 42, 3, "#2a2436");
  var nOn = env.neon2x1 || 0;
  glowRect(2, 176, 36, 92, "#ff3f8e", (.08 + .3 * nOn) * night + .02);
  rect(8, 180, 24, 84, nOn > .5 ? "#ff5fa4" : "#3a1a2c"); rect(11, 183, 18, 78, nOn > .5 ? "#ffd0e6" : "#261420");
  // máquina expendedora
  var vx = 6, vy = 316;
  glowRect(0, 400, 50, 30, "#8fd0ff", .12 * night);
  rect(vx, vy, 30, 84, "#1a1c26"); rect(vx + 1, vy + 1, 28, 82, "#dfe6ef"); rect(vx + 3, vy + 4, 24, 44, "#9fd8ff");
  for (var br = 0; br < 3; br++) for (var bc2 = 0; bc2 < 4; bc2++) { rect(vx + 5 + bc2 * 6, vy + 8 + br * 13, 3, 8, ["#e85a4a", "#f2c14e", "#5fb86a", "#4a8ae0"][(bc2 + br) % 4]); rect(vx + 5 + bc2 * 6, vy + 17 + br * 13, 3, 1, "#2a2a3a"); }
  rect(vx + 3, vy + 52, 24, 6, "#2a2e3a"); rect(vx + 20, vy + 62, 6, 10, "#2a2e3a"); rect(vx + 3, vy + 74, 24, 6, "#1a1c26");
  glowRect(vx - 2, vy - 2, 34, 50, "#bfe8ff", .1 * night);
  }
  // ===== el local de Tanuki (2 pisos) =====
  // piso de arriba
  rect(40, 104, 200, 96, mixHex("#2a2234", "#3a3440", dust * .5));
  for (var bm = 0; bm < 4; bm++) rect(40 + bm * 66, 104, 3, 96, "#1c1624");
  rect(40, 104, 200, 3, "#1c1624");
  rect(64, 126, 56, 46, "#1c1624"); rect(66, 128, 52, 42, d > .5 ? "#8aa4c0" : mixHex("#f2b86a", "#4a3e36", dust));
  for (var bl = 0; bl < 6; bl++) rect(66, 129 + bl * 7, 52, 1, "#c8904a");
  blob(80, 162, 7, 9, "#2a4a2a", null); rect(78, 164, 4, 6, "#4a3020");
  rect(130, 126, 56, 46, "#1c1624"); rect(132, 128, 52, 42, d > .5 ? "#8aa4c0" : "#24203a");
  // cartel vertical luminoso
  var sgOn = night * (1 - dust * .6);
  glowRect(208, 84, 30, 126, "#ff4a2a", .25 * sgOn);
  rect(212, 88, 22, 118, "#b8261a"); rect(214, 90, 18, 114, "#d8382a");
  for (var gq = 0; gq < 5; gq++) glyph(217, 95 + gq * 21, 12, "#fff6ee", 50 + gq);
  // ducto con vapor
  rect(190, 150, 6, 50, "#3a3a46"); rect(188, 146, 10, 6, "#4a4a56");
  for (var sp = 0; sp < 4; sp++) { var ph = (t * .7 + sp * .25) % 1; g.save(); g.globalAlpha = (1 - ph) * .35 * (1 - dust); blob(193 + Math.sin(t * 2 + sp) * 3, 142 - ph * 40, 3 + ph * 6, 3 + ph * 5, "#e8e8f0", null); g.restore(); }
  // alero de tejas
  quad([32, 196, 248, 196, 242, 216, 38, 216], "#1a1c2a");
  for (var tl2 = 0; tl2 < 18; tl2++) { rect(36 + tl2 * 12, 198, 10, 3, "#2c3044"); rect(36 + tl2 * 12, 204, 10, 2, "#23263a"); }
  rect(32, 214, 216, 3, mixHex("#8a6a3a", "#4a4a4a", dust));
  if (env.snow) { rect(30, 190, 220, 6, "#f2f5fa"); rect(34, 188, 210, 2, "#ffffff"); rect(40, 100, 200, 5, "#f2f5fa"); }
  // guirnalda de farolitos
  for (var lx2 = 48; lx2 <= 232; lx2++) px(lx2, 222 + Math.sin((lx2 - 48) / 184 * Math.PI) * 5, "#0a0808");
  for (var lf = 0; lf < 8; lf++) { var fx = 56 + lf * 25, fy = 226 + Math.sin((fx - 48) / 184 * Math.PI) * 5, fo = warm * (.85 + .15 * Math.sin(t * 3 + lf));
    if (fo > .05) glowBlob(fx, fy, 5, "#ff6a3a", .22 * fo); blob(fx, fy, 3, 4, mixHex("#4a1a14", "#f0503a", fo), "#1a0a08", null, mixHex("#6a2a1a", "#ffb08a", fo)); }
  // postes de madera
  [42, 84, 190, 236].forEach(function (p) { rect(p - 2, 216, 5, 184, mixHex("#4a2c1a", "#4a4440", dust * .5)); rect(p - 2, 216, 2, 184, mixHex("#6a4428", "#5a5450", dust * .5)); });
  // pared baja lateral
  rect(44, 216, 38, 184, mixHex("#3a2418", "#403830", dust * .6)); for (var pl = 0; pl < 11; pl++) rect(44, 222 + pl * 16, 38, 1, "#2a180e");
  // puertas shoji iluminadas
  var sh = warm, paper = mixHex(mixHex("#3a3026", "#f6d9a0", sh), "#c8d0dc", d * .6);
  rect(87, 234, 101, 166, "#3a2414"); rect(89, 236, 97, 164, paper);
  if (sh > .1) glowRect(80, 232, 115, 170, "#ffcf7a", .12 * sh);
  for (var gx = 0; gx < 8; gx++) rect(89 + gx * 12.2, 236, 1, 164, "#6a4a2a");
  for (var gy = 0; gy < 12; gy++) rect(89, 236 + gy * 14, 97, 1, "#6a4a2a");
  rect(136, 236, 3, 164, "#3a2414"); rect(89, 360, 97, 40, mixHex("#4a2c1a", "#4a4440", dust * .5));
  // sombras de clientes dentro (solo si hay gente)
  if (env.crowd) for (var cs = 0; cs < 3; cs++) { blob(104 + cs * 30, 300, 7, 8, "#8a6a44", null); rect(97 + cs * 30, 306, 14, 40, "#8a6a44"); }
  // noren azul con el círculo de Maru
  var sway = Math.sin(t * 2) * 1.2, nc2 = mixHex("#1f2c54", "#4a4a56", dust * .6);
  for (var nn = 0; nn < 3; nn++) { var nx = 89 + nn * 33; quad([nx, 232, nx + 31, 232, nx + 31 + sway, 272, nx + sway, 272], nc2); rect(nx, 232, 31, 3, "#141c3a"); }
  blob(138 + sway * .5, 250, 9, 9, "#f4efe4", null); blob(138 + sway * .5, 250, 5, 5, nc2, null); blob(138 + sway * .5, 250, 2, 2, "#C8452C", null);
  rect(85, 228, 105, 5, "#2a1810");
  // vitrina con sampuru y el maneki
  rect(193, 244, 40, 76, "#2a1a10"); rect(195, 246, 36, 72, d > .5 ? "#aac0d0" : mixHex("#f2c888", "#3e3832", dust));
  rect(195, 286, 36, 3, "#8a6a4a");
  ramenBowl(204, 282, .55, 0, dust, t); ramenBowl(223, 282, .55, 0, dust, t);
  if (env.maneki !== false) maneki(213, 316, .7, env.manekiO || { paw: .8, dust: dust, awake: false }, t);
  // farol grande (chochin)
  var lx = 63, ly = 262;
  line(lx, 218, lx, 242, "#1a1210", 1);
  if (ln > 0) { g.save(); g.globalAlpha = .22 * ln; blob(lx, ly, 26, 28, "#ff6a3a", null); g.globalAlpha = .12 * ln; blob(lx, ly, 44, 42, "#ff4a2a", null); g.restore(); }
  blob(lx, ly, 12, 17, mixHex("#5a1a14", "#e8442c", ln), "#1a1210", mixHex("#3a100c", "#b02a1a", ln), mixHex("#6a2a1a", "#ff8a5a", ln));
  for (var lr = -3; lr <= 3; lr++) rect(lx - 11, ly + lr * 5, 22, 1, mixHex("#3a100c", "#a0281a", ln));
  rect(lx - 7, 244, 14, 3, "#1a1210"); rect(lx - 7, 278, 14, 3, "#1a1210");
  glyph(lx - 5, ly - 8, 10, ln > .5 ? "#2a0a08" : "#1a0806", 99);
  // pizarra de menú (A-frame)
  quad([200, 400, 206, 356, 226, 356, 232, 400], "#3a2414"); rect(205, 360, 22, 30, "#1f3a2c");
  blob(216, 370, 6, 3, null, "#e8e4d8"); rect(210, 371, 12, 3, "#e8e4d8"); rect(208, 380, 16, 1, "#c8c4b8"); rect(208, 384, 11, 1, "#c8c4b8");
  // macetas y cajas
  rect(48, 380, 14, 20, "#6a3a24"); for (var lv = 0; lv < 7; lv++) line(55, 380, 48 + lv * 2.4, 356 + (lv % 3) * 4, "#3f7a3a", 1);
  rect(66, 386, 16, 14, "#8a6a3a"); rect(66, 386, 16, 2, "#a8844a");
  // telarañas y polvo
  if (dust > 0) {
    g.save(); g.globalAlpha = dust * .9;
    for (var s2 = 0; s2 < 6; s2++) { line(89, 236 + s2 * 5, 89 + s2 * 5, 236, "#c8c8d0", 1); line(186, 236 + s2 * 5, 186 - s2 * 5, 236, "#c8c8d0", 1); }
    line(89, 236, 117, 264, "#c8c8d0", 1); line(186, 236, 158, 264, "#c8c8d0", 1);
    g.globalAlpha = dust * .25; rect(40, 104, 200, 296, "#6a6258");
    g.restore();
  }
  if (env.shopOnly) { g.setTransform(1, 0, 0, 1, 0, 0); return; }
  // edificio derecho
  rect(240, 160, 30, 240, "#14131f"); for (var w2 = 0; w2 < 5; w2++) rect(246, 176 + w2 * 34, 18, 16, (w2 + Math.floor(t)) % 4 ? "#241f34" : "#7a5a3a");
  rect(244, 330, 20, 14, "#3a3c48"); rect(246, 332, 16, 10, "#2a2c36");
  // vereda y pista mojada
  rect(0, 400, PW, 8, mixHex("#1a1a26", "#6a7080", d * .6)); rect(0, 400, PW, 1, "#3a3a4a");
  rect(0, 408, PW, 72, mixHex("#0a0c16", "#5a6070", d * .6));
  if (env.snow) { rect(0, 398, PW, 10, "#e8ecf4"); }
  if (sh > .1) { g.save(); g.globalAlpha = .18 * sh; tri(88, 400, 188, 400, 230, 480, "#ffcf7a"); tri(88, 400, 40, 480, 230, 480, "#ffcf7a"); g.restore(); }
  g.save(); g.globalAlpha = .5 * (1 - d * .7);
  for (var rf = 0; rf < 30; rf++) { var wob = Math.sin(t * 3 + rf * .7) * 2; rect(lx - 9 + wob, 410 + rf * 2, 18, 1, rf % 2 ? "#ff5a3a" : "#8a2a1a"); }
  for (var rf3 = 0; rf3 < 30; rf3++) { var wob3 = Math.sin(t * 2.4 + rf3) * 2; if (sh > .1) rect(92 + wob3, 410 + rf3 * 2, 92, 1, rf3 % 3 ? mixHex("#5a4024", "#f6d9a0", sh * .7) : "#a8743e"); }
  for (var rf2 = 0; rf2 < 26; rf2++) rect(9 + Math.sin(t * 2 + rf2) * 2, 410 + rf2 * 2.5, 22, 1, "#6aa8d8");
  for (var rf4 = 0; rf4 < 22; rf4++) rect(212 + Math.sin(t * 2.2 + rf4) * 2, 410 + rf4 * 3, 20, 1, "#d8382a");
  if (nOn > .5) for (var rf5 = 0; rf5 < 20; rf5++) rect(10 + Math.sin(t * 2 + rf5) * 2, 440 + rf5 * 2, 20, 1, "#ff5fa4");
  g.restore();
  for (var pd = 0; pd < 6; pd++) { var pxx = 18 + pd * 46, pr = (t * 1.3 + pd * .37) % 1; g.save(); g.globalAlpha = (1 - pr) * .55; blob(pxx, 446 + (pd % 2) * 18, 2 + pr * 10, 1 + pr * 3, null, "#8a9ac0"); g.restore(); }
  g.setTransform(1, 0, 0, 1, 0, 0);
}

/* Clima encima de todo (lluvia, hojas, nieve, sakura) */
function weather(t, kind, amt) {
  amt = amt === undefined ? 1 : amt;
  if (kind === "rain") for (var d = 0; d < 90 * amt; d++) { var dx = hash(d) * PW, dy = (hash(d + 9) * PH + t * 300) % PH; line(dx, dy, dx - 2, dy + 7, "rgba(170,190,255,.45)"); }
  if (kind === "autumn") for (var a = 0; a < 40; a++) { var ax = (hash(a) * PW + Math.sin(t * 2 + a) * 16 + t * 20) % PW, ay = (hash(a + 5) * PH + t * 90) % PH; rect(ax, ay, 3, 2, a % 3 ? "#d8702a" : "#e8a83a"); }
  if (kind === "snow") for (var s = 0; s < 80; s++) { var sx = (hash(s) * PW + Math.sin(t * 1.5 + s) * 10) % PW, sy = (hash(s + 5) * PH + t * 60) % PH; rect(sx, sy, s % 4 ? 1 : 2, s % 4 ? 1 : 2, "#ffffff"); }
  if (kind === "sakura") for (var k2 = 0; k2 < 50; k2++) { var kx = (hash(k2) * PW + Math.sin(t * 2.5 + k2) * 14 + t * 30) % PW, ky = (hash(k2 + 5) * PH + t * 70) % PH; rect(kx, ky, 2, 2, k2 % 2 ? "#ffb6cf" : "#ffd6e4"); }
}
/* Tazón de ramen */
function ramenBowl(x, y, s, steam, mold, t) {
  blob(x, y, 9 * s, 4 * s, mixHex("#e8c070", "#6a8a4a", mold), "#2a1a10"); rect(x - 9 * s, y, 18 * s, 4 * s, "#C8452C"); blob(x, y + 4 * s, 7 * s, 3 * s, "#8a2a1a", null);
  rect(x - 5 * s, y - 2 * s, 4 * s, 1 * s, "#f4f1ea"); rect(x + 2 * s, y - 1.5 * s, 3 * s, 1.2 * s, "#5a8a3a");
  if (mold > .3) for (var m = 0; m < 6; m++) blob(x - 6 * s + m * 2.4 * s, y - 1 * s, 1.2 * s, .8 * s, "#7aa04a", null);
  if (steam > 0) for (var p = 0; p < 4; p++) { var ph = (t * .9 + p * .25) % 1; g.save(); g.globalAlpha = steam * (1 - ph) * .7; blob(x - 5 * s + p * 3.5 * s + Math.sin(t * 3 + p) * 2, y - 4 * s - ph * 22 * s / 2, (1.5 + ph * 2) * s, (1.5 + ph * 2) * s, "#f4f1ea", null); g.restore(); }
}
/* Primer plano de la patita cargando energía (último frame antes del drop; también lo usa el 3D) */
function pawShot(T, down) {
  gradient(["#0a0812", "#140c1c", "#1c1020"], 0, PH);
  var ck = pk(T, 21.583, .55);
  for (var i = 0; i < 90; i++) { var a = hash(i) * 6.283, r = (40 + hash(i + 3) * 160) * (1 - ((T * .9 + hash(i + 7)) % 1)); g.save(); g.globalAlpha = .4 + .6 * ck; px(135 + Math.cos(a) * r, 190 + Math.sin(a) * r * 1.2, i % 3 ? "#f2d27a" : "#fff2b0"); g.restore(); }
  g.save(); g.globalAlpha = .25 + .45 * ck; blob(135, 190, 30 + ck * 18, 30 + ck * 18, "#ffd98a", null); g.restore();
  maneki(51, 190 + 33 * 7 * (down ? .93 : 1), 7, { paw: down ? .55 : 1, awake: true, glow: .6, tremble: !down, pawFront: true }, T);
}
