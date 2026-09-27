// Cambios v2 en playa: ola nueva, cortes del chat en 15.05 · 15.20 · 16.00 · 16.60
const fs = require("fs");
const f = "src/playa.src.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("no encontrado: " + a.slice(0, 80)); s = s.replace(a, b); };

const a = s.indexOf("        function waveCrash(t) {"), b = s.indexOf("        function update(t) {");
s = s.slice(0, a) + fs.readFileSync("tools/wave.js", "utf8") + "\n" + s.slice(b);

const w0 = s.indexOf("            beach(t); umbrella(222, 368, t); palm(20, 480, t); chair(150, 376);\n            var w = pk(t, 8.4, .5);");
const w1 = s.indexOf("          } else if (t < 15.45) {");
if (w0 < 0 || w1 < 0) throw new Error("bloque de la ola no encontrado");
s = s.slice(0, w0) + `            beach(t); umbrella(222, 368, t); palm(20, 480, t);
            var drag = pk(t, 8.8, .5), rest = t >= 9.3;
            if (!rest) chair(150 - drag * 40, 376);
            else { g.save(); g.translate(206, 380); g.rotate(1.2); chair(0, 0); g.restore(); }
            if (t < 8.8) kuro(150, 346, 1.25, { rightHold: "coco", right: { x: 20, y: -38 }, leftHold: "phone", left: { x: -20, y: -24 }, eyes: t > 8.55 ? "shock" : "glasses", mouth: t > 8.55 ? "o" : "smug", legsUp: t > 8.65 }, t);
            var wv = waveCrash(t);
            if (t >= 8.8 && t < 9.3) {
              // Kuro revolcado dentro de la ola
              var kx = lerp(150, 70, drag), ky = wv ? wv.top(kx) + 30 : 330;
              g.save(); g.translate(kx, ky); g.rotate(drag * 7.5); kuro(0, 40, 1.1, { wet: true, eyes: "x", mouth: "o", legsUp: true }, t); g.restore();
              for (var fo = 0; fo < 30; fo++) { var fx = kx - 40 + hash(fo) * 80, fy = ky + 20 + hash(fo + 9) * 30; rect(fx, fy, 3, 2, fo % 2 ? "#f4fbff" : "#8fe3ea"); }
            }
            if (rest) kuro(78, 400, 1.1, { wet: true, seaweed: true, glassesTilt: 1.5, glassesY: 2, mouth: "wince" }, t);
            camT = "none";
            if (t > 8.75 && t < 9.35) { var sh2 = (hash(Math.floor(t * 36)) - .5) * 22; camT = "translate(" + sh2 + "px," + (hash(Math.floor(t * 36) + 3) - .5) * 16 + "px)"; }
` + s.slice(w1);

rep(`} else if (t < 15.45) {`, `} else if (t < 15.05) {`);
rep(`} else if (t < 16.25) {`, `} else if (t < 16.0) {`);
rep(`tremble: t >= 16.15, sweat: t >= 16.15, wet: true }`, `tremble: t >= 15.2, sweat: t >= 15.2, wet: true }`);
rep(`var gf = pk(t, 15.45, .4);`, `var gf = pk(t, 15.05, .45);`);
rep(`var p1 = t < 16.15 ? 1 + .18 * Math.exp(-(t - 15.45) * 9) : 1.9 + .12 * Math.exp(-(t - 16.15) * 9);`,
  `var p1 = t < 15.2 ? 1.12 + .2 * Math.exp(-(t - 15.05) * 12) : 1.85 + .18 * Math.exp(-(t - 15.2) * 10) + (t - 15.2) * .08;`);
rep(`            gradient(["#1d1535", "#120c22"], 0, PH);`, `            gradient(["#2a1a4a", "#1d1535", "#120c22"], 0, PH);
            for (var q = 0; q < 24; q++) { var an = q / 24 * Math.PI * 2 + t * .8; line(135, 225, 135 + Math.cos(an) * 320, 225 + Math.sin(an) * 320, q % 2 ? "#3a2560" : "#2a1a4a", 3); }`);
rep(`if (t >= 12.6 && t < 13.6) { var n = Math.floor(pk(t, 12.6, .9) * TYPE.length);`, `if (t >= 12.3 && t < 13.15) { var n = Math.floor(pk(t, 12.3, .8) * TYPE.length);`);
rep(`(t >= 12.6 && t < 13.6) ? 1 : 0;`, `(t >= 12.3 && t < 13.15) ? 1 : 0;`);
rep(`tl.set(["#playa-b2", "#playa-b3"], { display: "block" }, 13.6);`, `tl.set(["#playa-b2", "#playa-b3"], { display: "block" }, 13.15);`);
rep(`transformOrigin: "0% 100%" }, 13.6);`, `transformOrigin: "0% 100%" }, 13.15);`);
rep(`transformOrigin: "0% 100%" }, 13.7);`, `transformOrigin: "0% 100%" }, 13.25);`);
rep(`ease: "power2.out" }, 13.8);`, `ease: "power2.out" }, 13.35);`);
rep(`tl.set("#playa-b4", { display: "block" }, 14.6);`, `tl.set("#playa-b4", { display: "block" }, 14.1);`);
rep(`transformOrigin: "100% 100%" }, 14.6);`, `transformOrigin: "100% 100%" }, 14.1);`);

const c0 = s.indexOf(`        tl.set(["#playa-chatB", "#playa-dim"], { opacity: 0 }, 15.45);`), c1 = s.indexOf("        update(0);");
if (c0 < 0) throw new Error("bloque de cortes no encontrado");
s = s.slice(0, c0) + `        // Mini-drops: 15.05 cara, 15.20 más cerca, 16.00 el sticker, 16.60 zoom al sticker y a la pupila
        tl.set(["#playa-chatB", "#playa-dim"], { opacity: 0 }, 15.05);
        tl.set("#playa-flash", { opacity: 0 }, 0);
        [15.05, 15.2, 16.0, 16.6].forEach(function (b, j) { tl.fromTo("#playa-flash", { opacity: j === 1 || j === 3 ? .35 : .8 }, { opacity: 0, duration: .09, ease: "none", immediateRender: false }, b); });
        tl.fromTo("#playa-big", { opacity: 0, scale: .3, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: .35, ease: "back.out(2.2)" }, 16.0);
        tl.fromTo("#playa-biglab", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: "expo.out" }, 16.05);
        tl.to("#playa-big", { y: -14, duration: .25, ease: "sine.inOut" }, 16.35);
        tl.to("#playa-biglab", { opacity: 0, duration: .05 }, 16.6);
        tl.to("#playa-big", { y: 0, scale: 3.1, transformOrigin: "65.3% 53.2%", duration: .06, ease: "expo.out" }, 16.6);
        tl.to("#playa-big", { scale: 5.2, transformOrigin: "65.4% 53.4%", duration: .32, ease: "power1.inOut" }, 16.66);
        tl.to("#playa-big", { scale: 48, transformOrigin: "65.6% 53.8%", duration: .13, ease: "expo.in" }, 16.98);
        tl.fromTo("#playa-black", { opacity: 0 }, { opacity: 1, duration: .08, ease: "none" }, 17.03);

` + s.slice(c1);
rep(`<div id="playa-big">`, `<div id="playa-biglab">Maru 丸 envió un sticker</div>\n        <div id="playa-big">`);
rep(`<div id="playa-black"></div>`, `<div id="playa-black"></div>\n        <div id="playa-flash"></div>`);
rep(`#playa-black { position: absolute; inset: 0; background: #000; opacity: 0; }`, `#playa-black { position: absolute; inset: 0; background: #000; opacity: 0; }
        #playa-flash { position: absolute; inset: 0; background: #fff6ee; opacity: 0; }
        #playa-biglab { position: absolute; left: 0; right: 0; top: 380px; text-align: center; font-size: 46px; color: #d9cff0; opacity: 0; }`);
fs.writeFileSync(f, s);
console.log("ok");
