# Maru · Design system (v2, landing)

Registrado a partir de la versión construida (`index.html`, `styles.css`, `scenes.js`, `main.js`). La v1 queda en `.impeccable/backup-v1/`. El logo está pendiente de rediseño.

## Color
| Token | Valor | Uso |
|---|---|---|
| `--sumi` | #243140 | Texto, opción elegida, banda final, footer |
| `--sumi-2` | #2E3D4E | Hover de botones oscuros |
| `--sumi-3` | #1B2531 | Lienzo del flujo de nodos |
| `--sumi-soft` | #A9B6C2 | Texto secundario sobre Sumi |
| `--mandarina` | #F28A2E | CTA principal, lo activo, trazos y datos destacados |
| `--mandarina-deep` | #A4500F | Texto naranja sobre blanco (contraste AA) |
| `--mandarina-tint` | #FDEBD9 | Selección de texto, burbujas salientes, citas en agenda |
| `--shiro` | #F4F5F3 | Fondo base |
| `--paper` | #FFFFFF | Secciones alternas, paneles, barra del escenario |
| `--kori` | #E3E9EE | Sección de principios |
| `--muted` | #5B6875 | Texto de apoyo |
| `--line` / `--line-soft` | #D6DDE3 / #E8ECEF | Divisores de 1.5px / líneas internas de las escenas |

Estrategia: contenida. Neutros fríos, Sumi para los bloques de peso y un solo acento naranja para lo activo, la acción principal y el dato que importa en cada escena.

## Tipografía
- Display: **Zen Maru Gothic** en 700 y 900, tracking -0.02 a -0.03em. H1 `clamp(2.4rem, 4.4vw, 4rem)`; H2 de sección en 900, `clamp(2.2rem, 4.4vw, 3.6rem)`.
- Texto: **Figtree** 400 a 700, base 17px, interlineado 1.6. Cifras con `tabular-nums`.
- Japonés solo como firma: 丸くなる en vertical (`writing-mode: vertical-rl`) sobre la figura de Mandarina.

## Componentes
- **Botones:** píldora; `scale(.97)` al presionar; hover solo con puntero fino. `btn-ink`, `btn-orange`, tamaños `sm`/`lg`.
- **Opciones del hero:** radios nativos. En escritorio, lista tipo índice con divisores; la elegida se llena de Sumi desde su punto naranja (`clip-path: circle()`, 500ms) y muestra una flecha hacia el escenario. Bajo 1020px, píldoras; bajo 560px, fila deslizable. El `fieldset` lleva `min-inline-size: 0` (sin esto la fila desborda la página en móvil).
- **Escenario:** ventana blanca de 20px de radio con barra (herramienta + etiqueta "Ejemplo" + botón repetir). El fondo cambia por escena (chat #EEF0EB, flujo Sumi-3). Usa container queries (`stage`) para su versión angosta.
- **Salida del hero:** título + una frase + servicio, a la izquierda del CTA; se reescribe con crossfade.
- **Servicios:** índice editorial en filas (nombre / texto / "Ver ejemplo"). "Ver ejemplo" elige la opción y sube al escenario. Sin tarjetas.
- **Pasos:** números en círculo; el conector se llena de naranja al llegar al paso siguiente (horizontal en escritorio, vertical en móvil).
- **Principios:** `dl` en 2×2 con divisor superior, sin viñetas.
- **Cierre:** vista previa del mensaje de WhatsApp que se va a enviar, escrita en vivo con el tema elegido en el hero.

## Escenas del hero (`scenes.js`)
Cada opción tiene su propia demostración, todas marcadas como "Ejemplo" y sin clientes ni cifras reales:
- **WhatsApp:** llega una pregunta a las 23:14, el bot escribe, responde, el cliente toca "Sí, reservar" y se cierra con "Resuelto sin que tuvieras que contestar".
- **Citas:** las reservas caen en la semana, luego salen los recordatorios y cada cita se confirma.
- **Excel:** 15 datos desordenados vuelan a su celda (FLIP), los duplicados se disuelven, una pasada fila por fila limpia el formato y se arma el gráfico.
- **Reportes:** el KPI cuenta, la línea se dibuja y entra una venta nueva en vivo.
- **Cobros:** flujo de nodos (trigger → Sheets → condición → WhatsApp / Sheets) con un pulso que recorre las conexiones; en móvil pasa a dos filas.
- **IA:** los documentos entran al asistente y la respuesta cita su fuente.

## Movimiento
- Easing: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)` para entradas; `--ease-io cubic-bezier(0.77, 0, 0.175, 1)` para lo que se mueve en pantalla.
- Firma: cada clic en una opción dispara su escena (160ms de salida con blur, luego la coreografía). Cada escena corre una vez; se interrumpe limpiamente con `AbortController` si se elige otra.
- Retroalimentación: 100–300ms. Coreografías de escena hasta ~6s, siempre con el resultado visible al final.
- La gata de Mandarina "respira" en 4.2s.
- `prefers-reduced-motion`: las escenas corren con duración 0 y muestran directo su estado final; se quitan loops, parpadeos y movimientos.

## Logo
Símbolo SVG `#maru`: gata dormida, coloreable con `--m-ink`, `--m-halo` (igual al fondo) y `--m-accent`.
