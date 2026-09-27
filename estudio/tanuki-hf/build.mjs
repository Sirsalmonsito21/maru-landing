// Inyecta el motor pixel (Maru) + Tanuki en las plantillas src/*.src.html → compositions/*.html
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
const engine = readFileSync("src/pixel-engine.js", "utf8") + "\n" + readFileSync("src/tanuki-pixel.js", "utf8");
mkdirSync("compositions", { recursive: true });
for (const f of readdirSync("src").filter((x) => x.endsWith(".src.html"))) {
  writeFileSync(`compositions/${f.replace(".src.html", ".html")}`, readFileSync(`src/${f}`, "utf8").replace("/*__ENGINE__*/", engine));
  console.log("→ compositions/" + f.replace(".src.html", ".html"));
}
