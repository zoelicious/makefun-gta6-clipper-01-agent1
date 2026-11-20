import { copyFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// gta6-clipper-01 entry (agent 1): copies VIDEO.json to the output directory.
// VIDEO.json holds the public YouTube Shorts URL of the clip.
const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR;

if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const src = join(botDir, "VIDEO.json");
if (!existsSync(src)) {
  console.error(`VIDEO.json not found at ${src}`);
  process.exit(1);
}

const parsed = JSON.parse(readFileSync(src, "utf8"));
if (typeof parsed?.url !== "string" || parsed.url.length === 0) {
  console.error("VIDEO.json must contain a non-empty string field 'url'");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "VIDEO.json"));
console.log(`Copied VIDEO.json -> ${join(outDir, "VIDEO.json")} (url: ${parsed.url})`);
