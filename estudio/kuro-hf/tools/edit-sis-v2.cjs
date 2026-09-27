const fs = require("fs");
const f = "src/sistema.src.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("no: " + a.slice(0, 70)); s = s.replace(a, b); };
rep("var W = 1080, H = 1920, N = 1800;", "var W = 1080, H = 1920, N = 2400;");
rep("size: .085, map: GLOW", "size: .12, map: GLOW");
rep(`var CAM = [
          [0, [0, .5, 13.5], [0, 0, 0]], [1.4, [1.1, .3, 10.8], [0, -.5, 0]], [2.04, [-1.3, .7, 10.4], [0, -.5, 0]],
          [4.09, [0, .1, 9.4], [0, -.4, 0]], [6.89, [0, .5, 11.5], [0, .1, 0]], [8.93, [2.2, -1.7, 8.8], [0, .5, 0]],
          [10.97, [0, .3, 9.6], [0, .2, 0]], [13.02, [0, .2, 12.5], [0, -.5, -2]], [15.08, [0, 7.2, 6.8], [0, -.2, 0]], [16.55, [0, 4.2, 5.6], [0, -1.6, 0]]
        ];`, `var CAM = [
          [0, [0, .6, 15], [0, 0, 0]], [1.4, [.6, 1.3, 13.2], [0, -.6, 0]], [2.04, [-.6, 1.4, 13.0], [0, -.6, 0]],
          [4.09, [0, .6, 12.5], [0, -.5, 0]], [6.89, [0, .5, 13.5], [0, 0, 0]], [7.3, [0, .2, 11.8], [0, .1, 0]], [8.93, [1.4, -.4, 12.8], [0, .3, 0]],
          [10.97, [0, -.2, 12.8], [0, -.3, 0]], [13.02, [0, .2, 13], [0, -.5, -2]], [15.08, [0, 6.8, 7.2], [0, 0, 0]], [16.55, [0, 4.2, 5.6], [0, -1.6, 0]]
        ];`);
rep("var orb = Math.sin(t * .35) * .5;", "var orb = Math.sin(t * .35) * .3;");
rep("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), 240, .045, 8, false)", "new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), 240, .03, 8, false)");
rep("var FLOWPTS = [new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(1.3, 1.0, .6), new THREE.Vector3(-1.3, -.5, .3), new THREE.Vector3(0, -2.0, 0)];",
  "var FLOWPTS = [new THREE.Vector3(-.4, 1.7, 0), new THREE.Vector3(1.1, .5, .6), new THREE.Vector3(-1.1, -.9, .3), new THREE.Vector3(.4, -2.3, 0)];");
rep("var TAGOFF = [[-.5, -110], [.12, -34], [-1.12, -34], [-.5, 64]], TAGW = [140, 300, 260, 230], COREW = 290;", "var TAGSIDE = [1, -1, 1, 1], TAGW = [140, 300, 260, 230], COREW = 290;");
rep(`var wEl = TAGW[j], off = TAGOFF[j];
            var ox = off[0] === .12 ? 60 : off[0] === -1.12 ? -wEl - 60 : -wEl / 2;
            el.style.transform = "translate(" + (p[0] + ox) + "px," + (p[1] + off[1]) + "px)";`,
  `var ox = TAGSIDE[j] > 0 ? 70 : -TAGW[j] - 70;
            el.style.transform = "translate(" + (p[0] + ox) + "px," + (p[1] - 30) + "px)";`);
rep(`coreEl.style.opacity = ck; coreEl.style.transform = "translate(" + (cp[0] - COREW / 2) + "px," + (cp[1] + 50) + "px)";`,
  `coreEl.style.opacity = ck; coreEl.style.transform = "translate(" + (cp[0] - COREW / 2) + "px," + (cp[1] + 70) + "px)";`);
// etiquetas de las columnas por semana
rep(`            sprites.push({ s: spr, messy: messy, clean: clean, j: j });
          }`, `            sprites.push({ s: spr, messy: messy, clean: clean, j: j });
          }
          ["S/ 9.8k", "S/ 11.4k", "S/ 14.7k", "S/ 12.4k"].forEach(function (txt, w) {
            var ws = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTex(txt, null, w === 2 ? "#F3DDB0" : "#9dffd0", 320), transparent: true, depthWrite: false }));
            ws.scale.set(.9, .31, 1); ws.visible = false; scene.add(ws); weekSpr.push(ws);
          });`);
rep("var sprites = [];", "var sprites = [], weekSpr = [];");
rep(`cm.scale.y = h; cm.position.y = BASE + h / 2; cm.visible = ck > .003; });`,
  `cm.scale.y = h; cm.position.y = BASE + h / 2; cm.visible = ck > .003;
            var ws = weekSpr[w]; if (ws) { ws.visible = ck > .6; ws.material.opacity = pk(ck, .6, .4); ws.position.set(WX[w], BASE + h + .38, 0); } });`);
rep("function galaxy(i, t) { var arm = i % 3, u = hash(i + 11), r = .35 + u * 3.4,", "function galaxy(i, t) { var arm = i % 3, u = Math.pow(hash(i + 11), .7), r = .35 + u * 2.7,");
fs.writeFileSync(f, s);
console.log("ok");
