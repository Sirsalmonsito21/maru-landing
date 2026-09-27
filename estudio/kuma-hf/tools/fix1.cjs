const fs=require("fs");
function ed(f,pairs){let s=fs.readFileSync(f,"utf8");for(const [a,b] of pairs){if(!s.includes(a))throw new Error(f+" no: "+a.slice(0,70));s=s.split(a).join(b);}fs.writeFileSync(f,s);}
ed("src/cerebro.src.html",[
 ['renderer.toneMappingExposure = 1.05','renderer.toneMappingExposure = .9'],
 ['new THREE.SphereGeometry(.024, 12, 8)','new THREE.SphereGeometry(.015, 12, 8)'],
 ['tmpC.setRGB(.95, .85, .66).lerp(REGC[REG[i]], .5).multiplyScalar(1 + on * 1.8);','tmpC.setRGB(.95, .85, .66).lerp(REGC[REG[i]], .5).multiplyScalar(.55 + on * 1.1);'],
 ['if (t < .45) tmpC.setRGB(2, 1.8, 1.3);','if (t < .45) tmpC.setRGB(1.4, 1.25, .95);'],
 ['new THREE.SphereGeometry(.06, 20, 14), glassMat','new THREE.SphereGeometry(.032, 20, 14), glassMat'],
 ['opacity: .55, ior: 1.4','opacity: .28, ior: 1.4, envMapIntensity: .35'],
 ['size: .09, map: GLOW, color: 0xFFE7B0','size: .05, map: GLOW, color: 0xFFE7B0'],
 ['coreGlow.scale.set(1.4, 1.4, 1)','coreGlow.scale.set(.6, .6, 1)'],
 ['coreGlow.material.opacity = .6 + .3 * Math.sin(t * 5);','coreGlow.material.opacity = .3 + .12 * Math.sin(t * 5);'],
 ['br = .22 + on2 * .5;','br = .16 + on2 * .45;'],
 ['metalness: 1, roughness: .22, envMapIntensity: 1.2','metalness: 1, roughness: .28, envMapIntensity: .55'],
 ['color: 0x1a1d24, metalness: .6, roughness: .5','color: 0x0b0d12, metalness: .2, roughness: .85, envMapIntensity: .12'],
 ['new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 1.25, .75, .12)','new THREE.UnrealBloomPass(new THREE.Vector2(W, H), .8, .5, .45)'],
 ['bloom.strength = 1.15 + punch * .6 + (t < .45 ? 1.5 * (1 - t / .45) : 0);','bloom.strength = .75 + punch * .35 + (t < .45 ? .9 * (1 - t / .45) : 0);'],
 ['var R = 5.4, ang','var R = 9, ang'],
 ['R = lerp(8, 5.4, eio(pk(t, 0, 1.8)))','R = lerp(12, 9, eio(pk(t, 0, 1.8)))'],
 ['R = lerp(5.4, .15, dk)','R = lerp(9, .15, dk)'],
 ['ang = .35 + t * .22; R = 5.0; }','ang = .35 + t * .22; R = 8.4; }'],
 ['R = lerp(5.0, 6.2, pk(t, G[6], 1)); focus = 1.8;','R = lerp(8.4, 10, pk(t, G[6], 1));'],
 ['focus = t >= G[6] ? 1.6 : R;','focus = t >= G[6] ? 3 : R;'],
 ['el.style.transform = "translate(" + (p[0] - LABW[i] / 2) + "px," + (p[1] - 30) + "px)"; });','el.style.transform = "translate(" + Math.min(1080 - 150 - LABW[i], Math.max(60, p[0] - LABW[i] / 2)) + "px," + Math.min(1480, Math.max(180, p[1] - 30)) + "px)"; });'],
]);
ed("src/historia.src.html",[
 ['tl.set("#h-phone", { opacity: 0 }, at(16.05));','tl.to("#h-phone", { y: 330, scale: .82, opacity: .55, duration: .25, ease: "expo.out" }, at(15.55));\n        tl.set("#h-phone", { opacity: 0 }, at(16.05));'],
]);
ed("src/remate.src.html",[
 ['rect(142, 364, 16, 8, "#0e0f16"); rect(144, 365, 12, 6, "#fff3b8");','rect(170, 366, 16, 7, "#0e0f16"); rect(172, 367, 12, 5, "#fff3b8");'],
 ['transform-origin: 600px 1470px','transform-origin: 712px 1478px'],
 ['left: 600px; top: 1470px; width: 60px','left: 712px; top: 1478px; width: 60px'],
]);
ed("src/cierre.src.html",[
 ['Y = 1000 + y * s * 1.3','Y = 1330 + y * s * 1.1'],
 ['X = 540 + x * s * 1.3','X = 540 + x * s * 1.1'],
 ['color: #D7B98C; opacity: 0; }','color: #F3DDB0; opacity: 0; text-shadow: 0 2px 12px #05070C; }'],
]);
console.log("ok");
