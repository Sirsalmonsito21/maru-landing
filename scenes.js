(() => {
// Escenas del hero. Cada una arma su propio DOM dentro de la ventana y corre su coreografía.
// Con movimiento reducido, el mismo código corre con duración 0 y muestra el estado final.

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IO = "cubic-bezier(0.77, 0, 0.175, 1)";

function h(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function icon(id, cls = "ic") {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("class", cls);
  s.setAttribute("aria-hidden", "true");
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", "#" + id);
  s.append(u);
  return s;
}

const abortErr = () => new DOMException("scene aborted", "AbortError");

// pace > 1 hace la escena más lenta (esperas y duraciones).
function makeCtx(signal, fast, t = {}, pace = 1) {
  const guard = () => { if (signal.aborted) throw abortErr(); };
  const c = {
    fast,
    t,
    guard,
    wait(ms) {
      if (fast) return Promise.resolve().then(guard);
      return new Promise((res, rej) => {
        const t = setTimeout(() => (signal.aborted ? rej(abortErr()) : res()), ms * pace);
        signal.addEventListener("abort", () => { clearTimeout(t); rej(abortErr()); }, { once: true });
      });
    },
    // Anima y espera. fill: both para que los retrasos muestren el estado inicial.
    async a(node, kf, o = {}) {
      const opts = { duration: 400, easing: EASE, fill: "both", ...o };
      opts.duration *= pace; opts.delay = (opts.delay || 0) * pace;
      if (fast) { opts.duration = 0; opts.delay = 0; }
      const an = node.animate(kf, opts);
      await an.finished.catch(() => {});
      guard();
      return an;
    },
    // Anima sin esperar.
    fire(node, kf, o = {}) {
      const opts = { duration: 400, easing: EASE, fill: "both", ...o };
      opts.duration *= pace; opts.delay = (opts.delay || 0) * pace;
      if (fast) { opts.duration = 0; opts.delay = 0; }
      return node.animate(kf, opts);
    },
    // Solo transform + opacity: el blur animado en muchos elementos traba Safari.
    enter(node, { y = 8, s = 0.97, dur = 380, delay = 0, origin } = {}) {
      if (origin) node.style.transformOrigin = origin;
      return c.a(node, [
        { opacity: 0, transform: `translateY(${y}px) scale(${s})` },
        { opacity: 1, transform: "none" },
      ], { duration: dur, delay, fill: "backwards" });
    },
    count(node, from, to, dur, fmt) {
      if (fast) { node.textContent = fmt(to); return Promise.resolve(); }
      return new Promise((res) => {
        const t0 = performance.now();
        const tick = (now) => {
          if (signal.aborted) return res();
          const p = Math.min(1, (now - t0) / (dur * pace));
          const e = 1 - Math.pow(1 - p, 3);
          node.textContent = fmt(from + (to - from) * e);
          p < 1 ? requestAnimationFrame(tick) : res();
        };
        requestAnimationFrame(tick);
      });
    },
    // Mueve un punto por un path SVG cuyo viewBox está en píxeles de la escena.
    travel(path, dot, dur) {
      const len = path.getTotalLength();
      if (fast) return Promise.resolve();
      dot.style.opacity = "1";
      return new Promise((res) => {
        const t0 = performance.now();
        const tick = (now) => {
          if (signal.aborted) return res();
          const p = Math.min(1, (now - t0) / (dur * pace));
          const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          const pt = path.getPointAtLength(len * e);
          dot.style.left = pt.x + "px";
          dot.style.top = pt.y + "px";
          if (p < 1) requestAnimationFrame(tick);
          else { dot.style.opacity = "0"; res(); }
        };
        requestAnimationFrame(tick);
      });
    },
  };
  return c;
}

const soles = (v) => "S/ " + Math.round(v).toLocaleString("es-PE");

/* ---------------- WhatsApp: el bot responde a las 11 de la noche ---------------- */
async function sceneWhatsapp(root, c) {
  root.classList.add("sc-chat");
  const T = c.t.chat;
  const head = h("div", "chat-head");
  const who = h("div", "chat-who");
  who.append(h("strong", null, T.biz), h("span", null, T.online));
  head.append(h("span", "chat-av", T.biz[0]), who);
  const body = h("div", "chat-body");
  root.append(head, body);

  const msg = (side, text, meta) => {
    const b = h("div", `bub ${side}`);
    b.append(h("span", "bub-text", text));
    if (meta) b.append(h("span", "bub-meta", meta));
    body.append(b);
    return c.enter(b, { y: 10, s: 0.94, dur: 360, origin: side === "in" ? "0% 100%" : "100% 100%" });
  };
  const typing = async () => {
    const t = h("div", "bub out bub-typing");
    t.append(h("i"), h("i"), h("i"));
    body.append(t);
    await c.enter(t, { dur: 200, origin: "100% 100%" });
    return t;
  };

  await c.wait(300);
  await msg("in", T.q, T.t1);
  let t = await typing();
  await c.wait(850);
  t.remove();
  await msg("out", T.a1, `${T.auto} · ${T.t1}`);

  const qr = h("div", "chat-qr");
  const yes = h("span", "qr", T.yes);
  qr.append(yes, h("span", "qr", T.human));
  body.append(qr);
  await c.enter(qr, { y: 6, dur: 300 });
  await c.wait(700);
  await c.a(yes, [{ transform: "scale(1)" }, { transform: "scale(0.92)" }, { transform: "scale(1)" }], { duration: 260, fill: "none" });
  yes.classList.add("on");
  await c.wait(220);
  await msg("in", T.yes, T.t2);
  t = await typing();
  await c.wait(700);
  t.remove();
  await msg("out", T.a2, `${T.auto} · ${T.t2}`);
  await c.wait(250);

  const done = h("div", "chat-done");
  done.append(icon("i-check"), h("span", null, T.done));
  body.append(done);
  await c.enter(done, { y: 10, s: 0.9, dur: 460 });
}

/* ---------------- Citas: la semana se llena sola ---------------- */
async function sceneCitas(root, c) {
  root.classList.add("sc-cal");
  const T = c.t.cal;
  const days = T.days;
  const hours = ["9:00", "10:00", "11:00", "12:00", "16:00"];

  const top = h("div", "cal-top");
  const count = h("span", "cal-count", T.count(0));
  top.append(h("strong", null, T.week), count);

  const grid = h("div", "cal-grid");
  grid.append(h("span"));
  days.forEach((d) => grid.append(h("span", "cal-day", d)));
  const cells = {};
  hours.forEach((hr, r) => {
    grid.append(h("span", "cal-hr", hr));
    days.forEach((_, d) => {
      const cell = h("span", "cal-cell");
      cells[`${d}-${r}`] = cell;
      grid.append(cell);
    });
  });
  [[0, 0], [2, 3], [4, 1], [1, 4]].forEach(([d, r]) => cells[`${d}-${r}`].append(h("span", "cal-busy")));

  const toast = h("div", "cal-toast");
  root.append(top, grid, toast);

  const book = [["Ana", 3, 1], ["Luis", 1, 2], ["Rosa", 0, 3], ["Jorge", 4, 4], ["Carla", 2, 0]];
  const evs = [];
  let n = 0;
  const showToast = (ic, text) => {
    toast.replaceChildren(icon(ic), h("span", null, text));
    return c.a(toast, [
      { opacity: 0, transform: "translate(-50%, 14px) scale(0.96)" },
      { opacity: 1, transform: "translate(-50%, 0) scale(1)" },
    ], { duration: 420 });
  };
  const hideToast = () => c.a(toast, [
    { opacity: 1, transform: "translate(-50%, 0) scale(1)" },
    { opacity: 0, transform: "translate(-50%, 8px) scale(0.98)" },
  ], { duration: 220, easing: "ease-in" });

  for (const [name, d, r] of book) {
    await showToast("i-wa", T.booked(name, days[d], hours[r]));
    await c.wait(n === 0 ? 650 : 420);
    const ev = h("span", "cal-ev", name);
    cells[`${d}-${r}`].append(ev);
    evs.push(ev);
    c.fire(cells[`${d}-${r}`], [{ boxShadow: "inset 0 0 0 2px var(--mandarina)" }, { boxShadow: "inset 0 0 0 2px transparent" }], { duration: 700, fill: "none" });
    await c.enter(ev, { y: -14, s: 0.86, dur: 420 });
    n++;
    count.textContent = T.count(n);
    await c.wait(n === 1 ? 450 : 260);
    await hideToast();
    await c.wait(120);
  }

  await c.wait(300);
  await showToast("i-bell", T.reminders);
  await c.wait(350);
  for (const ev of evs) {
    const ok = icon("i-check", "ic ok");
    ev.append(ok);
    ev.classList.add("confirmed");
    c.fire(ok, [{ opacity: 0, transform: "scale(0.5)" }, { opacity: 1, transform: "scale(1)" }], { duration: 300 });
    await c.wait(110);
  }
  count.textContent = T.confirmed(evs.length);
  c.fire(count, [{ color: "var(--mandarina-deep)", transform: "scale(1.06)" }, { color: "var(--text)", transform: "scale(1)" }], { duration: 600, fill: "none" });
}

/* ---------------- Excel: el desorden se ordena y se vuelve gráfico ---------------- */
async function sceneExcel(root, c) {
  root.classList.add("sc-xl");
  const T = c.t.xl;
  const rows = T.rows;
  const dups = [["ANA PEREZ", 0, 0], ["15/3", 0, 1], ["120", 0, 2]];

  const sheet = h("div", "xl-sheet");
  T.heads.forEach((t) => sheet.append(h("span", "xl-h", t)));
  const cells = rows.map((r) => r.map((_, ci) => {
    const cell = h("span", "xl-c" + (ci === 2 ? " num" : ""));
    sheet.append(cell);
    return cell;
  }));

  const chart = h("div", "xl-chart");
  const bars = h("div", "xl-bars");
  const total = h("strong", null, "S/ 0.00");
  const tot = h("p", "xl-total");
  tot.append(h("span", null, T.total), total);
  chart.append(h("p", "xl-ctitle", T.chart), bars, tot);

  const notes = h("div", "xl-notes");
  T.notes.forEach((t) => {
    const n = h("span", "xl-note");
    n.append(icon("i-check"), h("span", null, t));
    notes.append(n);
  });

  const mess = h("div", "xl-mess");
  root.append(sheet, chart, notes, mess);

  // Posiciones desordenadas pero fijas (no aleatorias en cada carga).
  const spots = [[6, 10, -7], [44, 6, 5], [70, 16, -4], [14, 34, 6], [52, 30, -9], [30, 52, 3],
    [66, 46, 8], [8, 68, -5], [40, 74, 7], [72, 70, -6], [20, 86, 4], [56, 88, -3], [84, 34, 9], [28, 18, -8], [80, 88, 5]];
  const all = [];
  rows.forEach((r, ri) => r.forEach(([raw, clean], ci) => all.push({ raw, clean, ri, ci })));
  dups.forEach(([raw, ri, ci]) => all.push({ raw, ri, ci, dup: true }));

  all.forEach((it, i) => {
    const [x, y, rot] = spots[i];
    const chip = h("span", "xl-chip" + (it.dup ? " dup" : "") + (i % 3 === 0 ? " loud" : ""), it.raw);
    chip.style.left = x + "%";
    chip.style.top = y + "%";
    chip.style.transform = `rotate(${rot}deg)`;
    it.chip = chip;
    it.rot = rot;
    mess.append(chip);
    c.fire(chip, [{ opacity: 0, transform: `rotate(${rot * 2}deg) scale(0.6)` }, { opacity: 1, transform: `rotate(${rot}deg) scale(1)` }], { duration: 420, delay: i * 35, fill: "backwards" });
  });

  await c.wait(1300);
  root.classList.add("has-sheet");
  await c.a(sheet, [{ clipPath: "inset(0 100% 0 0 round 10px)" }, { clipPath: "inset(0 0 0 0 round 10px)" }], { duration: 520, easing: EASE_IO });

  // Cada dato vuela a su celda (FLIP a mano).
  const R = root.getBoundingClientRect();
  const flights = all.map((it, i) => {
    const target = cells[it.ri][it.ci].getBoundingClientRect();
    const p = it.chip.getBoundingClientRect();
    const w = it.chip.offsetWidth;
    const px = p.left + p.width / 2;
    const py = p.top + p.height / 2;
    const tx = it.ci === 2 ? target.right - 10 - w / 2 : target.left + 10 + w / 2;
    const ty = target.top + target.height / 2;
    const end = it.dup
      ? { transform: `translate(${tx - px}px, ${ty - py}px) rotate(0deg) scale(0.7)`, opacity: 0 }
      : { transform: `translate(${tx - px}px, ${ty - py}px) rotate(0deg)`, opacity: 1 };
    return c.a(it.chip, [{ transform: `rotate(${it.rot}deg)`, opacity: 1 }, end], {
      duration: 760, delay: (it.dup ? 380 : 0) + i * 40, easing: EASE_IO, fill: "forwards",
    });
  });
  void R;
  await Promise.all(flights);

  all.forEach((it) => {
    if (!it.dup) {
      const cell = cells[it.ri][it.ci];
      cell.textContent = it.raw;
      cell.classList.add("raw");
    }
    it.chip.remove();
  });

  // Pasada de limpieza, fila por fila.
  const scan = h("span", "xl-scan");
  sheet.append(scan);
  for (let ri = 0; ri < rows.length; ri++) {
    const rowTop = cells[ri][0].offsetTop;
    const rowH = cells[ri][0].offsetHeight;
    c.fire(scan, [{ opacity: 1, transform: `translateY(${rowTop}px)`, height: rowH + "px" }], { duration: 220, easing: EASE_IO, fill: "forwards", composite: "replace" });
    await c.wait(200);
    rows[ri].forEach(([, clean], ci) => {
      const cell = cells[ri][ci];
      cell.textContent = clean;
      cell.classList.remove("raw");
      c.fire(cell, [{ opacity: 0.25 }, { opacity: 1 }], { duration: 280, fill: "none" });
    });
    await c.wait(170);
  }
  c.fire(scan, [{ opacity: 0 }], { duration: 200, fill: "forwards" });

  // Gráfico.
  root.classList.add("has-chart");
  await c.enter(chart, { y: 12, dur: 420 });
  const data = [["Rosa", 200], ["Ana", 120], ["Luis", 85], ["Jorge", 45]];
  data.forEach(([name, v], i) => {
    const row = h("div", "xl-bar");
    const track = h("span", "xl-track");
    const fill = h("span", "xl-fill");
    fill.style.width = (v / 200) * 100 + "%";
    track.append(fill);
    row.append(h("span", "xl-bl", name), track, h("span", "xl-bv", "S/ " + v));
    bars.append(row);
    c.fire(fill, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 700, delay: 80 + i * 90 });
    c.fire(row, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 90 });
  });
  await c.count(total, 0, 450, 900, (v) => "S/ " + v.toFixed(2));
  root.classList.add("has-notes");
  [...notes.children].forEach((n, i) => c.fire(n, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: i * 80 }));
}

/* ---------------- Reportes: el panel se actualiza solo ---------------- */
async function sceneReportes(root, c) {
  root.classList.add("sc-dash");
  const T = c.t.dash;
  const kpi = h("div", "dash-kpi");
  const val = h("strong", "dash-val", "S/ 0");
  const live = h("span", "dash-live", T.live);
  const kl = h("div");
  kl.append(h("span", "dash-lab", T.kpi), val);
  kpi.append(kl, live);

  const chartBox = h("div", "dash-chart");
  const pts = [[0, 70], [16.6, 58], [33.3, 64], [50, 42], [66.6, 48], [83.3, 30], [100, 22]];
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x + " " + y).join(" ");
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  const area = document.createElementNS(NS, "path");
  area.setAttribute("d", d + " L100 100 L0 100 Z");
  area.setAttribute("class", "dash-area");
  const line = document.createElementNS(NS, "path");
  line.setAttribute("d", d);
  line.setAttribute("class", "dash-line");
  line.setAttribute("pathLength", "1");
  svg.append(area, line);
  chartBox.append(svg);
  const dots = pts.map(([x, y]) => {
    const dot = h("span", "dash-dot");
    dot.style.left = x + "%";
    dot.style.top = y + "%";
    chartBox.append(dot);
    return dot;
  });
  const axis = h("div", "dash-axis");
  T.axis.forEach((t) => axis.append(h("span", null, t)));

  const top = h("div", "dash-top");
  top.append(h("p", "dash-lab", T.top));
  const items = [[T.items[0], 100], [T.items[1], 74], [T.items[2], 38]];
  const rowsEl = items.map(([name, w]) => {
    const r = h("div", "dash-row");
    const tr = h("span", "xl-track");
    const f = h("span", "xl-fill");
    f.style.width = w + "%";
    tr.append(f);
    r.append(h("span", null, name), tr);
    top.append(r);
    return f;
  });

  const toast = h("div", "dash-toast");
  toast.append(icon("i-chart"), h("span", null, T.sale));
  root.append(kpi, chartBox, axis, top, toast);

  // Ya con tamaño real, el trazo pasa a píxeles para que no se deforme.
  const cw = chartBox.clientWidth, ch = chartBox.clientHeight;
  const pd = pts.map(([x, y], i) => (i ? "L" : "M") + (x / 100) * cw + " " + (y / 100) * ch).join(" ");
  svg.setAttribute("viewBox", `0 0 ${cw} ${ch}`);
  svg.removeAttribute("preserveAspectRatio");
  line.setAttribute("d", pd);
  area.setAttribute("d", pd + ` L${cw} ${ch} L0 ${ch} Z`);

  c.fire(line, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, easing: EASE_IO });
  c.fire(area, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 600 });
  dots.forEach((dot, i) => c.fire(dot, [{ opacity: 0, transform: "translate(-50%,-50%) scale(0.3)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1)" }], { duration: 300, delay: 150 + i * 140 }));
  rowsEl.forEach((f, i) => c.fire(f, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 700, delay: 500 + i * 110 }));
  await c.count(val, 0, 8240, 1200, soles);
  await c.wait(900);

  await c.a(toast, [{ opacity: 0, transform: "translateY(-10px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 320 });
  const last = dots[dots.length - 1];
  last.classList.add("ping");
  c.fire(val, [{ color: "var(--mandarina-deep)" }, { color: "var(--text)" }], { duration: 900, fill: "none" });
  await c.count(val, 8240, 8420, 600, soles);
  live.textContent = T.liveNow;
}

/* ---------------- Cobros: un flujo de nodos que trabaja solo ---------------- */
async function sceneCobros(root, c) {
  root.classList.add("sc-flow");
  const T = c.t.flow;
  const NS = "http://www.w3.org/2000/svg";
  const nodes = {
    a: { x: 11, y: 42, ic: "i-clock", t: T.nodes.a[0], s: T.nodes.a[1], trig: true },
    b: { x: 33, y: 42, ic: "i-sheet", t: T.nodes.b[0], s: T.nodes.b[1] },
    c: { x: 55, y: 42, ic: "i-split", t: T.nodes.c[0], s: T.nodes.c[1] },
    d: { x: 80, y: 20, ic: "i-wa", t: T.nodes.d[0], s: T.nodes.d[1] },
    e: { x: 80, y: 64, ic: "i-check", t: T.nodes.e[0], s: T.nodes.e[1] },
  };
  const edges = [["a", "b", T.edges[0]], ["b", "c", T.edges[1]], ["c", "d", T.edges[2]], ["c", "e", T.edges[3]]];

  // Las conexiones se dibujan en píxeles reales de la escena para que el trazo no se deforme.
  const W = root.clientWidth, H = root.clientHeight;
  // En pantallas angostas el flujo va en dos filas.
  const narrow = W < 520;
  if (narrow) {
    Object.assign(nodes.a, { x: 14, y: 15 });
    Object.assign(nodes.b, { x: 50, y: 15 });
    Object.assign(nodes.c, { x: 86, y: 15 });
    Object.assign(nodes.d, { x: 30, y: 50 });
    Object.assign(nodes.e, { x: 72, y: 50 });
  }
  const px = (n) => [(n.x / 100) * W, (n.y / 100) * H];
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "flow-edges");
  root.append(svg);

  const paths = {};
  edges.forEach(([f, t]) => {
    const [ax, ay] = px(nodes[f]), [bx, by] = px(nodes[t]);
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", narrow && ay !== by
      ? `M${ax} ${ay} C${ax} ${my} ${bx} ${my} ${bx} ${by}`
      : `M${ax} ${ay} C${mx} ${ay} ${mx} ${by} ${bx} ${by}`);
    p.setAttribute("pathLength", "1");
    svg.append(p);
    paths[f + t] = p;
  });

  const els = {};
  Object.entries(nodes).forEach(([k, n]) => {
    const el = h("div", "fnode" + (n.trig ? " trig" : ""));
    el.style.left = n.x + "%";
    el.style.top = n.y + "%";
    const box = h("span", "fnode-box");
    box.append(icon(n.ic));
    const lab = h("span", "fnode-lab");
    lab.append(h("strong", null, n.t), h("span", null, n.s));
    el.append(box, lab);
    root.append(el);
    els[k] = el;
  });

  const labels = {};
  edges.forEach(([f, t, txt]) => {
    const A = nodes[f], B = nodes[t];
    const l = h("span", "flow-count", txt);
    l.style.left = (A.x + B.x) / 2 + "%";
    l.style.top = (A.y + B.y) / 2 + "%";
    root.append(l);
    labels[f + t] = l;
  });

  const dot = h("span", "flow-dot");
  const dot2 = h("span", "flow-dot");
  root.append(dot, dot2);

  // Entran los nodos y se dibujan las conexiones.
  Object.values(els).forEach((el, i) => c.fire(el, [{ opacity: 0, transform: "translate(-50%,-50%) scale(0.85)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1)" }], { duration: 420, delay: i * 90 }));
  edges.forEach(([f, t], i) => c.fire(paths[f + t], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 520, delay: 250 + i * 110, easing: EASE_IO }));
  await c.wait(1100);

  const run = async (k) => {
    els[k].classList.add("run");
    await c.wait(700);
    els[k].classList.remove("run");
    els[k].classList.add("ok");
    c.fire(els[k].querySelector(".fnode-box"), [{ transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 320, fill: "none" });
  };
  const hop = async (key, d) => {
    await c.travel(paths[key], d, 620);
    c.guard();
    c.fire(labels[key], [{ opacity: 0, transform: "translate(-50%,-50%) scale(0.8)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1)" }], { duration: 300 });
  };

  await run("a");
  await hop("ab", dot);
  await run("b");
  await hop("bc", dot);
  await run("c");
  await Promise.all([hop("cd", dot), hop("ce", dot2)]);
  await Promise.all([run("d"), run("e")]);

  const preview = h("div", "flow-msg");
  const bub = h("p", null, T.msg);
  preview.append(h("span", "flow-msg-h", T.sent), bub);
  root.append(preview);
  await c.enter(preview, { y: 12, dur: 460 });
}

/* ---------------- IA: un asistente que conoce tu negocio ---------------- */
async function sceneIa(root, c) {
  root.classList.add("sc-ia");
  const T = c.t.ia;
  const docs = h("div", "ia-docs");
  docs.append(h("p", "ia-label", T.label));
  const names = T.docs;
  const docEls = names.map((n) => {
    const d = h("span", "ia-doc");
    d.append(icon("i-doc"), h("span", null, n));
    docs.append(d);
    return d;
  });

  const panel = h("div", "ia-panel");
  const ph = h("div", "ia-head");
  const known = h("span", "ia-known", T.none);
  const cat = h("span", "ia-seal", "丸");
  const hw = h("div");
  hw.append(h("strong", null, T.title), known);
  ph.append(cat, hw);
  const chat = h("div", "ia-chat");
  panel.append(ph, chat);
  root.append(docs, panel);

  docEls.forEach((d, i) => c.fire(d, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 360, delay: i * 90 }));
  c.fire(panel, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 200 });
  await c.wait(700);

  // Cada documento "entra" al asistente.
  const target = cat.getBoundingClientRect();
  for (let i = 0; i < docEls.length; i++) {
    const d = docEls[i];
    const r = d.getBoundingClientRect();
    const ghost = d.cloneNode(true);
    ghost.classList.add("ghost");
    ghost.style.left = d.offsetLeft + "px";
    ghost.style.top = d.offsetTop + "px";
    ghost.style.width = r.width + "px";
    docs.append(ghost);
    const dx = target.left + target.width / 2 - (r.left + r.width / 2);
    const dy = target.top + target.height / 2 - (r.top + r.height / 2);
    c.fire(ghost, [{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0 }], { duration: 620, easing: EASE_IO, fill: "forwards" })
      .finished.then(() => ghost.remove()).catch(() => {});
    await c.wait(520);
    d.classList.add("read");
    known.textContent = T.knows(i + 1);
    c.fire(cat, [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 320, fill: "none" });
    await c.wait(120);
  }
  await c.wait(350);

  const q = h("div", "bub in", T.q);
  chat.append(q);
  await c.enter(q, { y: 10, s: 0.95, origin: "0% 100%" });
  await c.wait(400);

  const a = h("div", "bub out");
  chat.append(a);
  await c.enter(a, { y: 6, dur: 220, origin: "100% 100%" });
  const words = T.a.split(" ");
  for (const w of words) {
    const s = h("span", "w", w + " ");
    a.append(s);
    c.fire(s, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "backwards" });
    await c.wait(55);
  }
  await c.wait(250);
  const src = h("span", "ia-src");
  src.append(icon("i-doc"), h("span", null, T.src));
  chat.append(src);
  await c.enter(src, { y: 6, dur: 300 });
  docEls[2].classList.add("cited");
}

window.MaruScenes = {
  makeCtx,
  EASE,
  list: {
    whatsapp: sceneWhatsapp,
    citas: sceneCitas,
    excel: sceneExcel,
    reportes: sceneReportes,
    cobros: sceneCobros,
    ia: sceneIa,
  },
};
})();
