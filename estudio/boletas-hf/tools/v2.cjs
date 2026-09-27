// v2: gancho en 3 pantallas (Montserrat Black, fondo claro), "dónde ves tu dashboard" en vez de "cero Excel",
// link al dashboard en el aviso del bot y cierre "¿Lo quieres para ti o tu negocio?".
const fs = require("fs");
let s = fs.readFileSync("gen.mjs", "utf8");
const cut = (a, b, txt) => { const i = s.indexOf(a), j = s.indexOf(b); if (i < 0 || j < 0) throw new Error("marcas " + a); s = s.slice(0, i) + txt + s.slice(j); };
const rep = (a, b) => { if (!s.includes(a)) throw new Error("no: " + a.slice(0, 60)); s = s.replace(a, b); };

cut("/* 1 · GANCHO */", "/* 2 · PROBLEMA */", `/* 1 · GANCHO: tres pantallas de texto gigante, fondo claro */
out.gancho = wrap("gancho", dur("gancho"), \`
        #g-bg { background: radial-gradient(75% 55% at 50% 48%, #ffffff 0%, #f4f2ee 55%, #d9d6d0 100%); }
        .g-scr { position: absolute; left: 60px; right: 120px; top: 0; bottom: 0; display: grid; align-content: center; justify-items: center; gap: 0; opacity: 0; }
        .g-scr div { font-family: "Montserrat", sans-serif; font-weight: 900; color: #16304a; line-height: .92; letter-spacing: -.035em; white-space: nowrap; text-transform: uppercase; }
        .g-scr .shu { color: #C8452C; }\`, \`
        <div class="fill" id="g-bg"></div>
        <div class="g-scr" id="g-s1" style="opacity:1"><div style="font-size:235px">¿SABÍAS</div><div style="font-size:300px">QUE?</div></div>
        <div class="g-scr" id="g-s2"><div style="font-size:230px">PUEDES</div><div style="font-size:150px">CONTROLAR</div></div>
        <div class="g-scr" id="g-s3"><div style="font-size:176px">TUS GASTOS</div><div style="font-size:196px">CON UNA</div><div class="shu" style="font-size:300px">FOTO</div></div>\`, \`
        var T = [0, .75, 1.55];
        tl.fromTo("#g-s1", { scale: 1.06 }, { scale: 1, duration: .35, ease: "expo.out" }, 0);
        ["#g-s2", "#g-s3"].forEach(function (id, i) {
          tl.set(i === 0 ? "#g-s1" : "#g-s2", { opacity: 0 }, T[i + 1]);
          tl.fromTo(id, { opacity: 0, scale: 1.18, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: .16, ease: "expo.out" }, T[i + 1]);
        });
        tl.fromTo("#g-s3 .shu", { scale: .85 }, { scale: 1, duration: .3, ease: "back.out(2.5)" }, T[2] + .1);
        tl.to("#g-s3", { opacity: 0, scale: 1.05, duration: .12, ease: "power2.in" }, 2.38);\`);

`);

cut("/* 8 · RESULTADO */", "/* 9 · CIERRE */", `/* 8 · DÓNDE VES TU DASHBOARD */
out.resultado = wrap("resultado", dur("resultado"), \`
        #r-t { position: absolute; left: 70px; right: 130px; top: 200px; text-align: center; }
        #r-t div { font-family: "Montserrat", sans-serif; font-weight: 900; line-height: .95; letter-spacing: -.03em; text-transform: uppercase; }
        #r-lap { position: absolute; left: 60px; top: 720px; width: 700px; }
        #r-lap .sc { height: 430px; border-radius: 18px 18px 4px 4px; border: 12px solid #0a0d14; background: #151c2c; overflow: hidden; position: relative; box-shadow: 0 0 0 2px #3a4152; }
        #r-lap .bs { height: 22px; margin: 0 -40px; border-radius: 3px 3px 18px 18px; background: linear-gradient(#c9ccd3, #7f848d); }
        #r-ph { position: absolute; left: 640px; top: 820px; width: 250px; height: 500px; border-radius: 40px; background: #07090f; padding: 10px; box-shadow: 0 0 0 2px #3a4152, 0 30px 60px rgba(0,0,0,.5); }
        #r-ph .sc { width: 100%; height: 100%; border-radius: 32px; background: #151c2c; overflow: hidden; position: relative; }
        .mini { position: absolute; border-radius: 10px; background: rgba(255,255,255,.06); }
        .mini b { position: absolute; left: 10px; top: 8px; font-size: 13px; color: #D7B98C; letter-spacing: .1em; }
        .mini em { position: absolute; left: 10px; bottom: 8px; font-style: normal; font-weight: 900; font-size: 30px; color: #F4F1EA; }
        #r-url { position: absolute; left: 60px; top: 1200px; padding: 12px 22px; border-radius: 30px; background: rgba(215,185,140,.14); border: 1px solid rgba(215,185,140,.45); font-size: 30px; font-weight: 700; color: #F3DDB0; }\`, \`
        <div class="fill noche"></div><div class="washi"></div>
        <div id="r-t"><div style="font-size:110px;color:#F3EDE2">TU DASHBOARD</div><div style="font-size:92px;color:#C8452C">EN TU CELULAR</div><div style="font-size:92px;color:#F3EDE2">Y EN TU COMPU</div></div>
        <div id="r-lap"><div class="sc">
          <div class="mini" style="left:18px;top:18px;width:300px;height:110px"><b>TOTAL DEL MES</b><em>S/ 8,420</em></div>
          <div class="mini" style="left:336px;top:18px;width:318px;height:110px"><b>IGV</b><em>S/ 1,284</em></div>
          <svg viewBox="0 0 200 200" style="position:absolute;left:30px;top:150px;width:230px;height:230px"><circle cx="100" cy="100" r="70" fill="none" stroke="#C8452C" stroke-width="30" stroke-dasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#D7B98C" stroke-width="30" stroke-dasharray="94 440" stroke-dashoffset="-182" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#F3EDE2" stroke-width="30" stroke-dasharray="66 440" stroke-dashoffset="-278" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#8a7f78" stroke-width="30" stroke-dasharray="98 440" stroke-dashoffset="-346" transform="rotate(-90 100 100)"/></svg>
          <div style="position:absolute;left:300px;right:20px;bottom:24px;height:210px;display:flex;align-items:flex-end;gap:16px">${[.8, .95, .84, 1].map((h) => `<i style="flex:1;height:${h * 100}%;border-radius:8px 8px 2px 2px;background:linear-gradient(#e0674f,#C8452C)"></i>`).join("")}</div>
        </div><div class="bs"></div></div>
        <div id="r-ph"><div class="sc">
          <div class="mini" style="left:12px;right:12px;top:40px;height:100px"><b>TOTAL</b><em>S/ 8,420</em></div>
          <svg viewBox="0 0 200 200" style="position:absolute;left:35px;top:160px;width:160px;height:160px"><circle cx="100" cy="100" r="70" fill="none" stroke="#C8452C" stroke-width="30" stroke-dasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#D7B98C" stroke-width="30" stroke-dasharray="94 440" stroke-dashoffset="-182" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#F3EDE2" stroke-width="30" stroke-dasharray="66 440" stroke-dashoffset="-278" transform="rotate(-90 100 100)"/></svg>
          <div style="position:absolute;left:14px;right:14px;bottom:24px;height:110px;display:flex;align-items:flex-end;gap:10px">${[.8, .95, .84, 1].map((h) => `<i style="flex:1;height:${h * 100}%;border-radius:6px 6px 2px 2px;background:#C8452C"></i>`).join("")}</div>
        </div></div>
        <div id="r-url">🔗 tu link privado · se actualiza solo</div>\`, \`
        tl.fromTo("#r-t div", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, stagger: .12, ease: "expo.out" }, 0);
        tl.fromTo("#r-lap", { opacity: 0, x: -200, rotationY: 20 }, { opacity: 1, x: 0, rotationY: 0, duration: .5, ease: "expo.out" }, .25);
        tl.fromTo("#r-ph", { opacity: 0, x: 200, rotation: 6 }, { opacity: 1, x: 0, rotation: 0, duration: .5, ease: "expo.out" }, .4);
        tl.fromTo("#r-url", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3, ease: "expo.out" }, .8);
        tl.to(["#r-t", "#r-lap", "#r-ph", "#r-url"], { opacity: 0, duration: .15 }, 1.85);\`);

`);

rep(`<div class="bub in" id="a-m2">📊 Llevas <b style="color:#2FD08A">S/ 8,420</b> este mes<br />Comidas subió 12 %</div>`,
  `<div class="bub in" id="a-m2">📊 Llevas <b style="color:#2FD08A">S/ 8,420</b> este mes<br />Comidas subió 12 %<div class="a-btns"><span style="background:#2b7fd8">🔗 Abrir mi dashboard</span></div></div>`);
rep(`<div id="c-q">¿Lo quieres para tu negocio?</div>`, `<div id="c-q">¿Lo quieres para ti o tu negocio?</div>`);
fs.writeFileSync("gen.mjs", s);
console.log("ok");
