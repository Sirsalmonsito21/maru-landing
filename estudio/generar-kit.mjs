// Genera los PNG del kit de video (fondo transparente) a partir de estudio/kit.html.
// Uso: node estudio/generar-kit.mjs   (con el servidor local en http://localhost:5180)
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PIECES = {
  "fondo-washi": "kit-video/02_fondos/fondo-washi.png",
  "fondo-sakura": "kit-video/02_fondos/fondo-sakura.png",
  "fondo-sumi": "kit-video/02_fondos/fondo-sumi.png",
  "fondo-noche": "kit-video/02_fondos/fondo-noche.png",
  "sello": "kit-video/03_marca/sello-maru.png",
  "firma": "kit-video/03_marca/firma-maru-oscura.png",
  "firma-clara": "kit-video/03_marca/firma-maru-clara.png",
  "marca-oscura": "kit-video/03_marca/marca-MARU-oscura.png",
  "marca-clara": "kit-video/03_marca/marca-MARU-clara.png",
  "logo": "kit-video/03_marca/logo-maru-completo.png",
  "marco-celular": "kit-video/04_guias/marco-celular.png",
  "marco-ventana": "kit-video/04_guias/marco-ventana-escritorio.png",
  "guia-zona-segura": "kit-video/04_guias/guia-zona-segura-tiktok.png",
};
const PORT = 9420;
const edge = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "kit-"))}`,
  "--hide-scrollbars", "--window-size=1300,2000", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let url;
for (let i = 0; i < 60 && !url; i++) {
  try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((x) => x.type === "page")?.webSocketDebuggerUrl; } catch {}
  await sleep(200);
}
const ws = new WebSocket(url);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pend = new Map(); const waits = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method) waits.filter((w) => w.m === m.method).forEach((w) => w.r(m.params));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1300, height: 2000, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  const loaded = new Promise((r) => waits.push({ m: "Page.loadEventFired", r }));
  await send("Page.navigate", { url: "http://localhost:5180/estudio/kit.html" });
  await loaded;
  await ev("window.__ready.then(() => new Promise(r => setTimeout(r, 500)))");
  for (const [pieceId, out] of Object.entries(PIECES)) {
    const box = await ev(`(() => {
      document.querySelectorAll('.piece').forEach(p => p.style.visibility = p.id === ${JSON.stringify(pieceId)} ? 'visible' : 'hidden');
      const r = document.getElementById(${JSON.stringify(pieceId)}).getBoundingClientRect();
      return { x: r.left, y: r.top, width: Math.ceil(r.width), height: Math.ceil(r.height) };
    })()`);
    await sleep(120);
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { ...box, scale: 1 }, captureBeyondViewport: true });
    mkdirSync(out.split("/").slice(0, -1).join("/"), { recursive: true });
    writeFileSync(out, Buffer.from(shot.result.data, "base64"));
    console.log(`${out}  ${box.width}×${box.height}`);
  }
} finally {
  ws.close();
  edge.kill();
}
