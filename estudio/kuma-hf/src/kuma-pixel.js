/* ===== Don Kuma y sus escenarios (se suma al motor pixel de Maru) ===== */
var KU = { out: "#1c120c", fur: "#7a4b2a", sh: "#5a331c", hl: "#9a6538", muz: "#d6a878", muzSh: "#b98a5c", nose: "#1c120c",
  suit: "#1f2a4a", suitSh: "#141c33", suitHl: "#33426e", shirt: "#f4f1ea", tie: "#C8452C", tieSh: "#8e2f1f", shoe: "#0e0b0a" };
var PI_Y = "#ffd84a", PI_S = "#e2b52e", PI_L = "#b88f1c";

function postit(x, y, s, rot, c1, c2) {
  g.save(); g.translate(x, y); g.rotate(rot || 0);
  rect(-s / 2, -s / 2, s, s, c1 || PI_Y); rect(-s / 2, s / 2 - Math.max(1, s * .18), s, Math.max(1, s * .18), c2 || PI_S);
  if (s >= 6) { rect(-s / 2 + 1, -s / 2 + 2, s - 3, 1, PI_L); rect(-s / 2 + 1, -s / 2 + 4, s - 4, 1, PI_L); }
  g.restore();
}

/* Kuma de cuerpo entero. (cx, base) = cadera; k escala; o = pose/expresión */
function kuma(cx, base, k, o, t) {
  o = o || {};
  var X = function (v) { return cx + v * k; }, Y = function (v) { return base + v * k; };
  var jump = o.jump || 0; base -= jump * k;
  if (!o.noLegs) {
    rect(X(-11), Y(0), 9 * k, 20 * k, KU.out); rect(X(-10), Y(0), 7 * k, 19 * k, KU.suit);
    rect(X(2), Y(0), 9 * k, 20 * k, KU.out); rect(X(3), Y(0), 7 * k, 19 * k, KU.suitSh);
    rect(X(-13), Y(19), 12 * k, 4 * k, KU.shoe); rect(X(1), Y(19), 12 * k, 4 * k, KU.shoe);
  }
  // brazos (detrás del torso si están abajo)
  var arm = function (side, hx, hy) {
    limb(X(side * 22), Y(-42), X(hx), Y(hy), 4.2 * k, KU.suit, KU.out);
    blob(X(hx), Y(hy), 4.6 * k, 4.2 * k, KU.fur, KU.out, KU.sh, KU.hl);
  };
  var L = o.left || [-22, -8], R = o.right || [22, -8];
  if (!o.armsFront) { arm(-1, L[0], L[1]); arm(1, R[0], R[1]); }
  // saco
  quad([X(-25), Y(-48), X(25), Y(-48), X(18), Y(1), X(-18), Y(1)], KU.out);
  quad([X(-24), Y(-47), X(24), Y(-47), X(17), Y(0), X(-17), Y(0)], KU.suit);
  quad([X(6), Y(-47), X(24), Y(-47), X(17), Y(0), X(4), Y(0)], KU.suitSh);
  quad([X(-24), Y(-47), X(-14), Y(-47), X(-13), Y(-30), X(-20), Y(-30)], KU.suitHl);
  // camisa y corbata
  tri(X(-8), Y(-47), X(8), Y(-47), X(0), Y(-24), KU.shirt);
  var lo = o.looseTie || 0;
  tri(X(-8), Y(-47), X(-3), Y(-47), X(-1), Y(-26), KU.suitHl); tri(X(8), Y(-47), X(3), Y(-47), X(1), Y(-26), KU.suitSh);
  blob(X(0 + lo * 1.5), Y(-44 + lo * 3), 2.4 * k, 2 * k, KU.tie, KU.out);
  quad([X(-2 + lo * 1.5), Y(-43 + lo * 3), X(2 + lo * 1.5), Y(-43 + lo * 3), X(3 + lo * 3), Y(-22 + lo * 2), X(-1 + lo * 3), Y(-20 + lo * 2)], KU.tie);
  quad([X(1 + lo * 1.5), Y(-43 + lo * 3), X(2 + lo * 1.5), Y(-43 + lo * 3), X(3 + lo * 3), Y(-22 + lo * 2), X(2 + lo * 3), Y(-21 + lo * 2)], KU.tieSh);
  rect(X(9), Y(-16), 2 * k, 2 * k, KU.out); rect(X(9), Y(-8), 2 * k, 2 * k, KU.out);
  if (o.armsFront) { arm(-1, L[0], L[1]); arm(1, R[0], R[1]); }
  kumaHead(cx, base - 62 * k, k, o, t);
}
function kumaHead(cx, cy, k, o, t) {
  var X = function (v) { return cx + v * k; }, Y = function (v) { return cy + v * k; };
  // orejas
  blob(X(-11), Y(-11), 5.2 * k, 5.2 * k, KU.fur, KU.out, KU.sh, KU.hl); blob(X(-11), Y(-10.5), 2.6 * k, 2.6 * k, KU.muzSh, null);
  blob(X(11), Y(-11), 5.2 * k, 5.2 * k, KU.fur, KU.out, KU.sh, KU.hl); blob(X(11), Y(-10.5), 2.6 * k, 2.6 * k, KU.muzSh, null);
  // pelos de punta del susto
  if (o.spikes) for (var s = 0; s < 6; s++) tri(X(-10 + s * 4), Y(-12), X(-8 + s * 4), Y(-19 - (s % 2) * 3), X(-6 + s * 4), Y(-12), KU.fur);
  blob(X(0), Y(0), 15 * k, 14 * k, KU.fur, KU.out, KU.sh, KU.hl);
  blob(X(0), Y(6), 7.5 * k, 5.5 * k, KU.muz, null);
  blob(X(1.5), Y(7.5), 4 * k, 2.5 * k, KU.muzSh, null, null, null);
  blob(X(0), Y(3.5), 2.6 * k, 1.8 * k, KU.nose, null); px(X(-.8), Y(3), "#6b5a50");
  var e = o.eyes || "normal", m = o.mouth || "flat";
  var K = KU.out;
  var eye = function (side, kind) {
    var ex = side * 6, ey = -2;
    if (kind === "normal") { rect(X(ex - 1.2), Y(ey - 1.4), 2.6 * k, 2.8 * k, K); px(X(ex - .6), Y(ey - 1), "#fff"); }
    if (kind === "small") { rect(X(ex - .8), Y(ey - .6), 1.8 * k, 1.8 * k, K); }
    if (kind === "big") { blob(X(ex), Y(ey), 4 * k, 4.4 * k, "#fffaf0", K); var j = o.tremble ? Math.sin(t * 60 + side) * .6 : 0; blob(X(ex + j), Y(ey + .5), 1.3 * k, 1.5 * k, K); }
    if (kind === "closed") { line(X(ex - 2.5), Y(ey + .5), X(ex + 2.5), Y(ey + .5), K, Math.max(1, k * .8)); }
    if (kind === "happy") { line(X(ex - 2.5), Y(ey + 1), X(ex), Y(ey - 1), K, Math.max(1, k * .8)); line(X(ex), Y(ey - 1), X(ex + 2.5), Y(ey + 1), K, Math.max(1, k * .8)); }
    if (kind === "half") { rect(X(ex - 2.5), Y(ey), 5 * k, 1.4 * k, K); rect(X(ex - 1.2), Y(ey + 1.2), 2.6 * k, 1.2 * k, K); }
  };
  if (e === "normal") { eye(-1, "normal"); eye(1, "normal"); }
  if (e === "stress") { eye(-1, "small"); eye(1, "small"); line(X(-9), Y(-7), X(-3), Y(-5.5), K, Math.max(1, k * .7)); line(X(9), Y(-7), X(3), Y(-5.5), K, Math.max(1, k * .7)); }
  if (e === "twitch") { eye(-1, "small"); if (Math.floor(t * 16) % 2) eye(1, "big"); else eye(1, "closed"); }
  if (e === "panic") { eye(-1, "big"); eye(1, "big"); }
  if (e === "confused") { eye(-1, "normal"); eye(1, "small"); line(X(3), Y(-8), X(9), Y(-9), K, Math.max(1, k * .7)); }
  if (e === "relaxed") { eye(-1, "half"); eye(1, "half"); }
  if (e === "wink") { eye(-1, "normal"); eye(1, "happy"); }
  if (m === "flat") line(X(-2.5), Y(9.5), X(2.5), Y(9.5), K, Math.max(1, k * .7));
  if (m === "smile") { line(X(-3.5), Y(8.5), X(0), Y(10), K, Math.max(1, k * .7)); line(X(0), Y(10), X(3.5), Y(8.5), K, Math.max(1, k * .7)); }
  if (m === "o") blob(X(0), Y(10), 2.4 * k, 2.8 * k, "#3a1410", K);
  if (m === "wave") for (var w = 0; w < 5; w++) line(X(-4 + w * 2), Y(9.5 + (w % 2)), X(-2 + w * 2), Y(9.5 + ((w + 1) % 2)), K, Math.max(1, k * .6));
  if (o.sweat) { blob(X(13), Y(-6), 1.6 * k, 2.4 * k, "#8fd0ff", "#4a7ab0"); }
  if (o.blush) { blob(X(-10), Y(4), 2.2 * k, 1.2 * k, "#e28b7a", null); blob(X(10), Y(4), 2.2 * k, 1.2 * k, "#e28b7a", null); }
  if (o.faceNote) postit(X(0), Y(3), 14 * k, -.15);
  if (o.foreheadNote) postit(X(0), Y(-8), 9 * k, .12);
  if (o.steam) for (var p = 0; p < 4; p++) { var ph = (t * 1.6 + p * .25) % 1; blob(X(-15 - ph * 6), Y(-12 - ph * 14), (1.5 + ph * 2.5) * k, (1.5 + ph * 2.5) * k, "rgba(240,240,240," + (1 - ph) + ")", null); blob(X(15 + ph * 6), Y(-12 - ph * 14), (1.5 + ph * 2.5) * k, (1.5 + ph * 2.5) * k, "rgba(240,240,240," + (1 - ph) + ")", null); }
}

/* Tokio de noche por la ventana */
function tokyoWindow(x0, y0, w, h, t) {
  gradient(["#070a18", "#0e1230", "#1c1640", "#2c1a4a"], y0, y0 + h, x0, x0 + w);
  for (var i = 0; i < 14; i++) {
    var bx = x0 + i * (w / 13) - 4 + hash(i) * 6, bh = h * (.35 + hash(i + 3) * .45), bw = w / 13 + 3;
    rect(bx, y0 + h - bh, bw, bh, i % 2 ? "#141733" : "#10132a");
    for (var r = 0; r < bh / 5; r++) for (var c = 0; c < 3; c++) if (hash(i * 31 + r * 7 + c) > .62) px(bx + 2 + c * 3, y0 + h - bh + 3 + r * 5, (Math.floor(t * 1.5 + i + r) % 9) ? "#f2d27a" : "#6b5a30");
  }
  // letreros de neón
  var neon = function (x, y, ww, hh, c, glowC, on) { if (!on) return; g.save(); g.globalAlpha = .25; rect(x - 3, y - 3, ww + 6, hh + 6, glowC); g.restore(); rect(x, y, ww, hh, c); };
  neon(x0 + w * .12, y0 + h * .3, 5, 22, "#ff4fa3", "#ff4fa3", Math.floor(t * 3) % 7 !== 0);
  neon(x0 + w * .62, y0 + h * .22, 26, 6, "#4ff0ff", "#4ff0ff", true);
  neon(x0 + w * .8, y0 + h * .45, 5, 18, "#ffb34f", "#ffb34f", Math.floor(t * 4) % 9 !== 0);
  // lluvia en el vidrio
  for (var d = 0; d < 30; d++) { var dx = x0 + hash(d) * w, dy = y0 + ((hash(d + 9) * h + t * 90) % h); rect(dx, dy, 1, 3, "rgba(160,190,255,.35)"); }
  rect(x0, y0 + h / 2, w, 2, "#2a2f44"); rect(x0 + w / 2, y0, 2, h, "#2a2f44");
}
function office(t, dim) {
  gradient(["#1a1624", "#221c2e"], 0, PH);
  tokyoWindow(20, 40, 230, 190, t);
  rect(16, 36, 238, 4, "#3a3048"); rect(16, 230, 238, 6, "#3a3048");
  // post-its en la pared y ventana
  for (var i = 0; i < 22; i++) postit(18 + hash(i + 40) * 234, 40 + hash(i + 50) * 200, 8 + hash(i + 60) * 5, (hash(i + 70) - .5) * .6);
}
function desk(t) {
  rect(0, 372, PW, 108, "#3b2618"); rect(0, 372, PW, 6, "#6b4a30"); rect(0, 378, PW, 2, "#2a1a10");
  for (var i = 0; i < 6; i++) rect(0, 392 + i * 14, PW, 1, "#33200f");
  // monitor
  rect(150, 300, 96, 64, "#0e0f16"); rect(154, 304, 88, 54, "#1c3a6a"); rect(154, 304, 88, 2, "#3a6ab0"); rect(194, 364, 10, 10, "#2a2a33"); rect(180, 372, 38, 3, "#2a2a33");
  for (var j = 0; j < 9; j++) postit(158 + (j % 4) * 22, 298 + Math.floor(j / 4) * 20, 12, (hash(j) - .5) * .5);
  // lámpara
  rect(22, 318, 4, 54, "#555"); tri(8, 322, 40, 322, 30, 300, "#C8452C");
  g.save(); g.globalAlpha = .12; tri(10, 322, 40, 322, 60, 372, "#ffe7a3"); g.restore();
  for (var p = 0; p < 12; p++) postit(20 + hash(p + 90) * 230, 382 + hash(p + 91) * 80, 10 + hash(p) * 4, (hash(p + 92) - .5));
}
function street(t) {
  gradient(["#05070f", "#0c1024", "#161634"], 0, 300);
  for (var i = 0; i < 9; i++) { var bx = i * 32 - 6, bh = 120 + hash(i + 5) * 110; rect(bx, 300 - bh, 30, bh, i % 2 ? "#12142a" : "#0f1124"); for (var r = 0; r < bh / 9; r++) for (var c = 0; c < 3; c++) if (hash(i * 13 + r * 3 + c) > .6) rect(bx + 4 + c * 8, 300 - bh + 6 + r * 9, 3, 4, (Math.floor(t * 2 + r) % 11) ? "#e8c46a" : "#5a4a2a"); }
  rect(30, 150, 6, 40, "#ff4fa3"); rect(200, 130, 40, 8, "#4ff0ff");
  // vereda y pista mojada
  rect(0, 300, PW, 20, "#2a2a36"); gradient(["#101320", "#0b0d18"], 320, PH);
  for (var s = 0; s < 8; s++) rect(10 + s * 34, 400, 18, 3, "#3a3a46");
  // reflejos
  g.save(); g.globalAlpha = .25; rect(30, 330, 6, 60, "#ff4fa3"); rect(200, 330, 40, 30, "#4ff0ff"); g.restore();
  // farola
  rect(236, 150, 4, 160, "#3a3a44"); rect(222, 146, 22, 5, "#3a3a44"); blob(226, 154, 5, 3, "#fff2c0", null);
  g.save(); g.globalAlpha = .1; tri(226, 156, 180, 320, 272, 320, "#fff2c0"); g.restore();
  // lluvia
  for (var d = 0; d < 70; d++) { var dx = hash(d) * PW, dy = (hash(d + 9) * PH + t * 260) % PH; line(dx, dy, dx - 2, dy + 6, "rgba(170,190,255,.45)"); }
}
function car(x, y, t, o) {
  o = o || {};
  // carrocería lateral
  quad([x - 90, y, x + 90, y, x + 86, y - 26, x - 88, y - 24], "#0e0b12");
  quad([x - 88, y - 2, x + 88, y - 2, x + 84, y - 24, x - 86, y - 22], "#b8c2d6");
  quad([x - 40, y - 24, x + 44, y - 24, x + 26, y - 50, x - 26, y - 50], "#0e0b12");
  quad([x - 37, y - 25, x + 41, y - 25, x + 24, y - 48, x - 24, y - 48], "#8e98ac");
  rect(x - 88, y - 14, 176, 2, "#e8eef8");
  // ventanas llenas de post-its
  var winA = [x - 34, y - 46, 30, 20], winB = [x + 2, y - 46, 36, 20];
  [winA, winB].forEach(function (w, wi) {
    rect(w[0], w[1], w[2], w[3], "#1a2233");
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) postit(w[0] + 4 + c * (w[2] / 4), w[1] + 4 + r * 7, 6, (hash(r * 7 + c + wi * 13) - .5) * .5);
  });
  // ruedas
  [[x - 56, y], [x + 56, y]].forEach(function (p) { blob(p[0], p[1], 14, 14, "#0e0b12", null); blob(p[0], p[1], 8, 8, "#5a6272", "#0e0b12"); blob(p[0], p[1], 3, 3, "#c0c6d2", null); });
  rect(x + 82, y - 20, 6, 5, "#fff2c0"); rect(x - 90, y - 20, 5, 5, "#ff3b3b");
}
function tornadoPhase(t) {
  // integra la velocidad del tornado: arranca 6.8, acelera, se frena de 12.0 a 12.5 y queda congelado
  var ph = 0, dt = .02;
  for (var s = 6.8; s < t; s += dt) {
    var v = s < 8.6 ? (s - 6.8) / 1.8 * 2 : s < 12.0 ? 2 + Math.min(2.5, (s - 8.6) * 1.4) : s < 12.5 ? (1 - (s - 12.0) / .5) * 4.5 : 0;
    ph += v * dt;
  }
  return ph;
}
function tornadoNotes(cx, cy, t, n, spread, glow) {
  var ph = tornadoPhase(t);
  for (var i = 0; i < n; i++) {
    var a = hash(i) * 6.283 + ph * (1 + hash(i + 3) * .6), r = (30 + hash(i + 5) * 70) * spread, y = cy - 120 + (hash(i + 7) * 190);
    var x = cx + Math.cos(a) * r, z = Math.sin(a);
    var s = 8 + z * 3 + hash(i + 9) * 3;
    if (glow > 0) { g.save(); g.globalAlpha = .3 * glow; blob(x, y, s * 1.2, s * 1.2, "#fff2a8", null); g.restore(); }
    var lit = glow > hash(i + 11);
    postit(x, y, s, a * .7, lit ? "#fff6c8" : PI_Y, lit ? "#ffe07a" : PI_S);
  }
}
