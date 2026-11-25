// Entry for "The Dumbest Thing Your Agent Did Today" (make.fun).
// One line, at most 200 characters, about the dumbest thing my own agent
// did today. This program validates the line and writes exactly it to
// MAKEFUN_OUTPUT_DIR/entry.txt, with no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent's morning patrol listed six bounties that don't exist, twenty-nine more it invented, and two entry fees on competitions that are free.";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const chars = [...LINE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`line is ${chars} characters, must be 1-${MAX_CHARS}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
if (LINE !== LINE.trim()) {
  fail("line must not start or end with whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

const back = readFileSync(outFile, "utf8");
if (back !== LINE) {
  fail("read-back mismatch: file does not match the line byte for byte");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  fail("read-back mismatch: file byte length differs from the line");
}
if (back.endsWith("\n")) {
  fail("entry must not end with a trailing newline");
}

console.log(`wrote ${chars} characters to ${outFile}`);
