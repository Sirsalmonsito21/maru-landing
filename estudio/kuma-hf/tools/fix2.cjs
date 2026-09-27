const fs=require("fs");
function ed(f,pairs){let s=fs.readFileSync(f,"utf8");for(const [a,b] of pairs){if(!s.includes(a))throw new Error(f+" no: "+a.slice(0,70));s=s.split(a).join(b);}fs.writeFileSync(f,s);}
ed("src/cerebro.src.html",[
 ['multiplyScalar(.55 + on * 1.1)','multiplyScalar(.72 + on * 1.1)'],
 ['var CHIP = [[-2, 0], [0, 0], [2, 0], [4, -2], [4, 0], [4, 2]];','var CHIP = [[-2, 0], [0, 0], [2, 0], [4, -1.5], [4, 0], [4, 1.5]];'],
 ['[[2, 0], [3, 0], [3, -2], [4, -2]]','[[2, 0], [3, 0], [3, -1.5], [4, -1.5]]'],
 ['[[2, 0], [3, 0], [3, 2], [4, 2]]','[[2, 0], [3, 0], [3, 1.5], [4, 1.5]]'],
 ['new THREE.MeshBasicMaterial({ color: 0xFFE3A8, toneMapped: false, transparent: true, opacity: 0 })','new THREE.MeshBasicMaterial({ color: 0xE9CF9E, toneMapped: false, transparent: true, opacity: 0 })'],
 ['new THREE.PlaneGeometry(.7, .7)','new THREE.PlaneGeometry(.5, .5)'],
 ['m.material.emissiveIntensity = on * .4; m.userData.top.material.opacity = on * .9;','m.material.emissiveIntensity = on * .18; m.userData.top.material.opacity = on * .5;'],
 [`            var lt = t - G[2] - .75;
            var cx = lerp(-3.2, 5.5, clamp(lt / 5.25)), cz = 3.2 - lt * .2;
            camera.position.set(cx, 1.5 - lt * .08, cz);
            camera.lookAt(cx + 1.2, 0, cz - 3.2);
            camera.fov = 40; focus = 3.3;`,
 `            var lt = t - G[2] - .75;
            var cx = lerp(-.6, 1.8, eio(clamp(lt / 5.25))), sw = Math.sin(lt * .35) * .35;
            camera.up.set(1, 0, 0);
            camera.position.set(cx - 2.6, 6.6 - lt * .12, sw);
            camera.lookAt(cx + .4, 0, 0);
            camera.fov = 55; focus = 6.8;`],
 ['            camera.position.set(Math.sin(ang) * R, y + Math.sin(t * .4) * .2, Math.cos(ang) * R);','            camera.up.set(0, 1, 0);\n            camera.position.set(Math.sin(ang) * R, y + Math.sin(t * .4) * .2, Math.cos(ang) * R);'],
 ['el.style.opacity = on * (t < G[4] + .1 || i >= 3 ? 1 : .5);','el.style.opacity = on * (1 - pk(t, G[4] - .1, .2));'],
 ['el.style.transform = "translate(" + (p[0] - 115) + "px," + (p[1] - 110) + "px)";','el.style.transform = "translate(" + Math.min(700, Math.max(60, p[0] - 125)) + "px," + (p[1] + 70) + "px)";'],
]);
console.log("ok");
