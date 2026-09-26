// TODO: reemplazar por el número real de WhatsApp Business (código de país + número, sin + ni espacios)
const WHATSAPP = "51900000000";

const PAINS = {
  whatsapp: {
    title: "Un asistente que responde por ti",
    con: "Un bot en tu WhatsApp Business responde al instante, a cualquier hora, y te pasa solo las conversaciones que necesitan a una persona.",
    svc: "Bots de WhatsApp",
    tool: "WhatsApp Business", icon: "i-wa",
    msg: "responder los mismos mensajes de WhatsApp",
  },
  citas: {
    title: "Tu agenda se llena y se confirma sola",
    con: "El cliente elige su horario, la cita entra a tu calendario y el recordatorio sale solo el día anterior.",
    svc: "Bots de WhatsApp + agenda",
    tool: "Tu agenda", icon: "i-cal",
    msg: "agendar y confirmar citas",
  },
  excel: {
    title: "Los datos se ordenan solos",
    con: "Cada pedido o formulario llega a tu Google Sheets o Excel limpio, sin duplicados, y el gráfico se arma solo.",
    svc: "Automatización de procesos",
    tool: "Google Sheets", icon: "i-sheet",
    msg: "pasar datos a Excel a mano",
  },
  reportes: {
    title: "Tus números al día, sin armarlos",
    con: "Un dashboard se actualiza con cada venta, y lo revisas desde el celular cuando quieras.",
    svc: "Dashboards",
    tool: "Panel de ventas", icon: "i-chart",
    msg: "armar reportes de ventas",
  },
  cobros: {
    title: "Cobros que no se te escapan",
    con: "Un flujo revisa cada mañana quién debe, manda el recordatorio por WhatsApp y marca lo que ya se pagó.",
    svc: "Automatización de procesos",
    tool: "Flujo automático", icon: "i-split",
    msg: "perseguir pagos y comprobantes",
  },
  ia: {
    title: "Una IA que conoce tu negocio",
    con: "Empezamos con un taller práctico y, si te sirve, armamos un asistente que responde con tus propios documentos.",
    svc: "Talleres y asistentes de IA",
    tool: "Asistente de IA", icon: "i-doc",
    msg: "empezar a usar la IA en mi negocio",
  },
};

const $ = (id) => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const { makeCtx, list: SCENES } = window.MaruScenes;
let current = "whatsapp";

/* ---------- Enlaces de WhatsApp ---------- */
const topicMessage = () => `Hola Maru, quiero una consultoría gratis. Lo que más tiempo me quita es ${PAINS[current].msg}.`;
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function updateLinks() {
  const general = "Hola Maru, quiero una consultoría gratis para automatizar tareas de mi negocio.";
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa === "topic" ? topicMessage() : general);
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Escenario del hero ---------- */
const stage = $("stage");
const view = $("stage-view");
const outCopy = $("out-copy");
let controller;

async function play(key) {
  controller?.abort();
  const ctl = (controller = new AbortController());

  const old = view.firstElementChild;
  if (old && !reduced) {
    await old.animate(
      [{ opacity: 1, filter: "blur(0px)", transform: "none" }, { opacity: 0, filter: "blur(6px)", transform: "scale(0.98)" }],
      { duration: 160, easing: "ease-in", fill: "forwards" }
    ).finished.catch(() => {});
    if (ctl.signal.aborted) return;
  }

  const root = document.createElement("div");
  root.className = "scene";
  view.replaceChildren(root);
  stage.dataset.scene = key;
  stage.classList.remove("done");
  try {
    await SCENES[key](root, makeCtx(ctl.signal, reduced));
    stage.classList.add("done");
  } catch (e) {
    if (e.name !== "AbortError") console.error(e);
  }
}

function renderCopy(key) {
  const p = PAINS[key];
  $("o-title").textContent = p.title;
  $("o-text").textContent = p.con;
  $("o-svc").textContent = p.svc;
  $("stage-tool").textContent = p.tool;
  $("stage-icon").setAttribute("href", "#" + p.icon);
}

let swapTimer;
function select(key) {
  current = key;
  updateLinks();
  updateComposer();
  play(key);
  clearTimeout(swapTimer);
  if (reduced) { renderCopy(key); return; }
  outCopy.classList.add("swap");
  swapTimer = setTimeout(() => { renderCopy(key); outCopy.classList.remove("swap"); }, 170);
}

document.querySelectorAll('input[name="pain"]').forEach((input) => {
  input.addEventListener("change", () => select(input.value));
});

$("replay").addEventListener("click", () => play(current));

// "Ver ejemplo" en servicios: elige la opción y sube al escenario.
document.querySelectorAll("[data-demo]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.querySelector(`input[name="pain"][value="${btn.dataset.demo}"]`);
    input.checked = true;
    input.scrollIntoView({ block: "nearest", inline: "center" });
    stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    select(btn.dataset.demo);
  });
});

// La primera escena arranca cuando el escenario se ve. Cada escena corre una vez; no hay loops.
new IntersectionObserver((entries, io) => {
  if (entries[0].isIntersecting) { play(current); io.disconnect(); }
}, { threshold: 0.35 }).observe(stage);

/* ---------- Mensaje final ---------- */
const composeText = $("compose-text");
const composer = document.querySelector(".composer");
let typed = false;
let typeRun = 0;

function updateComposer() {
  if (!typed) return;
  typeInto(topicMessage(), 12);
}

async function typeInto(text, speed) {
  const run = ++typeRun;
  if (reduced) { composeText.textContent = text; return; }
  composer.classList.add("typing");
  const base = "Hola Maru, quiero una consultoría gratis. ";
  let i = composeText.textContent.startsWith(base) && text.startsWith(base) ? base.length : 0;
  composeText.textContent = text.slice(0, i);
  while (i < text.length) {
    if (run !== typeRun) return;
    i += 1;
    composeText.textContent = text.slice(0, i);
    await new Promise((r) => setTimeout(r, speed + (text[i - 1] === "," || text[i - 1] === "." ? speed * 8 : 0)));
  }
  composer.classList.remove("typing");
}

new IntersectionObserver((entries, io) => {
  if (!entries[0].isIntersecting) return;
  typed = true;
  io.disconnect();
  typeInto(topicMessage(), 26);
}, { threshold: 0.6 }).observe(composer);

/* ---------- Pasos: se encienden al llegar ---------- */
const steps = document.querySelectorAll(".step");
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); stepIO.unobserve(e.target); } });
}, { rootMargin: "0px 0px -30% 0px" });
steps.forEach((s) => stepIO.observe(s));

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

updateLinks();
