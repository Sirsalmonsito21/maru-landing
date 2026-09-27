---
workflow: general-video
flow: automation
storyboard: no
---
# El segundo cerebro de Don Kuma (MARU)

TikTok 1080×1920, 60 fps, 39.5 s. Música: videos/musica segundo cerebro.mov → assets/musica.wav (fade 37–39.5).
Tiempos fijos del usuario (no ajustar): drop 18.30; golpes 20.10…36.10 cada 2 s.

- gancho (0–2.1): Montserrat Black rojo shu #C8452C sobre #0B0F1A.
- historia (2.1–18.3): pixel art Tokio (Kuma, post-its, chat con Maru, conexión 25/50/75/100 %).
- cerebro (18.3–34.1): Three.js 0.147 + bloom/bokeh/RGB shift; cerebro → regiones → onda/cita 97 % → circuito macro → notificaciones → idea → resumen → punto de luz.
- remate (34.1–36.1): oficina limpia, Kuma relajado con té, guiño.
- cierre (36.1–39.5): MARU, "¿Quieres tu segundo cerebro?", "Comenta CEREBRO ▼", asesoría gratis.

Build: `node build.mjs` (inyecta el motor pixel en src/*.src.html → compositions/).
