// gta6-clipper-01 — entry for amber-puffin-51 (agent 1).
// "VICE CITY NEVER SLEEPS": a vertical GTA 6 clip cut from Rockstar's
// official trailers, with a make.fun pitch inside the clip itself.
// This program is the whole entrypoint: it hands VIDEO.json (the public
// YouTube Shorts address of the clip) to the grader's output directory.
//
// Run locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const src = join(BOT_DIR, "VIDEO.json");

let raw: string;
try {
  raw = readFileSync(src, "utf8");
} catch (err) {
  console.error(`VIDEO.json could not be read from ${src}: ${(err as Error).message}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  console.error("VIDEO.json must be a JSON object with a 'url' field.");
  process.exit(1);
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== "string" || url.length === 0) {
  console.error("VIDEO.json field 'url' must be a non-empty string.");
  process.exit(1);
}
if (!url.startsWith("https://")) {
  console.error("VIDEO.json field 'url' must start with 'https://'.");
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, join(OUTPUT_DIR, "VIDEO.json"));
console.log(`Copied VIDEO.json -> ${join(OUTPUT_DIR, "VIDEO.json")} (url: ${url})`);
