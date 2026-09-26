// Exporta una página del estudio a MP4 (1080×1920, 30 fps) sin instalar nada:
// Edge sin ventana dibuja cada cuadro con window.__seek(t) y el propio navegador lo codifica a H.264.
// Uso: node estudio/exportar.mjs [url] [salida.mp4] [archivo de audio local, opcional]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_PAGE = process.argv[2] || "http://localhost:5180/estudio/video1.html?rec";
const OUT = process.argv[3] || "estudio/video1-prueba.mp4";
const AUDIO = process.argv[4] || ""; // archivo de audio local: si viene, el MP4 lleva esa pista (AAC u Opus)
const FPS = 30, W = 1080, H = 1920, PORT = 9333;
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const profile = mkdtempSync(join(tmpdir(), "maru-edge-"));
const edge = spawn(EDGE, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--hide-scrollbars", "--mute-audio", "--no-first-run", `--window-size=${W},${H}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((x) => x.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("Edge no respondió");
}

const ws = new WebSocket(await target());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map(); const waiters = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
  if (msg.method) waiters.filter((w) => w.method === msg.method).forEach((w) => w.res(msg.params));
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const once = (method) => new Promise((res) => waiters.push({ method, res }));
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  const loaded = once("Page.loadEventFired");
  await send("Page.navigate", { url: URL_PAGE });
  await loaded;
  await evaluate("window.__ready");
  const duration = await evaluate("window.__duration");

  if (AUDIO) {
    const b64 = readFileSync(AUDIO).toString("base64");
    for (let i = 0; i < b64.length; i += 400000) await evaluate(`(window.__ab = window.__ab || []).push(${JSON.stringify(b64.slice(i, i + 400000))}); 1`);
  }
  // Codificador H.264 + contenedor MP4 dentro de la página
  await evaluate(`(async () => {
    const { Muxer, ArrayBufferTarget } = await import("https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.5/+esm");
    let aCfg = null;
    const AUDIO = ${JSON.stringify(AUDIO)};
    if (AUDIO) {
      const buf = Uint8Array.from(atob(window.__ab.join("")), (c) => c.charCodeAt(0)).buffer;
      window.__audio = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(buf);
      const base = { sampleRate: window.__audio.sampleRate, numberOfChannels: Math.min(2, window.__audio.numberOfChannels), bitrate: 192000 };
      for (const [codec, mux] of [["mp4a.40.2", "aac"], ["opus", "opus"]]) {
        if ((await AudioEncoder.isConfigSupported({ ...base, codec })).supported) { aCfg = { enc: { ...base, codec }, mux }; break; }
      }
      if (!aCfg) throw new Error("Este Edge no codifica audio");
    }
    const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: ${W}, height: ${H} },
      ...(aCfg ? { audio: { codec: aCfg.mux, numberOfChannels: aCfg.enc.numberOfChannels, sampleRate: aCfg.enc.sampleRate } } : {}),
      fastStart: "in-memory", firstTimestampBehavior: "offset" });
    window.__audioCodec = aCfg ? aCfg.mux : "";
    window.__encodeAudio = async (seconds) => {
      if (!aCfg) return;
      const ae = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: (e) => { window.__encErr = String(e); } });
      ae.configure(aCfg.enc);
      const a = window.__audio, ch = aCfg.enc.numberOfChannels, sr = a.sampleRate;
      const total = Math.min(a.length, Math.round(seconds * sr)), CH = 4096;
      for (let off = 0; off < total; off += CH) {
        const n = Math.min(CH, total - off), data = new Float32Array(n * ch);
        for (let c = 0; c < ch; c++) data.set(a.getChannelData(Math.min(c, a.numberOfChannels - 1)).subarray(off, off + n), c * n);
        const ad = new AudioData({ format: "f32-planar", sampleRate: sr, numberOfFrames: n, numberOfChannels: ch, timestamp: Math.round(off / sr * 1e6), data });
        ae.encode(ad); ad.close();
      }
      await ae.flush();
    };
    const enc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: (e) => { window.__encErr = String(e); } });
    const config = { codec: "avc1.640028", width: ${W}, height: ${H}, bitrate: 14_000_000, framerate: ${FPS} };
    const ok = await VideoEncoder.isConfigSupported(config);
    if (!ok.supported) throw new Error("H.264 no soportado en este Edge");
    enc.configure(config);
    window.__add = async (b64, i) => {
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const bmp = await createImageBitmap(new Blob([bytes], { type: "image/jpeg" }));
      const frame = new VideoFrame(bmp, { timestamp: Math.round(i * 1e6 / ${FPS}), duration: Math.round(1e6 / ${FPS}) });
      enc.encode(frame, { keyFrame: i % ${FPS * 2} === 0 });
      frame.close(); bmp.close();
      if (enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 20));
      return window.__encErr || "";
    };
    window.__finish = async (seconds) => {
      await enc.flush(); await window.__encodeAudio(seconds); muxer.finalize();
      window.__mp4 = new Uint8Array(muxer.target.buffer);
      return window.__mp4.length;
    };
    window.__chunk = (start, len) => {
      let s = ""; const part = window.__mp4.subarray(start, start + len);
      for (let i = 0; i < part.length; i += 0x8000) s += String.fromCharCode.apply(null, part.subarray(i, i + 0x8000));
      return btoa(s);
    };
    return true;
  })()`);

  const frames = Math.round(duration * FPS) + 1;
  for (let i = 0; i < frames; i++) {
    await evaluate(`window.__seek(${(i / FPS).toFixed(4)}); new Promise(r => requestAnimationFrame(() => r(1)))`);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 96, clip: { x: 0, y: 0, width: W, height: H, scale: 1 }, captureBeyondViewport: false });
    const err = await evaluate(`window.__add(${JSON.stringify(shot.data)}, ${i})`);
    if (err) throw new Error(err);
    if (i % 30 === 0) process.stdout.write(`cuadro ${i}/${frames}\n`);
  }

  const size = await evaluate(`window.__finish(${duration})`);
  const codec = await evaluate("window.__audioCodec");
  if (codec) console.log(`audio: ${codec}`);
  const parts = [];
  for (let start = 0; start < size; start += 1 << 20) {
    parts.push(Buffer.from(await evaluate(`window.__chunk(${start}, ${1 << 20})`), "base64"));
  }
  writeFileSync(OUT, Buffer.concat(parts));
  console.log(`Listo: ${OUT} (${(size / 1e6).toFixed(1)} MB, ${frames} cuadros)`);
} finally {
  ws.close();
  edge.kill();
}
