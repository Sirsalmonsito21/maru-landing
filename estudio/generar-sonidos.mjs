// Sintetiza los efectos de sonido de Maru (WAV 48 kHz, 16 bits, mono). Son propios: sin licencias de terceros.
// Uso: node estudio/generar-sonidos.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 48000;
const OUT = "kit-video/05_sonidos";
mkdirSync(OUT, { recursive: true });

let seed = 12345;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x3fffffff) - 1;

function wav(name, samples) {
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = peak ? 0.7 / peak : 1; // pico en torno a -3 dBFS
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s * gain)) * 32767 | 0, i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(`${OUT}/${name}.wav`, Buffer.concat([h, data]));
  console.log(`${OUT}/${name}.wav  ${(samples.length / SR).toFixed(2)} s`);
}
const make = (sec, fn) => Array.from({ length: Math.round(sec * SR) }, (_, i) => fn(i / SR, i));
// Filtro pasa bajos de un polo con frecuencia de corte variable
function lowpass(samples, cutoffAt) {
  let y = 0;
  return samples.map((x, i) => {
    const fc = cutoffAt(i / SR);
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    y += a * (x - y);
    return y;
  });
}

// 1. Clic de "pegar": transitorio seco y corto
wav("clic", make(0.05, (t) => (noise() * 0.6 + Math.sin(2 * Math.PI * 2400 * t) * 0.5) * Math.exp(-t * 180)));

// 2. Whoosh: ruido que sube y baja con el filtro abriéndose
{
  const d = 0.5;
  const raw = make(d, (t) => noise() * Math.sin(Math.PI * (t / d)) ** 2);
  wav("whoosh", lowpass(raw, (t) => 300 + 5200 * Math.sin(Math.PI * (t / d))));
}

// 3. Golpe de sello: bombo grave con caída de tono + papel
{
  let phase = 0;
  wav("golpe-sello", make(0.45, (t) => {
    const f = 55 + 95 * Math.exp(-t * 28);
    phase += (2 * Math.PI * f) / SR;
    const body = Math.sin(phase) * Math.exp(-t * 9);
    const paper = noise() * Math.exp(-t * 60) * 0.55;
    return body + paper;
  }));
}

// 4. Ding: campana suave (resultado listo)
wav("ding", make(1.1, (t) => {
  const env = Math.exp(-t * 4.2) * Math.min(1, t * 400);
  return env * (Math.sin(2 * Math.PI * 1318.5 * t) + 0.45 * Math.sin(2 * Math.PI * 2637 * t) + 0.18 * Math.sin(2 * Math.PI * 3951 * t));
}));

// 5. Notificación de mensaje: dos notas cortas ascendentes
wav("notificacion", make(0.32, (t) => {
  const note = (start, f) => (t >= start ? Math.sin(2 * Math.PI * f * (t - start)) * Math.exp(-(t - start) * 22) * Math.min(1, (t - start) * 600) : 0);
  return note(0, 988) + note(0.11, 1480);
}));

// 6. Pop: para textos o burbujas que aparecen
{
  let phase = 0;
  wav("pop", make(0.09, (t) => {
    phase += (2 * Math.PI * (320 + 900 * (t / 0.09))) / SR;
    return Math.sin(phase) * Math.exp(-t * 55) * Math.min(1, t * 2000);
  }));
}

// 7. Tecleo suave (para "escribiendo…")
wav("tecleo", make(1.2, (t) => {
  const k = Math.floor(t / 0.085);
  const local = t - k * 0.085 - ((k * 37) % 5) * 0.004;
  return local > 0 ? noise() * Math.exp(-local * 260) * (0.6 + ((k * 13) % 7) / 14) : 0;
}));
