// Genera la pista de efectos de un video (window.__mix) y la guarda como WAV.
// Uso: node estudio/mezclar.mjs <url del video> <salida.wav>
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_PAGE = process.argv[2], OUT = process.argv[3];
const PORT = 9460;
const edge = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "mix-"))}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let url; for (let i = 0; i < 60 && !url; i++) { try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((x) => x.type === "page")?.webSocketDebuggerUrl; } catch {} await sleep(200); }
const ws = new WebSocket(url); await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pend = new Map(); const waits = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } if (m.method) waits.filter((w) => w.m === m.method).forEach((w) => w.r(m.params)); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description); return r.result.value; };
await send("Page.enable");
const loaded = new Promise((r) => waits.push({ m: "Page.loadEventFired", r }));
await send("Page.navigate", { url: URL_PAGE }); await loaded; await ev("window.__ready");
const info = await ev("window.__mix()");
const parts = []; for (let i = 0; i * 300000 < info.bytes; i++) parts.push(Buffer.from(await ev(`window.__wavChunk(${i})`), "base64"));
writeFileSync(OUT, Buffer.concat(parts));
ws.close(); edge.kill();
console.log(`listo: ${OUT} · ${info.sounds} sonidos · ${(info.bytes / 1e6).toFixed(1)} MB`);
