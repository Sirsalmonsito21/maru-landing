// TODO: reemplazar por el número real de WhatsApp Business (código de país + número, sin + ni espacios)
const WHATSAPP = "51900000000";

// Íconos de cada opción; los textos viven en i18n.js.
// Ritmo por escena: el chat va un poco más pausado para leerlo con calma.
const PACE = { whatsapp: 1.35 };
const ICONS = { whatsapp: "i-wa", citas: "i-cal", excel: "i-sheet", reportes: "i-chart", cobros: "i-split", ia: "i-doc" };

const $ = (id) => document.getElementById(id);
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const { makeCtx, list: SCENES } = window.MaruScenes;
const I18N = window.MaruI18n;

let lang = root.lang.startsWith("en") ? "en" : "es";
let current = "whatsapp";
const T = () => I18N[lang];
const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } };

/* ---------- Enlaces de WhatsApp ---------- */
const topicMessage = () => T().wa.topic(T().pains[current].msg);
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function updateLinks() {
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa === "topic" ? topicMessage() : T().wa.general);
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Escenario del hero ---------- */
const stage = $("stage");
const view = $("stage-view");
const outCopy = $("out-copy");
let controller;
let started = false;

async function play(key) {
  started = true;
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

  const scene = document.createElement("div");
  scene.className = "scene";
  view.replaceChildren(scene);
  stage.dataset.scene = key;
  stage.classList.remove("done");
  try {
    await SCENES[key](scene, makeCtx(ctl.signal, reduced, T().scenes, PACE[key] || 1));
    stage.classList.add("done");
  } catch (e) {
    if (e.name !== "AbortError") console.error(e);
  }
}

function renderCopy(key) {
  const p = T().pains[key];
  $("o-title").textContent = p.title;
  $("o-text").textContent = p.con;
  $("o-svc").textContent = p.svc;
  $("stage-tool").textContent = p.tool;
  $("stage-icon").setAttribute("href", "#" + ICONS[key]);
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
    stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    select(btn.dataset.demo);
  });
});

// La primera escena arranca cuando el escenario se ve. Cada escena corre una vez; no hay loops.
new IntersectionObserver((entries, io) => {
  if (entries[0].isIntersecting) { if (!started) play(current); io.disconnect(); }
}, { threshold: 0.35 }).observe(stage);

/* ---------- Proyectos: el caso del bot se cuenta al entrar en pantalla ---------- */
const caseBot = $("case-bot");
if (!reduced) {
  caseBot.classList.add("armed");
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    caseBot.classList.add("play");
    io.disconnect();
  }, { threshold: 0.45 }).observe(caseBot);
}

// La gata solo respira mientras se ve (ahorra batería y trabajo al navegador).
const catFig = document.querySelector(".mandarina");
new IntersectionObserver(([e]) => catFig.classList.toggle("visible", e.isIntersecting)).observe(catFig);

/* ---------- Servicios: módulos desplegables, uno abierto a la vez ---------- */
const svcs = [...document.querySelectorAll(".svc")];
function setOpen(li, open) {
  li.toggleAttribute("data-open", open);
  li.querySelector(".svc-toggle").setAttribute("aria-expanded", String(open));
  li.querySelector(".svc-panel").inert = !open;
}
svcs.forEach((li) => {
  li.querySelector(".svc-toggle").addEventListener("click", () => {
    const open = !li.hasAttribute("data-open");
    svcs.forEach((o) => { if (o !== li) setOpen(o, false); });
    setOpen(li, open);
  });
});

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
  const base = T().wa.base;
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
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); stepIO.unobserve(e.target); } });
}, { rootMargin: "0px 0px -30% 0px" });
document.querySelectorAll(".step").forEach((s) => stepIO.observe(s));

/* ---------- Idioma (sin recargar) ---------- */
function applyLang(next) {
  lang = next;
  const t = T();
  root.lang = lang === "en" ? "en" : "es-PE";
  document.title = t.meta.title;
  document.querySelector('meta[name="description"]').content = t.meta.desc;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t.ui[el.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t.ui[el.dataset.i18nHtml]; });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t.ui[el.dataset.i18nAria]));
  document.querySelectorAll(".pain").forEach((label) => {
    const p = t.pains[label.querySelector("input").value];
    label.querySelector(".pl").textContent = p.label;
    label.querySelector(".ps").textContent = p.short;
  });
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.querySelector(".lang").dataset.active = lang;
  syncThemeLabel();
  renderCopy(current);
  updateLinks();
  typeRun++;
  composer.classList.remove("typing");
  composeText.textContent = topicMessage();
  if (started) play(current);
}

// Transiciones de página: crossfade corto para idioma, círculo desde el botón para el tema.
function transition(kind, update, origin) {
  if (reduced || !document.startViewTransition) { update(); return; }
  if (origin) {
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    root.style.setProperty("--vt-x", x + "px");
    root.style.setProperty("--vt-y", y + "px");
    root.style.setProperty("--vt-r", Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + "px");
  }
  activeVT?.skipTransition();
  root.classList.add("vt-" + kind);
  const vt = (activeVT = document.startViewTransition(update));
  vt.ready.catch(() => {}); // al saltarla, "ready" se rechaza: es esperado
  // Tope de seguridad: si la pestaña no pinta (oculta, en segundo plano), no bloquear la página.
  const cap = setTimeout(() => vt.skipTransition(), 1200);
  vt.finished.finally(() => {
    clearTimeout(cap);
    root.classList.remove("vt-" + kind);
    if (activeVT === vt) activeVT = null;
  });
}
let activeVT = null;

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.lang === lang) return;
    store("maru-lang", btn.dataset.lang);
    transition("lang", () => applyLang(btn.dataset.lang));
  });
});

/* ---------- Tema claro / oscuro ---------- */
const darkMQ = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("theme-btn");
const theme = () => root.dataset.theme || (darkMQ.matches ? "dark" : "light");

function syncThemeLabel() {
  const dark = theme() === "dark";
  themeBtn.setAttribute("aria-label", T().ui[dark ? "theme.toLight" : "theme.toDark"]);
  document.querySelector('meta[name="theme-color"]').content = dark ? "#1A1714" : "#F3EDE2";
}

themeBtn.addEventListener("click", () => {
  const next = theme() === "dark" ? "light" : "dark";
  store("maru-theme", next);
  transition("theme", () => { root.dataset.theme = next; syncThemeLabel(); }, themeBtn);
});
darkMQ.addEventListener("change", syncThemeLabel);

/* ---------- Nav: borde al dejar el tope (sin escuchar el scroll) ---------- */
const nav = document.querySelector(".nav");
const sentinel = document.createElement("div");
sentinel.className = "top-sentinel";
document.body.prepend(sentinel);
new IntersectionObserver(([e]) => nav.classList.toggle("scrolled", !e.isIntersecting)).observe(sentinel);

applyLang(lang);
