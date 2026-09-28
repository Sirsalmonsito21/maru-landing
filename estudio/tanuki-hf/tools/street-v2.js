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
  gradient(skyAt(env), 0, PH);
  g.setTransform(1, 0, 0, 1, 0, Math.round(oy));
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
