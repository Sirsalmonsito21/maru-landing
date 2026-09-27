// Genera las sub-composiciones del video "Control total de tus gastos con una foto".
// Cada escena: estilos base compartidos (src/base.css) + su propio HTML y timeline GSAP.
import { readFileSync, writeFileSync } from "node:fs";
const BASE = readFileSync("src/base.css", "utf8");

// Tiempos globales (se resincronizan con los golpes cuando llegue la música)
export const SCENES = [
  ["gancho", 0, 2.5], ["problema", 2.5, 2.0], ["foto", 4.5, 2.5], ["bot", 7, 3], ["flujo", 10, 5],
  ["dashboard", 15, 8], ["aviso", 23, 2.5], ["resultado", 25.5, 2], ["cierre", 27.5, 3.5],
];

const RCPT = `<h4>MAKRO</h4><div class="c">RUC 20100070970<br />Boleta B001-004829</div><hr />
<div class="r"><span>Café molido 1kg</span><span>89.90</span></div><div class="r"><span>Leche x12</span><span>62.40</span></div>
<div class="r"><span>Azúcar 5kg</span><span>28.50</span></div><div class="r"><span>Vasos x100</span><span>27.51</span></div><hr />
<div class="r"><span>OP. GRAVADA</span><span>208.31</span></div><div class="r"><span>IGV 18%</span><span>37.49</span></div>
<div class="r tot"><span>TOTAL</span><span>S/ 245.80</span></div><div class="c">26/09/2026 · Café Sakura</div><div class="qr"></div>`;

function wrap(id, dur, css, html, js) {
  return `<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
${BASE}
${css}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-duration="${dur}">
${html}
      </div>
      <script>
        (function () {
        var tl = gsap.timeline({ paused: true });
${js}
        window.__timelines["${id}"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`;
}
const dur = (id) => SCENES.find((s) => s[0] === id)[2];
const out = {};

/* 1 · GANCHO: tres pantallas de texto gigante, fondo claro */
out.gancho = wrap("gancho", dur("gancho"), `
        #g-bg { background: radial-gradient(75% 55% at 50% 48%, #ffffff 0%, #f4f2ee 55%, #d9d6d0 100%); }
        .g-scr { position: absolute; left: 60px; right: 120px; top: 0; bottom: 0; display: grid; align-content: center; justify-items: center; gap: 0; opacity: 0; }
        .g-scr div { font-family: "Montserrat", sans-serif; font-weight: 900; color: #16304a; line-height: .92; letter-spacing: -.035em; white-space: nowrap; text-transform: uppercase; }
        .g-scr .shu { color: #C8452C; }`, `
        <div class="fill" id="g-bg"></div>
        <div class="g-scr" id="g-s1" style="opacity:1"><div style="font-size:196px">¿SABÍAS</div><div style="font-size:300px">QUE?</div></div>
        <div class="g-scr" id="g-s2"><div style="font-size:230px">PUEDES</div><div style="font-size:150px">CONTROLAR</div></div>
        <div class="g-scr" id="g-s3"><div style="font-size:134px">TUS GASTOS</div><div style="font-size:158px">CON UNA</div><div class="shu" style="font-size:300px">FOTO</div></div>`, `
        var T = [0, .75, 1.55];
        tl.fromTo("#g-s1", { scale: 1.06 }, { scale: 1, duration: .35, ease: "expo.out" }, 0);
        ["#g-s2", "#g-s3"].forEach(function (id, i) {
          tl.set(i === 0 ? "#g-s1" : "#g-s2", { opacity: 0 }, T[i + 1]);
          tl.fromTo(id, { opacity: 0, scale: 1.18, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: .16, ease: "expo.out" }, T[i + 1]);
        });
        tl.fromTo("#g-s3 .shu", { scale: .85 }, { scale: 1, duration: .3, ease: "back.out(2.5)" }, T[2] + .1);
        tl.to("#g-s3", { opacity: 0, scale: 1.05, duration: .12, ease: "power2.in" }, 2.38);`);

/* 2 · PROBLEMA */
const papers = Array.from({ length: 9 }, (_, i) => `<div class="rcpt pp" data-layout-allow-overlap id="p-r${i}" style="left:${[60, 520, 300, 700, 140, 470, 620, 20, 360][i]}px;top:0;width:${240 + (i % 3) * 30}px"><h4>${["BODEGA", "MAKRO", "TAMBO", "GRIFO", "PLAZA VEA", "SODIMAC", "MERCADO", "TAXI", "LUZ"][i]}</h4><div class="c">Boleta ${i + 1}0${i}</div><hr /><div class="r"><span>Total</span><span>S/ ${[12.5, 245.8, 8.9, 120, 64.3, 88, 35, 18, 142.6][i]}</span></div></div>`).join("");
out.problema = wrap("problema", dur("problema"), `
        #p-q { position: absolute; z-index: 5; left: 70px; right: 130px; top: 200px; text-align: center; font-size: 66px; font-weight: 900; }
        #p-a { position: absolute; z-index: 5; left: 70px; right: 130px; top: 1400px; text-align: center; font-size: 58px; font-weight: 900; color: #D7B98C; }
        .pp { font-size: 15px; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="left:-40px;top:560px;font-size:520px">乱</div>
        ${papers}
        <div id="p-q">¿Cuánto gastaste este mes?</div>
        <div id="p-a">…ni idea.</div>`, `
        document.querySelectorAll(".pp, .pp *").forEach(function (el) { el.setAttribute("data-layout-allow-overlap", ""); });
        for (var i = 0; i < 9; i++) {
          var r = (i % 2 ? 1 : -1) * (10 + i * 4);
          tl.fromTo("#p-r" + i, { y: -500 - i * 60, rotation: r * .3, opacity: 0 }, { y: 640 + (i % 4) * 160, rotation: r, opacity: 1, duration: 1.6, ease: "power2.out" }, i * .05);
        }
        tl.fromTo("#p-q", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .35, ease: "expo.out" }, .05);
        tl.fromTo("#p-a", { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)" }, 1.0);`);

/* 3 · FOTO */
out.foto = wrap("foto", dur("foto"), `
        #f-phone { left: 280px; top: 440px; }
        #f-view { position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, #3a3128, #15110d); }
        #f-rc { left: 90px; top: 250px; transform-origin: 50% 50%; }
        .f-br { position: absolute; width: 70px; height: 70px; border: 5px solid #F4F1EA; }
        #f-flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
        #f-shot { position: absolute; left: 28px; bottom: 34px; width: 96px; height: 130px; border-radius: 14px; border: 3px solid #F4F1EA; background: #F7F2E6; opacity: 0; }
        #f-btn { position: absolute; left: 50%; bottom: 30px; width: 110px; height: 110px; margin-left: -55px; border-radius: 50%; border: 8px solid #F4F1EA; background: rgba(255,255,255,.2); }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="right:-80px;top:360px;font-size:420px">写</div>
        <div class="step" id="f-step"><b>1</b><div>Tómale una foto<small>a tu boleta o factura</small></div></div>
        <div class="phone" id="f-phone"><div class="isl"></div><div class="scr">
          <div id="f-view"></div>
          <div class="rcpt" id="f-rc">${RCPT}</div>
          <div class="f-br" style="left:60px;top:220px;border-right:0;border-bottom:0"></div><div class="f-br" style="right:60px;top:220px;border-left:0;border-bottom:0"></div>
          <div class="f-br" style="left:60px;bottom:200px;border-right:0;border-top:0"></div><div class="f-br" style="right:60px;bottom:200px;border-left:0;border-top:0"></div>
          <div id="f-btn"></div><div id="f-shot"></div><div id="f-flash"></div>
        </div></div>`, `
        tl.fromTo("#f-phone", { y: 300, rotationX: 18, rotationY: -14, opacity: 0 }, { y: 0, rotationX: 4, rotationY: -6, opacity: 1, duration: .6, ease: "expo.out" }, 0);
        tl.to("#f-phone", { rotationY: 6, duration: 2.5, ease: "none" }, .6);
        tl.fromTo("#f-step", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .4, ease: "expo.out" }, .15);
        tl.fromTo("#f-rc", { scale: 1.12, filter: "blur(6px)" }, { scale: 1, filter: "blur(0px)", duration: .8, ease: "power2.out" }, .3);
        tl.fromTo("#f-btn", { scale: 1 }, { scale: .82, duration: .08, yoyo: true, repeat: 1 }, 1.25);
        tl.fromTo("#f-flash", { opacity: 0 }, { opacity: 1, duration: .03 }, 1.3);
        tl.to("#f-flash", { opacity: 0, duration: .12 }, 1.34);
        tl.fromTo("#f-shot", { opacity: 0, scale: 3, x: 180, y: -380 }, { opacity: 1, scale: 1, x: 0, y: 0, duration: .45, ease: "expo.inOut" }, 1.4);
        tl.to("#f-phone", { opacity: 0, scale: .96, duration: .15 }, 2.35);`);

/* 4 · BOT */
const chatHead = `<div class="hd"><img src="assets/img/sello-maru.png" alt="" /><div><div class="nm">Bot de gastos 丸</div><div class="st">en línea</div></div></div>`;
out.bot = wrap("bot", dur("bot"), `
        #b-phone { left: 280px; top: 440px; }
        .b-photo { width: 250px; height: 330px; border-radius: 18px; overflow: hidden; background: #F7F2E6; position: relative; padding: 0; }
        .b-photo .rcpt { left: 20px; top: 16px; transform: scale(.7); transform-origin: 0 0; box-shadow: none; }
        .b-file { display: flex; align-items: center; gap: 14px; }
        .b-file i { width: 56px; height: 64px; border-radius: 8px; background: #a8341f; font-style: normal; display: grid; place-items: center; font-size: 18px; font-weight: 900; }
        .b-dots { display: flex; gap: 8px; margin-left: 12px; }
        .b-dots i { width: 12px; height: 12px; border-radius: 50%; background: #bfc9da; display: block; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="left:-60px;top:380px;font-size:420px">送</div>
        <div class="step" id="b-step"><b>2</b><div>Mándasela a tu bot<small>foto, PDF o QR: todo sirve</small></div></div>
        <div class="phone" id="b-phone"><div class="isl"></div><div class="scr"><div class="chat">
          ${chatHead}
          <div class="ms">
            <div class="bub out b-photo" id="b-m1"><div class="rcpt">${RCPT}</div></div>
            <div class="bub out b-file" id="b-m2"><i>PDF</i><div>factura_electronica.pdf<span class="tk">✓✓</span></div></div>
            <div class="bub out b-file" id="b-m3"><i style="background:#2a2522">QR</i><div>Comprobante escaneado<span class="tk">✓✓</span></div></div>
            <div class="bub in" id="b-m4">Leyendo tu boleta<span class="b-dots"><i></i><i></i><i></i></span></div>
          </div>
          <div class="in-bar"><div>Mensaje</div><i>➤</i></div>
        </div></div></div>`, `
        tl.fromTo("#b-phone", { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .3, ease: "expo.out" }, 0);
        tl.fromTo("#b-step", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .4, ease: "expo.out" }, .1);
        [["#b-m1", .3], ["#b-m2", 1.0], ["#b-m3", 1.5], ["#b-m4", 2.05]].forEach(function (m) {
          tl.fromTo(m[0], { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(1.8)", transformOrigin: m[0] === "#b-m4" ? "0% 100%" : "100% 100%" }, m[1]);
        });
        tl.fromTo("#b-m4 .b-dots i", { y: 0 }, { y: -8, duration: .15, stagger: .08, yoyo: true, repeat: 3, ease: "sine.inOut" }, 2.15);
        tl.to("#b-phone", { scale: 1.8, opacity: 0, duration: .35, ease: "expo.in" }, 2.65);`);

/* 5 · FLUJO */
const NODES = [["📷", "Foto recibida"], ["✦", "IA lee el comprobante"], ["✓", "Valida RUC e IGV"], ["◧", "Clasifica el gasto"], ["▦", "Guarda en tu reporte"]];
out.flujo = wrap("flujo", dur("flujo"), `
        .fl-node { position: absolute; left: 80px; width: 560px; height: 150px; border-radius: 28px; background: rgba(20,26,40,.78); border: 1px solid rgba(215,185,140,.28);
          display: flex; align-items: center; gap: 24px; padding: 0 34px; font-size: 36px; font-weight: 900; box-shadow: 0 24px 60px rgba(0,0,0,.45); opacity: 0; }
        .fl-node span { width: 76px; height: 76px; border-radius: 22px; background: rgba(215,185,140,.14); display: grid; place-items: center; font-size: 38px; color: #D7B98C; flex: none; }
        #fl-line { position: absolute; left: 356px; top: 470px; width: 3px; height: 1000px; background: linear-gradient(#D7B98C, rgba(215,185,140,.2)); transform-origin: 50% 0; }
        #fl-pulse { position: absolute; left: 346px; top: 460px; width: 24px; height: 24px; border-radius: 50%; background: #F3DDB0; box-shadow: 0 0 30px 10px rgba(215,185,140,.8); opacity: 0; }
        #fl-scan { position: absolute; left: 690px; top: 520px; width: 250px; height: 330px; border-radius: 16px; overflow: hidden; background: #F7F2E6; opacity: 0; }
        #fl-scan .rcpt { left: 12px; top: 10px; transform: scale(.72); transform-origin: 0 0; box-shadow: none; }
        #fl-beam { position: absolute; left: 0; right: 0; height: 26px; background: linear-gradient(transparent, rgba(47,208,138,.85), transparent); box-shadow: 0 0 30px rgba(47,208,138,.8); }
        .fl-tag { position: absolute; left: 690px; padding: 10px 18px; border-radius: 14px; background: #F3EDE2; color: #111726; font-size: 26px; font-weight: 900; white-space: nowrap; opacity: 0; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
        #fl-ok { position: absolute; left: 760px; top: 700px; width: 110px; height: 110px; border-radius: 50%; background: #2FD08A; color: #0B0F1A; display: grid; place-items: center; font-size: 64px; font-weight: 900; opacity: 0; box-shadow: 0 0 50px rgba(47,208,138,.7); }
        #fl-cat { position: absolute; left: 680px; top: 1210px; padding: 16px 26px; border-radius: 20px; background: #C8452C; font-size: 32px; font-weight: 900; opacity: 0; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="right:-40px;top:300px;font-size:300px;writing-mode:vertical-rl">記録</div>
        <div class="step" id="fl-step"><b>3</b><div>La IA hace el resto<small>así funciona por dentro</small></div></div>
        <div id="fl-line"></div><div id="fl-pulse"></div>
        ${NODES.map((n, i) => `<div class="fl-node" id="fl-n${i}" style="top:${400 + i * 230}px"><span>${n[0]}</span>${n[1]}</div>`).join("")}
        <div id="fl-scan"><div class="rcpt">${RCPT}</div><div id="fl-beam"></div></div>
        ${["RUC 20100070970", "Makro", "26/09", "S/ 245.80", "IGV S/ 37.49"].map((t, i) => `<div class="fl-tag" id="fl-t${i}" style="top:${880 + i * 64}px">${t}</div>`).join("")}
        <div id="fl-ok">✓</div>
        <div id="fl-cat">Insumos</div>`, `
        var S = [0, .9, 1.8, 2.7, 3.6];
        tl.fromTo("#fl-step", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .4, ease: "expo.out" }, .05);
        tl.fromTo("#fl-line", { scaleY: 0 }, { scaleY: 1, duration: 3.8, ease: "none" }, .1);
        S.forEach(function (s, i) {
          tl.fromTo("#fl-n" + i, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .35, ease: "expo.out" }, s + .05);
          tl.to("#fl-n" + i, { borderColor: "rgba(215,185,140,.95)", boxShadow: "0 0 40px rgba(215,185,140,.35)", duration: .2 }, s + .25);
          tl.fromTo("#fl-pulse", { opacity: 1, y: i * 230 }, { opacity: 1, y: i * 230 + 230, duration: .6, ease: "power1.inOut", immediateRender: false }, s + .3);
        });
        tl.set("#fl-pulse", { opacity: 0 }, 0);
        // IA lee: escaneo y datos que se despegan
        tl.fromTo("#fl-scan", { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .3, ease: "expo.out" }, S[1]);
        tl.fromTo("#fl-beam", { y: -30 }, { y: 340, duration: .6, ease: "power1.inOut" }, S[1] + .15);
        for (var k = 0; k < 5; k++) tl.fromTo("#fl-t" + k, { opacity: 0, x: 0, y: -300 + k * 20, scale: .6 }, { opacity: 1, x: -10, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)" }, S[1] + .55 + k * .07);
        tl.to("#fl-scan", { opacity: 0, duration: .2 }, S[2] - .1);
        tl.to(["#fl-t0", "#fl-t1", "#fl-t2", "#fl-t3", "#fl-t4"], { y: -380, opacity: .0, duration: .3, stagger: .03 }, S[3] + .1);
        // valida
        tl.fromTo("#fl-ok", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2.5)" }, S[2] + .3);
        tl.to("#fl-ok", { opacity: 0, duration: .2 }, S[3]);
        // clasifica
        tl.fromTo("#fl-cat", { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: .4, ease: "bounce.out" }, S[3] + .3);
        tl.to("#fl-cat", { opacity: 0, duration: .2 }, S[4] + .4);`);

/* 6 · DASHBOARD */
const CAT = [["Insumos", 3450, "#C8452C"], ["Alquiler", 1800, "#D7B98C"], ["Comidas", 1280, "#F3EDE2"], ["Servicios", 960, "#8a7f78"], ["Transporte", 930, "#8e2f1f"]];
out.dashboard = wrap("dashboard", dur("dashboard"), `
        .db-panel { position: absolute; border-radius: 30px; background: rgba(20,26,40,.72); border: 1px solid rgba(255,255,255,.1); box-shadow: 0 30px 70px rgba(0,0,0,.5); padding: 30px 34px; opacity: 0; }
        #db-chips { position: absolute; left: 70px; right: 130px; top: 340px; display: flex; gap: 10px; }
        .db-chip { padding: 10px 15px; border-radius: 30px; border: 1px solid rgba(215,185,140,.4); font-size: 24px; white-space: nowrap; font-weight: 700; color: #D7B98C; opacity: 0; }
        .db-chip.on { background: #C8452C; border-color: #C8452C; color: #F4F1EA; }
        #db-tot { left: 70px; top: 480px; width: 520px; height: 230px; }
        #db-igv { left: 610px; top: 480px; width: 340px; height: 230px; }
        .db-l { font-size: 26px; font-weight: 700; letter-spacing: .14em; color: #D7B98C; }
        .db-n { font-weight: 900; font-variant-numeric: tabular-nums; white-space: nowrap; margin-top: 16px; }
        #db-donut { left: 70px; top: 740px; width: 880px; height: 420px; }
        #db-donut svg { position: absolute; left: 30px; top: 40px; width: 340px; height: 340px; }
        #db-leg { position: absolute; left: 410px; top: 60px; right: 30px; display: grid; gap: 14px; }
        #db-leg div { display: flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 700; }
        #db-leg i { width: 22px; height: 22px; border-radius: 6px; flex: none; }
        #db-leg em { font-style: normal; margin-left: auto; font-variant-numeric: tabular-nums; color: #F3EDE2; }
        #db-bars { left: 70px; top: 1190px; width: 880px; height: 320px; }
        #db-bw { position: absolute; left: 40px; right: 40px; bottom: 30px; height: 200px; display: flex; align-items: flex-end; gap: 30px; }
        #db-bw div { flex: 1; text-align: center; font-size: 24px; font-weight: 700; color: #9aa3b5; }
        #db-bw b { display: block; height: 180px; border-radius: 12px 12px 4px 4px; background: linear-gradient(#e0674f, #C8452C); transform-origin: 50% 100%; margin-bottom: 10px; }
        #db-tap { position: absolute; width: 80px; height: 80px; margin: -40px 0 0 -40px; border-radius: 50%; background: rgba(244,241,234,.55); border: 3px solid #F4F1EA; opacity: 0; left: 0; top: 0; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="left:40px;top:560px;font-size:620px">経費</div>
        <div class="step" id="db-step"><b>4</b><div>Tu reporte del mes<small>en tiempo real</small></div></div>
        <div id="db-chips">${["Todo", "Comidas", "Servicios", "Insumos", "Transporte", "Alquiler"].map((c, i) => `<div class="db-chip" id="db-c${i}">${c}</div>`).join("")}</div>
        <div class="db-panel" id="db-tot"><div class="db-l" id="db-tl">TOTAL DEL MES</div><div class="db-n" id="db-tn" style="font-size:96px">S/ 0</div></div>
        <div class="db-panel" id="db-igv"><div class="db-l">IGV DEL MES</div><div class="db-n" id="db-in" style="font-size:62px;color:#F3DDB0">S/ 0</div></div>
        <div class="db-panel" id="db-donut"><div class="db-l">POR CATEGORÍA</div><svg viewBox="0 0 200 200" id="db-svg"></svg>
          <div id="db-leg">${CAT.map((c, i) => `<div id="db-lg${i}"><i style="background:${c[2]}"></i>${c[0]}<em>S/ ${c[1].toLocaleString("en-US")}</em></div>`).join("")}</div></div>
        <div class="db-panel" id="db-bars"><div class="db-l">GASTO POR SEMANA</div><div id="db-bw">${[1850, 2240, 1980, 2350].map((v, i) => `<div><b id="db-b${i}"></b>S${i + 1}</div>`).join("")}</div></div>
        <div id="db-tap"></div>`, `
        var CAT = ${JSON.stringify(CAT)}, TOT = 8420, WEEK = [1850, 2240, 1980, 2350];
        var svg = document.getElementById("db-svg"), C = 2 * Math.PI * 70, acc = 0, h = '<circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="34"/>';
        CAT.forEach(function (c, i) { var f = c[1] / TOT; h += '<circle class="db-seg" id="db-s' + i + '" cx="100" cy="100" r="70" fill="none" stroke="' + c[2] + '" stroke-width="34" stroke-dasharray="' + (f * C - 2) + ' ' + C + '" stroke-dashoffset="' + (-acc * C) + '" transform="rotate(-90 100 100)"/>'; acc += f; });
        svg.innerHTML = h;
        var fmt = function (v) { return "S/ " + Math.round(v).toLocaleString("en-US"); };
        var st = { tot: 0, igv: 0 };
        var paint = function () { document.getElementById("db-tn").textContent = fmt(st.tot); document.getElementById("db-in").textContent = fmt(st.igv); };
        tl.fromTo("#db-step", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .4, ease: "expo.out" }, .05);
        // construcción: los paneles llegan volando
        [["#db-tot", .1], ["#db-igv", .2], ["#db-donut", .35], ["#db-bars", .5]].forEach(function (p) { tl.fromTo(p[0], { opacity: 0, y: 160, scale: .9, rotationX: 25 }, { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: .6, ease: "expo.out" }, p[1]); });
        tl.fromTo(".db-chip", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: .3, stagger: .05, ease: "expo.out" }, .3);
        tl.set("#db-c0", { className: "db-chip on" }, .3);
        tl.fromTo(st, { tot: 0, igv: 0 }, { tot: TOT, igv: 1284, duration: 1.4, ease: "power3.out", onUpdate: paint }, .4);
        tl.fromTo(".db-seg", { opacity: 0, rotation: -150, transformOrigin: "100px 100px" }, { opacity: 1, rotation: -90, duration: .8, stagger: .08, ease: "expo.out" }, .6);
        tl.fromTo("#db-leg div", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .35, stagger: .07 }, .8);
        WEEK.forEach(function (v, i) { tl.fromTo("#db-b" + i, { scaleY: 0 }, { scaleY: v / 2350, duration: .6, ease: "back.out(1.5)" }, .8 + i * .08); });
        // filtros: Comidas, Servicios, Insumos y vuelta a Todo
        var CHIPX = [124, 290, 470, 648, 180, 400];
        var FIL = [[1, 2, 1280, 195, 2.5], [2, 3, 960, 146, 4.0], [3, 0, 3450, 526, 5.5], [0, -1, 8420, 1284, 7.0]];
        FIL.forEach(function (f) {
          var chip = f[0], seg = f[1], at = f[4], el = document.getElementById("db-c" + chip);
          var x = el ? el.offsetLeft + 70 + el.offsetWidth / 2 : CHIPX[chip];
          tl.fromTo("#db-tap", { opacity: 0, scale: 1.4, x: x, y: 362 }, { opacity: 1, scale: .8, duration: .18, ease: "power2.out" }, at - .2);
          tl.to("#db-tap", { opacity: 0, duration: .15 }, at + .05);
          for (var c = 0; c < 6; c++) tl.set("#db-c" + c, { className: c === chip ? "db-chip on" : "db-chip" }, at);
          tl.to(st, { tot: f[2], igv: f[3], duration: .6, ease: "power3.out", onUpdate: paint }, at);
          CAT.forEach(function (cat, i) { tl.to("#db-s" + i, { opacity: seg < 0 || seg === i ? 1 : .18, strokeWidth: seg === i ? 44 : 34, duration: .35, ease: "expo.out" }, at); tl.to("#db-lg" + i, { opacity: seg < 0 || seg === i ? 1 : .35, duration: .3 }, at); });
          WEEK.forEach(function (v, i) { var k = f[2] / TOT * (0.8 + ((i * 37 + chip * 13) % 5) * .1); tl.to("#db-b" + i, { scaleY: Math.min(1, v / 2350 * (seg < 0 ? 1 : k * 1.6)), duration: .5, ease: "expo.out" }, at); });
          tl.fromTo("#db-tot", { scale: 1.04 }, { scale: 1, duration: .35, ease: "expo.out", immediateRender: false }, at);
        });
        tl.set("#db-tl", { textContent: "TOTAL DEL MES" }, 0);
        tl.to(["#db-tot", "#db-igv", "#db-donut", "#db-bars", "#db-chips"], { opacity: 0, y: -40, duration: .25, stagger: .03 }, 7.7);`);

/* 7 · AVISO */
out.aviso = wrap("aviso", dur("aviso"), `
        #a-phone { left: 280px; top: 440px; }
        .a-btns { display: flex; gap: 12px; margin-top: 14px; }
        .a-btns span { flex: 1; text-align: center; padding: 12px 0; border-radius: 14px; background: rgba(255,255,255,.08); font-size: 22px; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="left:-40px;top:420px;font-size:420px">完了</div>
        <div class="phone" id="a-phone"><div class="isl"></div><div class="scr"><div class="chat">
          ${chatHead}
          <div class="ms">
            <div class="bub in" id="a-m1">✅ Registrado<br /><span style="color:#D7B98C">Insumos · S/ 245.80</span><div class="a-btns"><span>✅ Correcto</span><span>✏️ Corregir</span></div></div>
            <div class="bub in" id="a-m2">📊 Llevas <b style="color:#2FD08A">S/ 8,420</b> este mes<br />Comidas subió 12 %<div class="a-btns"><span style="background:#2b7fd8">🔗 Abrir mi dashboard</span></div></div>
          </div>
          <div class="in-bar"><div>Mensaje</div><i>➤</i></div>
        </div></div></div>`, `
        tl.fromTo("#a-phone", { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: .45, ease: "expo.out" }, 0);
        tl.fromTo("#a-m1", { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(1.8)", transformOrigin: "0% 100%" }, .35);
        tl.fromTo("#a-m2", { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(1.8)", transformOrigin: "0% 100%" }, 1.2);
        tl.to("#a-phone", { opacity: 0, scale: .95, duration: .15 }, 2.35);`);

/* 8 · DÓNDE VES TU DASHBOARD */
out.resultado = wrap("resultado", dur("resultado"), `
        #r-t { position: absolute; left: 70px; right: 130px; top: 200px; text-align: center; }
        #r-t div { font-family: "Montserrat", sans-serif; font-weight: 900; line-height: 1.08; white-space: nowrap; letter-spacing: -.03em; text-transform: uppercase; }
        #r-lap { position: absolute; left: 60px; top: 720px; width: 700px; }
        #r-lap .sc { height: 430px; border-radius: 18px 18px 4px 4px; border: 12px solid #0a0d14; background: #151c2c; overflow: hidden; position: relative; box-shadow: 0 0 0 2px #3a4152; }
        #r-lap .bs { height: 22px; margin: 0 -40px; border-radius: 3px 3px 18px 18px; background: linear-gradient(#c9ccd3, #7f848d); }
        #r-ph { position: absolute; left: 640px; top: 820px; width: 250px; height: 500px; border-radius: 40px; background: #07090f; padding: 10px; box-shadow: 0 0 0 2px #3a4152, 0 30px 60px rgba(0,0,0,.5); }
        #r-ph .sc { width: 100%; height: 100%; border-radius: 32px; background: #151c2c; overflow: hidden; position: relative; }
        .mini { position: absolute; border-radius: 10px; background: rgba(255,255,255,.06); }
        .mini b { position: absolute; left: 10px; top: 8px; font-size: 13px; color: #D7B98C; letter-spacing: .1em; }
        .mini em { position: absolute; left: 10px; bottom: 8px; font-style: normal; font-weight: 900; font-size: 30px; color: #F4F1EA; }
        #r-url { position: absolute; left: 60px; top: 1200px; padding: 12px 22px; border-radius: 30px; background: rgba(215,185,140,.14); border: 1px solid rgba(215,185,140,.45); font-size: 30px; font-weight: 700; color: #F3DDB0; }`, `
        <div class="fill noche"></div><div class="washi"></div>
        <div id="r-t"><div style="font-size:92px;color:#F3EDE2">TU DASHBOARD</div><div style="font-size:82px;color:#C8452C">EN TU CELULAR</div><div style="font-size:82px;color:#F3EDE2">Y EN TU COMPU</div></div>
        <div id="r-lap"><div class="sc">
          <div class="mini" style="left:18px;top:18px;width:300px;height:110px"><b>TOTAL DEL MES</b><em>S/ 8,420</em></div>
          <div class="mini" style="left:336px;top:18px;width:318px;height:110px"><b>IGV</b><em>S/ 1,284</em></div>
          <svg viewBox="0 0 200 200" style="position:absolute;left:30px;top:150px;width:230px;height:230px"><circle cx="100" cy="100" r="70" fill="none" stroke="#C8452C" stroke-width="30" stroke-dasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#D7B98C" stroke-width="30" stroke-dasharray="94 440" stroke-dashoffset="-182" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#F3EDE2" stroke-width="30" stroke-dasharray="66 440" stroke-dashoffset="-278" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#8a7f78" stroke-width="30" stroke-dasharray="98 440" stroke-dashoffset="-346" transform="rotate(-90 100 100)"/></svg>
          <div style="position:absolute;left:300px;right:20px;bottom:24px;height:210px;display:flex;align-items:flex-end;gap:16px"><i style="flex:1;height:80%;border-radius:8px 8px 2px 2px;background:linear-gradient(#e0674f,#C8452C)"></i><i style="flex:1;height:95%;border-radius:8px 8px 2px 2px;background:linear-gradient(#e0674f,#C8452C)"></i><i style="flex:1;height:84%;border-radius:8px 8px 2px 2px;background:linear-gradient(#e0674f,#C8452C)"></i><i style="flex:1;height:100%;border-radius:8px 8px 2px 2px;background:linear-gradient(#e0674f,#C8452C)"></i></div>
        </div><div class="bs"></div></div>
        <div id="r-ph"><div class="sc">
          <div class="mini" style="left:12px;right:12px;top:40px;height:100px"><b>TOTAL</b><em>S/ 8,420</em></div>
          <svg viewBox="0 0 200 200" style="position:absolute;left:35px;top:160px;width:160px;height:160px"><circle cx="100" cy="100" r="70" fill="none" stroke="#C8452C" stroke-width="30" stroke-dasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#D7B98C" stroke-width="30" stroke-dasharray="94 440" stroke-dashoffset="-182" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#F3EDE2" stroke-width="30" stroke-dasharray="66 440" stroke-dashoffset="-278" transform="rotate(-90 100 100)"/></svg>
          <div style="position:absolute;left:14px;right:14px;bottom:24px;height:110px;display:flex;align-items:flex-end;gap:10px"><i style="flex:1;height:80%;border-radius:6px 6px 2px 2px;background:#C8452C"></i><i style="flex:1;height:95%;border-radius:6px 6px 2px 2px;background:#C8452C"></i><i style="flex:1;height:84%;border-radius:6px 6px 2px 2px;background:#C8452C"></i><i style="flex:1;height:100%;border-radius:6px 6px 2px 2px;background:#C8452C"></i></div>
        </div></div>
        <div id="r-url">🔗 tu link privado · se actualiza solo</div>`, `
        tl.fromTo("#r-t div", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, stagger: .12, ease: "expo.out" }, 0);
        tl.fromTo("#r-lap", { opacity: 0, x: -200, rotationY: 20 }, { opacity: 1, x: 0, rotationY: 0, duration: .5, ease: "expo.out" }, .25);
        tl.fromTo("#r-ph", { opacity: 0, x: 200, rotation: 6 }, { opacity: 1, x: 0, rotation: 0, duration: .5, ease: "expo.out" }, .4);
        tl.fromTo("#r-url", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3, ease: "expo.out" }, .8);
        tl.to(["#r-t", "#r-lap", "#r-ph", "#r-url"], { opacity: 0, duration: .15 }, 1.85);`);

/* 9 · CIERRE */
out.cierre = wrap("cierre", dur("cierre"), `
        #c-bg { background: #F3EDE2; }
        #c-wa { opacity: .12; mix-blend-mode: multiply; }
        #c-brand { position: absolute; left: 0; right: 60px; top: 420px; display: flex; justify-content: center; align-items: center; gap: 28px; }
        #c-brand img { width: 130px; height: 130px; border-radius: 16px; }
        #c-brand span { font-family: "Tenor Sans", serif; font-size: 108px; letter-spacing: .2em; color: #111726; }
        #c-q { position: absolute; left: 70px; right: 130px; top: 660px; text-align: center; font-size: 78px; font-weight: 900; line-height: 1.12; color: #111726; }
        #c-c { position: absolute; left: 0; right: 60px; top: 960px; display: flex; justify-content: center; align-items: center; gap: 22px; font-size: 70px; font-weight: 900; color: #111726; }
        #c-c b { background: #C8452C; color: #F4F1EA; padding: 8px 30px 12px; border-radius: 14px; }
        #c-s { position: absolute; left: 70px; right: 130px; top: 1110px; text-align: center; font-size: 46px; font-weight: 700; color: #6b5f55; }
        #c-rule { left: 300px; right: 300px; top: 1220px; }`, `
        <div class="fill" id="c-bg"></div><div class="washi" id="c-wa"></div>
        <div class="kanji" data-layout-allow-occlusion data-layout-allow-overlap style="right:-30px;top:260px;font-size:360px;color:#C8452C;opacity:.08;writing-mode:vertical-rl">丸</div>
        <div id="c-brand"><img src="assets/img/sello-maru.png" alt="" /><span>MARU</span></div>
        <div id="c-q">¿Lo quieres para ti o tu negocio?</div>
        <div id="c-c">Comenta <b>BOLETA</b> ▼</div>
        <div id="c-s">y te doy una asesoría gratis</div>
        <div class="goldline" id="c-rule"></div>`, `
        tl.fromTo("#c-brand", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .5, ease: "expo.out" }, .05);
        tl.fromTo("#c-q", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .5, ease: "expo.out" }, .3);
        tl.fromTo("#c-c", { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .45, ease: "back.out(2)" }, .6);
        tl.fromTo("#c-s", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out" }, .85);
        tl.fromTo("#c-rule", { scaleX: 0 }, { scaleX: 1, duration: .6, ease: "expo.out" }, .9);
        tl.fromTo("#c-c b", { boxShadow: "0 0 0 0 rgba(200,69,44,.55)" }, { boxShadow: "0 0 0 28px rgba(200,69,44,0)", duration: .8, repeat: 2, ease: "power2.out" }, 1.2);`);

for (const [id] of SCENES) { writeFileSync(`compositions/${id}.html`, out[id]); }
// index.html
const hosts = SCENES.map(([id, s, d], i) => `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${s}" data-duration="${d}" data-track-index="${i + 1}" data-width="1080" data-height="1920"></div>`).join("\n");
const total = SCENES.at(-1)[1] + SCENES.at(-1)[2];
writeFileSync("index.html", `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #111726; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #111726; }
      #grain-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 100; }
      @keyframes hf-grain-noise { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-5%, 5%); } 50% { transform: translate(5%, -5%); } 75% { transform: translate(-5%, -5%); } }
      #grain-overlay .grain-texture { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; opacity: .05;
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        animation: hf-grain-noise .5s steps(1) ${Math.ceil(total * 2)}; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1080" data-height="1920">
${hosts}
      <div id="grain-overlay"><div class="grain-texture"></div></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`);
console.log("ok", total, "s");
