// Arma las sub-composiciones: inyecta el motor pixel compartido en cada plantilla src/*.src.html → compositions/*.html
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const engine = readFileSync("src/pixel-engine.js", "utf8");
for (const f of readdirSync("src").filter((x) => x.endsWith(".src.html"))) {
  const out = readFileSync(`src/${f}`, "utf8").replace("/*__ENGINE__*/", engine);
  writeFileSync(`compositions/${f.replace(".src.html", ".html")}`, out);
  console.log("→ compositions/" + f.replace(".src.html", ".html"));
}
