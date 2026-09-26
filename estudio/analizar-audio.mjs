// Analiza una pista (tempo, golpes, graves/agudos, secciones) decodificándola en Edge sin ventana.
// Uso: node estudio/analizar-audio.mjs <ruta servida> <salida.json>
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SRC = process.argv[2] || "/videos/01-copia-y-pega/02_voz/cancion.mov";
const OUT = process.argv[3] || "videos/01-copia-y-pega/02_voz/analisis.json";
const PORT = 9450;
const edge = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "aud-"))}`, "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let url; for (let i = 0; i < 60 && !url; i++) { try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((x) => x.type === "page")?.webSocketDebuggerUrl; } catch {} await sleep(200); }
const ws = new WebSocket(url); await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pend = new Map(); const waits = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method) waits.filter((w) => w.m === m.method).forEach((w) => w.r(m.params)); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
const loaded = new Promise((r) => waits.push({ m: "Page.loadEventFired", r }));
await send("Page.navigate", { url: "http://localhost:5180/estudio/kit.html" }); await loaded;

const code = `(async () => {
  const buf = await (await fetch(${JSON.stringify(SRC)})).arrayBuffer();
  const ac = new OfflineAudioContext(1, 48000, 48000);
  const audio = await ac.decodeAudioData(buf);
  const SR = audio.sampleRate, dur = audio.duration;
  // Mezcla a mono y filtra en bandas con un render offline
  async function band(type, freq) {
    const oc = new OfflineAudioContext(1, audio.length, SR);
    const s = oc.createBufferSource(); s.buffer = audio;
    let node = s;
    if (type) { const f = oc.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 0.7; s.connect(f); node = f; }
    node.connect(oc.destination); s.start();
    return (await oc.startRendering()).getChannelData(0);
  }
  const full = await band(null), low = await band("lowpass", 150), high = await band("highpass", 3000), mid = await band("bandpass", 1200);
  const HOP = 480; // 10 ms
  const env = (x) => { const n = Math.floor(x.length / HOP), e = new Float32Array(n); for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < HOP; j++) { const v = x[i * HOP + j]; s += v * v; } e[i] = Math.sqrt(s / HOP); } return e; };
  const eF = env(full), eL = env(low), eH = env(high), eM = env(mid);
  const onset = (e) => { const o = new Float32Array(e.length); for (let i = 1; i < e.length; i++) o[i] = Math.max(0, Math.log1p(e[i] * 50) - Math.log1p(e[i - 1] * 50)); return o; };
  const oL = onset(eL), oH = onset(eH), oM = onset(eM), oF = onset(eF);
  const comb = oF.map((v, i) => v + 1.3 * oL[i] + 0.8 * oH[i] + 0.6 * oM[i]);
  // Tempo por autocorrelación (60–190 BPM)
  const fps = SR / HOP; let best = { bpm: 0, score: -1 };
  for (let bpm = 60; bpm <= 190; bpm += 0.25) { const lag = fps * 60 / bpm; let s = 0; for (let i = 0; i + lag < comb.length; i++) { const j = i + lag, a = Math.floor(j), f = j - a; s += comb[i] * (comb[a] * (1 - f) + (comb[a + 1] || 0) * f); } if (s > best.score) best = { bpm, score: s }; }
  // Fase: desplazamiento que maximiza la energía de golpes sobre la grilla
  const period = 60 / best.bpm; let bestPh = { ph: 0, s: -1 };
  for (let ph = 0; ph < period; ph += 0.005) { let s = 0; for (let t = ph; t < dur; t += period) { const i = Math.round(t * fps); for (let k = -2; k <= 2; k++) s += comb[i + k] || 0; } if (s > bestPh.s) bestPh = { ph, s }; }
  const beats = []; for (let t = bestPh.ph; t < dur; t += period) { const i = Math.round(t * fps); let lo = 0, hi = 0, mi = 0, en = 0; for (let k = -3; k <= 3; k++) { lo = Math.max(lo, oL[i + k] || 0); hi = Math.max(hi, oH[i + k] || 0); mi = Math.max(mi, oM[i + k] || 0); } for (let k = 0; k < Math.round(period * fps); k++) en += eF[i + k] || 0; beats.push({ t: +t.toFixed(3), lo: +lo.toFixed(3), hi: +hi.toFixed(3), mid: +mi.toFixed(3), energy: +(en / Math.round(period * fps)).toFixed(4) }); }
  // Picos fuertes (golpes marcados) fuera de la grilla también
  const peaks = []; const thr = (() => { const s = [...comb].sort((a, b) => a - b); return s[Math.floor(s.length * 0.97)]; })();
  for (let i = 3; i < comb.length - 3; i++) { if (comb[i] > thr && comb[i] === Math.max(...comb.slice(i - 3, i + 4))) peaks.push({ t: +(i / fps).toFixed(3), v: +comb[i].toFixed(3), lo: +oL[i].toFixed(3), hi: +oH[i].toFixed(3) }); }
  // Energía por segundo para ver secciones
  const perSec = []; for (let s = 0; s < Math.ceil(dur); s++) { let a = 0, n = 0; for (let i = Math.floor(s * fps); i < Math.min(eF.length, (s + 1) * fps); i++) { a += eF[i]; n++; } perSec.push(+(a / Math.max(1, n)).toFixed(4)); }
  // Continuidad del loop: energía al final vs al inicio
  const head = eF.slice(0, Math.round(fps * 0.3)), tail = eF.slice(-Math.round(fps * 0.3));
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  return { dur, SR, channels: audio.numberOfChannels, bpm: best.bpm, period, phase: bestPh.ph, beats, peaks, perSec, loop: { headRms: avg(head), tailRms: avg(tail) } };
})()`;
const r = await send("Runtime.evaluate", { expression: code, awaitPromise: true, returnByValue: true });
ws.close(); edge.kill();
if (r.result.exceptionDetails) { console.log("ERROR", r.result.exceptionDetails.exception?.description); process.exit(1); }
const a = r.result.result.value;
writeFileSync(OUT, JSON.stringify(a, null, 1));
console.log(`duración ${a.dur.toFixed(3)} s · ${a.SR} Hz · ${a.channels} canales`);
console.log(`tempo ${a.bpm} BPM · golpe cada ${a.period.toFixed(3)} s · primer golpe en ${a.phase.toFixed(3)} s · ${a.beats.length} golpes`);
console.log("energía por segundo:", a.perSec.join(" "));
console.log("loop: rms inicio", a.loop.headRms.toFixed(4), "fin", a.loop.tailRms.toFixed(4));
console.log("picos fuertes:", a.peaks.map((p) => p.t + (p.lo > p.hi ? "L" : "H")).join(" "));
