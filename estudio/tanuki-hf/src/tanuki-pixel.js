/* ===== Don Tanuki, Maru maneki-neko y la calle del ramen (se suma al motor pixel de Maru) ===== */
function hx2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function mixHex(a, b, k) {
  if (k <= 0) return a; if (k >= 1) return b;
  var A = hx2rgb(a), B = hx2rgb(b), r = "#";
  for (var i = 0; i < 3; i++) { var v = Math.round(A[i] + (B[i] - A[i]) * k).toString(16); r += v.length < 2 ? "0" + v : v; }
  return r;
}
var TN = { out: "#1a1210", fur: "#8a6440", sh: "#664729", hl: "#ab8559", mask: "#2e211a", belly: "#ecdcbf", bellySh: "#cdb592",
  apron: "#eef0f2", apronSh: "#c9ced6", band: "#f4f1ea", eye: "#fff6e0" };
var TN_OLD = { fur: "#9a948c", sh: "#77716a", hl: "#b9b3aa", mask: "#4a4540", belly: "#e6e2dc", bellySh: "#c8c2ba" };
var TN_STONE = { out: "#2a2a2e", fur: "#8d8d93", sh: "#6b6b72", hl: "#aeaeb4", mask: "#5a5a61", belly: "#a4a4aa", bellySh: "#88888e",
  apron: "#9a9aa0", apronSh: "#7d7d84", band: "#a8a8ae", eye: "#8d8d93" };

/* Tanuki de pie. (cx, base) = pies. o: eyes, mouth, arm ("down"|"wave"|"up"|"present"), beard 0..1, age 0..1, stone 0..1, cane, hunch */
function tanuki(cx, base, k, o, t) {
  o = o || {};
  var age = o.age || 0, st = o.stone || 0, hunch = (o.hunch || 0);
  var C = {};
  ["fur", "sh", "hl", "mask", "belly", "bellySh"].forEach(function (n) { C[n] = mixHex(mixHex(TN[n], TN_OLD[n], clamp(age * 1.4 - .2)), TN_STONE[n], st); });
  ["out", "apron", "apronSh", "band", "eye"].forEach(function (n) { C[n] = mixHex(TN[n], TN_STONE[n], st); });
  var X = function (v) { return cx + v * k; }, Y = function (v) { return base + v * k; };
  var hy = hunch * 4, hxs = hunch * 2;
  // cola rayada
  for (var i = 5; i >= 0; i--) blob(X(12 + i * 2.2), Y(-7 - i * 2.6), 4.3 * k, 4.3 * k, i % 2 ? C.mask : C.fur, C.out);
  // piernas
  blob(X(-7), Y(-3), 5 * k, 4 * k, C.fur, C.out, C.sh); blob(X(7), Y(-3), 5 * k, 4 * k, C.fur, C.out, C.sh);
  var arm = function (side, hx, hy2) { limb(X(side * 12), Y(-27 + hy), X(hx), Y(hy2), 3.2 * k, C.fur, C.out); blob(X(hx), Y(hy2), 3.8 * k, 3.6 * k, C.mask, C.out); };
  var mode = o.arm || "down", ak = o.armK === undefined ? 1 : o.armK;
  var R = [15, -12];
  if (mode === "wave") R = [lerp(15, 18, ak), lerp(-12, -46, ak) + Math.sin(t * 16) * 2 * ak];
  if (mode === "up") R = [lerp(15, 17, ak), lerp(-12, -46, ak)];
  if (mode === "flip") R = [lerp(15, -20, ak), lerp(-12, -24, ak)];
  if (mode === "present") R = [11, -22];
  if (o.cane) R = [16, -16];
  arm(-1, mode === "present" ? -11 : -15, mode === "present" ? -22 : -12 + hunch * 2);
  // cuerpo y panza
  blob(X(0), Y(-18 + hy * .5), 15 * k, 15 * k, C.fur, C.out, C.sh, C.hl);
  blob(X(0), Y(-15 + hy * .5), 10 * k, 11 * k, C.belly, null, C.bellySh);
  // delantal
  rect(X(-9), Y(-25 + hy * .5), 18 * k, 21 * k, C.apron); rect(X(-9), Y(-7 + hy * .5), 18 * k, 3 * k, C.apronSh);
  line(X(-6), Y(-25 + hy * .5), X(-3), Y(-30 + hy), C.apronSh, Math.max(1, k * .7)); line(X(6), Y(-25 + hy * .5), X(3), Y(-30 + hy), C.apronSh, Math.max(1, k * .7));
  if (!st) { rect(X(-3), Y(-18 + hy * .5), 6 * k, 5 * k, "#C8452C"); rect(X(-1.5), Y(-17 + hy * .5), 3 * k, 3 * k, "#fff6ee"); }
  arm(1, R[0], R[1]);
  if (o.cane) { line(X(16), Y(-16), X(18), Y(0), mixHex("#5a3a22", "#6a6a70", st), Math.max(1, k * .9)); line(X(16), Y(-16), X(12), Y(-18), mixHex("#5a3a22", "#6a6a70", st), Math.max(1, k * .9)); }
  // cabeza
  var HX = cx + hxs * k, HY = base + (-40 + hy) * k;
  var Hx = function (v) { return HX + v * k; }, Hy = function (v) { return HY + v * k; };
  blob(Hx(-9), Hy(-10), 4 * k, 4 * k, C.fur, C.out); blob(Hx(-9), Hy(-9.5), 2 * k, 2 * k, C.mask, null);
  blob(Hx(9), Hy(-10), 4 * k, 4 * k, C.fur, C.out); blob(Hx(9), Hy(-9.5), 2 * k, 2 * k, C.mask, null);
  blob(Hx(0), Hy(0), 13 * k, 11.5 * k, C.fur, C.out, C.sh, C.hl);
  blob(Hx(-8), Hy(5), 5 * k, 3.5 * k, C.belly, null); blob(Hx(8), Hy(5), 5 * k, 3.5 * k, C.belly, null);
  blob(Hx(-5), Hy(-1), 5 * k, 3.4 * k, C.mask, null); blob(Hx(5), Hy(-1), 5 * k, 3.4 * k, C.mask, null);
  blob(Hx(0), Hy(5), 5 * k, 3.6 * k, C.belly, null);
  blob(Hx(0), Hy(3), 2.2 * k, 1.6 * k, C.out, null);
  // ojos
  var e = o.eyes || "normal", K = C.out, w = Math.max(1, k * .75);
  var eye = function (side) {
    var ex = side * 5, ey = -1;
    if (st > .6 || e === "stone") { line(Hx(ex - 2), Hy(ey), Hx(ex + 2), Hy(ey), C.sh, w); return; }
    if (e === "normal" || e === "hopeful") { blob(Hx(ex), Hy(ey), (e === "hopeful" ? 2.2 : 1.6) * k, (e === "hopeful" ? 2.4 : 1.8) * k, C.eye, null); px(Hx(ex - .5), Hy(ey - .6), "#ffffff"); blob(Hx(ex + .3), Hy(ey + .3), .8 * k, 1 * k, "#120a08", null); }
    if (e === "happy") { line(Hx(ex - 2), Hy(ey + 1), Hx(ex), Hy(ey - 1), C.eye, w); line(Hx(ex), Hy(ey - 1), Hx(ex + 2), Hy(ey + 1), C.eye, w); }
    if (e === "sad") { blob(Hx(ex), Hy(ey + .5), 1.3 * k, 1.3 * k, C.eye, null); line(Hx(ex - 2.5), Hy(ey - 2.8 + side * .8), Hx(ex + 2.5), Hy(ey - 2.8 - side * .8), C.eye, w); }
    if (e === "closed" || e === "old") { line(Hx(ex - 2), Hy(ey + .3), Hx(ex + 2), Hy(ey + .3), C.eye, w); }
    if (e === "wide") { blob(Hx(ex), Hy(ey), 2.6 * k, 2.8 * k, "#fffaf0", null); blob(Hx(ex), Hy(ey + .4), 1 * k, 1.2 * k, "#120a08", null); }
  };
  eye(-1); eye(1);
  var m = o.mouth || "flat";
  if (m === "smile") { line(Hx(-3), Hy(7), Hx(0), Hy(8.6), K, w); line(Hx(0), Hy(8.6), Hx(3), Hy(7), K, w); }
  if (m === "big") { blob(Hx(0), Hy(8), 3.4 * k, 2.4 * k, "#7a2a22", K); rect(Hx(-2), Hy(6.4), 4 * k, 1 * k, "#fff6ee"); }
  if (m === "flat") line(Hx(-2), Hy(7.6), Hx(2), Hy(7.6), K, w);
  if (m === "sad") { line(Hx(-3), Hy(8.6), Hx(0), Hy(7.2), K, w); line(Hx(0), Hy(7.2), Hx(3), Hy(8.6), K, w); }
  if (m === "o") blob(Hx(0), Hy(8), 1.6 * k, 1.8 * k, "#7a2a22", K);
  // arrugas
  if (age > .45) { var wk = mixHex(C.sh, C.out, .3); line(Hx(-4), Hy(-6), Hx(4), Hy(-6), wk, 1); if (age > .6) { line(Hx(-10), Hy(1), Hx(-8), Hy(3), wk, 1); line(Hx(10), Hy(1), Hx(8), Hy(3), wk, 1); } }
  // barba (crece)
  var b = o.beard || 0;
  if (b > 0) {
    var L = 3 + b * 38, bc = mixHex(mixHex("#d9c6a6", "#f2f2f2", clamp(age * 1.6 - .3)), "#b4b4ba", st), bs = mixHex(mixHex("#b39c78", "#cfcfd4", clamp(age * 1.6 - .3)), "#94949a", st);
    for (var r = 0; r < L; r++) { var ww = (7 - r / L * 4.5) * k, yy = Hy(8 + r); rect(HX - ww, yy, ww * 2, k + 1, r % 5 === 0 ? bs : bc); }
    rect(HX - (7 - 4.5) * k, Hy(8 + L), (7 - 4.5) * 2 * k, k, C.out);
  }
  // hachimaki
  rect(Hx(-12.5), Hy(-9), 25 * k, 3 * k, C.band); rect(Hx(-12.5), Hy(-7), 25 * k, 1 * k, mixHex("#cfc8bc", "#88888e", st));
  if (!st) blob(Hx(0), Hy(-7.6), 1.6 * k, 1.4 * k, "#C8452C", null);
  tri(Hx(12), Hy(-8), Hx(17), Hy(-12), Hx(16), Hy(-6), C.band); tri(Hx(12), Hy(-8), Hx(18), Hy(-4), Hx(15), Hy(-2), C.band);
  if (o.cracks) { var ck = o.cracks, cc = "#3a3a40"; line(Hx(-2), Hy(-10), Hx(-4), Hy(-2), cc, 1); if (ck > .3) line(Hx(-4), Hy(-2), Hx(1), Hy(4), cc, 1); if (ck > .5) line(X(-6), Y(-30), X(4), Y(-16), cc, 1); if (ck > .7) line(X(4), Y(-16), X(-2), Y(-4), cc, 1); }
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

/* ===== LA CALLE DEL RAMEN ===== */
var NIGHT = ["#070914", "#0d1026", "#171338", "#241545", "#2e1a4e"];
var DAY = ["#6aa6d8", "#8cbfe2", "#b4d6ec", "#d8e8f2", "#eef2f4"];
function skyAt(env) {
  var d = env.day || 0;
  if (d <= 0) return NIGHT;
  return NIGHT.map(function (c, i) { return mixHex(c, DAY[i], d); });
}
/* env: day 0..1, lantern 0..1, season "", dust 0..1, oy (grúa), bowl, steam, rainK */
function ramenStreet(t, env) {
  env = env || {};
  var oy = env.oy || 0, d = env.day || 0;
  g.setTransform(1, 0, 0, 1, 0, 0);
  gradient(skyAt(env), 0, PH);
  g.setTransform(1, 0, 0, 1, 0, Math.round(oy));
  // sol / luna
  if (env.sunA !== undefined) {
    var a = env.sunA, sx = 135 + Math.cos(a) * 150, sy = 150 - Math.sin(a) * 140;
    if (d > .4) { blob(sx, sy, 12, 12, "#fff2b0", null); g.save(); g.globalAlpha = .25; blob(sx, sy, 22, 22, "#fff2b0", null); g.restore(); }
    else { blob(sx, sy, 9, 9, "#eef0ff", null); blob(sx + 4, sy - 2, 7, 7, skyAt(env)[1], null); }
  }
  // edificios lejanos con neón (llegan muy arriba para la grúa)
  for (var i = 0; i < 9; i++) {
    var bx = i * 31 - 8, bh = 230 + hash(i + 3) * 220, top = 200 - bh, bw = 30;
    rect(bx, top, bw, bh + 10, mixHex(i % 2 ? "#12142a" : "#0f1124", "#6a7a90", d * .7));
    for (var r = 0; r < bh / 10; r++) for (var c = 0; c < 3; c++) if (hash(i * 17 + r * 3 + c) > .7) rect(bx + 4 + c * 8, top + 6 + r * 10, 4, 5, d > .5 ? "#5a6a80" : ((Math.floor(t * 1.5 + r + c) % 13) ? "#e8c46a" : "#6a5a3a"));
    if (i % 3 === 1) { var ny = top + 20 + hash(i) * 60, nc = ["#ff4f9a", "#4fe0ff", "#ffd24f"][i % 3 === 1 ? Math.floor(hash(i + 1) * 3) : 0];
      g.save(); g.globalAlpha = .25 * (1 - d); rect(bx + 6, ny - 3, 18, 56, nc); g.restore(); rect(bx + 9, ny, 12, 50, mixHex(nc, "#333344", d)); for (var q = 0; q < 4; q++) rect(bx + 11, ny + 4 + q * 12, 8, 7, mixHex("#fff6ee", nc, .4)); }
  }
  // local vecino izquierdo (2x1)
  rect(0, 190, 40, 210, "#16121e"); rect(0, 190, 40, 4, "#2a2436");
  var nOn = env.neon2x1 || 0;
  g.save(); g.globalAlpha = .12 + .35 * nOn; rect(2, 222, 34, 60, "#ff3f8e"); g.restore();
  rect(6, 226, 26, 52, nOn > .5 ? "#ff5fa4" : "#4a2234"); rect(9, 229, 20, 46, nOn > .5 ? "#ffd0e6" : "#2e1a26");
  // edificio derecho
  rect(230, 180, 40, 220, "#14131f"); for (var w2 = 0; w2 < 5; w2++) rect(238, 196 + w2 * 34, 22, 18, (w2 + Math.floor(t)) % 4 ? "#2a2238" : "#8a6a3a");
  // ===== puesto de ramen =====
  var dust = env.dust || 0;
  rect(40, 196, 190, 204, mixHex("#3a2418", "#4a4038", dust * .6));
  for (var p = 0; p < 12; p++) rect(40, 200 + p * 17, 190, 1, "#2e1c12");
  // alero de tejas
  quad([30, 170, 240, 170, 232, 198, 38, 198], "#1c1a24"); for (var tl2 = 0; tl2 < 14; tl2++) rect(34 + tl2 * 15, 172, 1, 24, "#2c2a36");
  rect(30, 196, 210, 4, "#C8452C"); rect(30, 200, 210, 2, "#7a2418");
  if (env.snow) { rect(30, 166, 210, 5, "#f4f6fa"); rect(34, 164, 200, 2, "#ffffff"); }
  // cartel superior (kanji estilizado)
  rect(92, 176, 86, 18, "#f0e6d0"); rect(94, 178, 82, 14, "#e2d6bc");
  [[100, 180], [122, 180], [144, 180], [164, 180]].forEach(function (c2, j) { rect(c2[0], c2[1] + 1, 8, 2, "#2a1a14"); rect(c2[0] + 3, c2[1], 2, 10, "#2a1a14"); if (j % 2) rect(c2[0], c2[1] + 7, 8, 2, "#2a1a14"); else rect(c2[0] + 1, c2[1] + 5, 6, 2, "#C8452C"); });
  // puerta: interior cálido
  rect(90, 214, 90, 186, mixHex("#6a4428", "#2a221c", clamp(dust * 1.2)));
  g.save(); g.globalAlpha = .35 * (1 - dust); gradient(["#f2b46a", "#b87a3a"], 214, 300, 90, 180); g.restore();
  // mostrador/ventana derecha con el maneki pequeño
  rect(186, 234, 38, 60, "#2a1c14"); rect(188, 236, 34, 56, mixHex("#e8a860", "#3a342e", clamp(dust * 1.2)));
  if (env.maneki !== false) maneki(205, 290, .75, env.manekiO || { paw: .8, dust: dust, awake: false }, t);
  rect(186, 290, 38, 6, "#4a3020");
  // noren (cortina roja)
  var sway = Math.sin(t * 2) * 1.2;
  for (var nn = 0; nn < 3; nn++) { var nx = 92 + nn * 30; quad([nx, 214, nx + 28, 214, nx + 28 + sway, 250, nx + sway, 250], mixHex("#b83a26", "#6a4a44", dust * .7)); rect(nx + 10 + sway * .5, 226, 8, 8, "#fff6ee"); rect(nx + 12 + sway * .5, 228, 4, 4, "#C8452C"); }
  rect(88, 210, 94, 5, "#2a1810");
  // farol rojo (chochin)
  var ln = env.lantern || 0, lx = 66, ly = 236;
  line(lx, 202, lx, 216, "#1a1210", 1);
  if (ln > 0) { g.save(); g.globalAlpha = .28 * ln; blob(lx, ly, 30, 30, "#ff6a3a", null); g.globalAlpha = .18 * ln; blob(lx, ly, 48, 44, "#ff4a2a", null); g.restore(); }
  blob(lx, ly, 11, 15, mixHex("#5a1a14", "#e8442c", ln), "#1a1210", mixHex("#3a100c", "#b02a1a", ln), mixHex("#6a2a1a", "#ff8a5a", ln));
  for (var lr = -2; lr <= 2; lr++) rect(lx - 10, ly + lr * 5, 20, 1, mixHex("#3a100c", "#a0281a", ln));
  rect(lx - 6, 220, 12, 3, "#1a1210"); rect(lx - 6, 250, 12, 3, "#1a1210");
  if (ln > .5) { rect(lx - 2, ly - 5, 4, 10, "#2a0a08"); rect(lx - 4, ly - 1, 8, 2, "#2a0a08"); }
  // telarañas y polvo
  if (dust > 0) {
    g.save(); g.globalAlpha = dust;
    for (var s2 = 0; s2 < 6; s2++) { line(90, 214 + s2 * 5, 90 + s2 * 5, 214, "#c8c8d0", 1); line(180, 214 + s2 * 5, 180 - s2 * 5, 214, "#c8c8d0", 1); }
    line(90, 214, 118, 242, "#c8c8d0", 1); line(180, 214, 152, 242, "#c8c8d0", 1);
    g.restore();
  }
  // suelo mojado y reflejos
  rect(0, 400, PW, 80, mixHex("#0c0d16", "#5a6070", d * .6));
  rect(0, 400, PW, 3, "#2a2a3a");
  if (env.snow) { rect(0, 398, PW, 6, "#e8ecf4"); }
  g.save(); g.globalAlpha = .35 * (1 - d * .7);
  if (ln > 0) for (var rf = 0; rf < 30; rf++) rect(lx - 8 + Math.sin(t * 3 + rf) * 2, 404 + rf * 2, 16, 1, rf % 2 ? "#ff5a3a" : "#8a2a1a");
  for (var rf2 = 0; rf2 < 24; rf2++) rect(12 + Math.sin(t * 2 + rf2) * 2, 404 + rf2 * 3, 14, 1, nOn > .5 ? "#ff5fa4" : "#3a1a2a");
  for (var rf3 = 0; rf3 < 26; rf3++) rect(100 + Math.sin(t * 2.4 + rf3) * 2, 404 + rf3 * 2, 70, 1, rf3 % 3 ? "#5a3a24" : "#a8743e");
  g.restore();
  for (var pd = 0; pd < 5; pd++) { var pxx = 20 + pd * 52, pr = (t * 1.3 + pd * .37) % 1; g.save(); g.globalAlpha = (1 - pr) * .6; blob(pxx, 440 + (pd % 2) * 16, 2 + pr * 10, 1 + pr * 3, null, "#8a9ac0"); g.restore(); }
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
