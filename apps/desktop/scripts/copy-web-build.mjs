import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "..", "..", "web", "dist");
const dest = path.join(__dirname, "..", "web-dist");

if (!existsSync(src)) {
  console.error("apps/web/dist not found — run `npm run build --workspace=@ge/web` first.");
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("Copied apps/web/dist into apps/desktop/web-dist");
