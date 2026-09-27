const fs=require("fs");
function ed(f,pairs){let s=fs.readFileSync(f,"utf8");for(const [a,b] of pairs){if(!s.includes(a))throw new Error(f+" no: "+a.slice(0,80));s=s.split(a).join(b);}fs.writeFileSync(f,s);}
ed("src/ciudad.src.html",[
 ["color: 0x1a2236, metalness: .45, roughness: .3, envMapIntensity: .7","color: 0x151c2e, metalness: .5, roughness: .3, envMapIntensity: .6"],
 ["size: 4.2, map: GLOW, vertexColors: true","size: 6.5, map: GLOW, vertexColors: true"],
 ["cgC[i * 3] = k * .75; cgC[i * 3 + 1] = k * .55; cgC[i * 3 + 2] = k * .28;","cgC[i * 3] = k * 1.0; cgC[i * 3 + 1] = k * .74; cgC[i * 3 + 2] = k * .36;"],
 ["size: 2.2, map: GLOW, vertexColors: true","size: 3.6, map: GLOW, vertexColors: true"],
 // featured windows: near the middle of the city, spread
 ["var FEAT = [9, 30, 55, 90];",`var MID = []; CLI.forEach(function (c, i) { if (i > 0 && c.pos.z > -30 && c.pos.z < 6 && Math.abs(c.pos.x) < 24 && c.pos.y > 3) MID.push(i); });
        var FEAT = [MID[0], MID[Math.floor(MID.length * .3)], MID[Math.floor(MID.length * .6)], MID[MID.length - 1]];
        var MINI = [MID[1], MID[Math.floor(MID.length * .45)], MID[Math.floor(MID.length * .8)]];`],
 ["[[CLI[20], 0], [CLI[50], 1], [CLI[80], 2]].forEach","[[CLI[MINI[0]], 0], [CLI[MINI[1]], 1], [CLI[MINI[2]], 2]].forEach"],
 // G2 camera: travelling medio que mira al pulso, sin atravesar edificios
 [`          if (l < GB[2]) { var fc = followCam(l); if (l >= 5.75) fc = mixCam(fc, carlaView, eio(pk(l, 5.75, .6))); return mixCam(aerial(.2, 58, 112, -30), fc, eio(pk(l, GB[1], .55))); }`,
  `          if (l < GB[2]) { var pl0 = PUL[0], pd = carla.r.len * eio(pk(l, pl0.a, pl0.b - pl0.a)), pp = along(carla.r, pd);
            var tt = pp.clone().lerp(carla.pos, eio(pk(l, 5.45, .5)));
            return { p: aerial(.2, 58, 112, -30).p.lerp(carlaView.p, eio(pk(l, GB[1], 1.5))), t: aerial(.2, 58, 112, -30).t.lerp(tt, eio(pk(l, GB[1], .6))) }; }`],
 ["carlaView = { p: carla.pos.clone().add(V3(-5, 7, 20)), t: carla.pos.clone() };","carlaView = { p: carla.pos.clone().add(V3(-7, 17, 36)), t: carla.pos.clone() };"],
]);
console.log("ok");
