const fs=require("fs");
function ed(f,pairs){let s=fs.readFileSync(f,"utf8");for(const [a,b] of pairs){if(!s.includes(a))throw new Error(f+" no: "+a.slice(0,80));s=s.split(a).join(b);}fs.writeFileSync(f,s);}
ed("src/ciudad.src.html",[
 ['scene.fog = new THREE.FogExp2(0x05070c, .0045);',`scene.fog = new THREE.FogExp2(0x0a0e1c, .0085);
        (function () { var c = document.createElement("canvas"); c.width = 4; c.height = 256; var x = c.getContext("2d"); var gr = x.createLinearGradient(0, 0, 0, 256);
          gr.addColorStop(0, "#04060c"); gr.addColorStop(.55, "#0b1024"); gr.addColorStop(1, "#141a34"); x.fillStyle = gr; x.fillRect(0, 0, 4, 256); var t = new THREE.CanvasTexture(c); scene.background = t; })();`],
 ["scene.add(new THREE.AmbientLight(0x8090b0, .35));","scene.add(new THREE.AmbientLight(0x8090b0, .55));"],
 ["color: 0x0f1420, metalness: .55, roughness: .32, envMapIntensity: .35","color: 0x1a2236, metalness: .45, roughness: .3, envMapIntensity: .7"],
 ["color: 0x7a6440, transparent: true, opacity: .35","color: 0x9a8058, transparent: true, opacity: .55"],
 ["new THREE.PlaneGeometry(.52, .74)","new THREE.PlaneGeometry(.66, .9)"],
 ["var OFFC = [.035, .045, .06];","var OFFC = [.05, .065, .09];"],
 ["color: 0x5a4a30, transparent: true, opacity: .55","color: 0x8a7048, transparent: true, opacity: .8"],
 // glow sprites for client windows
 ["var litColor = function",`var CG = new THREE.BufferGeometry(), cgP = new Float32Array(142 * 3), cgC = new Float32Array(142 * 3);
        CLI.forEach(function (c, i) { cgP[i * 3] = c.pos.x; cgP[i * 3 + 1] = c.pos.y; cgP[i * 3 + 2] = c.pos.z + .2; });
        CG.setAttribute("position", new THREE.BufferAttribute(cgP, 3)); CG.setAttribute("color", new THREE.BufferAttribute(cgC, 3));
        var cGlow = new THREE.Points(CG, new THREE.PointsMaterial({ size: 4.2, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); city.add(cGlow);
        var litColor = function`],
 ["var col = litColor(k, i); wCol.setXYZ(c.w, col[0], col[1], col[2]); });","var col = litColor(k, i); wCol.setXYZ(c.w, col[0], col[1], col[2]); cgC[i * 3] = k * .75; cgC[i * 3 + 1] = k * .55; cgC[i * 3 + 2] = k * .28; });\n          CG.attributes.color.needsUpdate = true;"],
 // shop less blown out
 ["lantern.scale.setScalar(3 + shopK * 5); lantern.material.opacity = .6 + .4 * shopK;","lantern.scale.setScalar(2.5 + shopK * 2.5); lantern.material.opacity = .45 + .35 * shopK;"],
 ["shopWin.material.color.setRGB(.5 + shopK * .9, .32 + shopK * .6, .15 + shopK * .3);","shopWin.material.color.setRGB(.45 + shopK * .5, .28 + shopK * .34, .12 + shopK * .14);"],
 ["shopHalo.material.opacity = shopK * .5; shopHalo.scale.setScalar(4 + shopK * 10);","shopHalo.material.opacity = shopK * .22; shopHalo.scale.setScalar(4 + shopK * 6);"],
 // oblique cameras
 [`var P = along(carla.r, d - 11).add(V3(0, 5, 3)), T = along(carla.r, d + 5).add(V3(0, 1.5, 0));`,`var cur = along(carla.r, d), P = cur.clone().add(V3(-4, 16, 14)), T = along(carla.r, d + 3);`],
 ["var A1 = aerial(0, 118, 132, -42);","var A1 = aerial(0, 58, 112, -30);"],
 ["return aerial(.2 * pk(l, GB[0], 2.2), 118, 132, -42);","return aerial(.2 * pk(l, GB[0], 2.2), 58, 112, -30);"],
 ["return mixCam(aerial(.2, 118, 132, -42), fc, eio(pk(l, GB[1], .55)));","return mixCam(aerial(.2, 58, 112, -30), fc, eio(pk(l, GB[1], .55)));"],
 ["var A2 = aerial(-.06, 150, 150, -48);","var A2 = aerial(-.06, 80, 128, -38);"],
 ["return aerial(-.06 - .16 * pk(l, GB[3], 2.2), lerp(150, 138, pk(l, GB[3], 2.2)), 150, -48);","return aerial(-.06 - .16 * pk(l, GB[3], 2.2), lerp(80, 70, pk(l, GB[3], 2.2)), 128, -38);"],
 ["var A3 = aerial(-.22, 138, 150, -48)","var A3 = aerial(-.22, 70, 128, -38)"],
 ["carlaView = { p: carla.pos.clone().add(V3(-3, 4, 16)), t: carla.pos.clone() };","carlaView = { p: carla.pos.clone().add(V3(-5, 7, 20)), t: carla.pos.clone() };"],
]);
ed("src/historia.src.html",[
 ["pigeon(lerp(-10, 139, outQ(pg)), lerp(120, 273, outQ(pg)), 2.6, pg < 1, T);","pigeon(lerp(-10, 139, outQ(pg)), lerp(120, 274, outQ(pg)), 3, pg < 1, T);"],
 ["#h-card { position: absolute; left: 80px; right: 150px; top: 190px; padding: 30px 34px;","#h-card { position: absolute; left: 80px; right: 150px; top: 160px; padding: 24px 32px;"],
 [".h-row { display: flex; justify-content: space-between; margin-top: 22px; padding-top: 18px;",".h-row { display: flex; justify-content: space-between; margin-top: 14px; padding-top: 12px;"],
]);
ed("src/remate.src.html",[["pigeon(139, 273, 2.6, false, T);","pigeon(139, 274, 3, false, T);"]]);
console.log("ok");
