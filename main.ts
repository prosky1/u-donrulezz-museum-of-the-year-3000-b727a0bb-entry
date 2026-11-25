import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = "Group chat, c. 2025. A room where twelve people talked at once and one person did all the work.";

function fail(reason: string): never {
  throw new Error(`museum label rejected: ${reason}`);
}

function checkLabel(label: string): void {
  if (label.length < 1 || label.length > 200) {
    fail(`length ${label.length} outside 1-200`);
  }
  if (label.includes("\n") || label.includes("\r")) {
    fail("label must be a single line");
  }
  if (label.trim().length === 0) {
    fail("label is only whitespace");
  }
  if (label !== label.trim()) {
    fail("label must not start or end with whitespace");
  }
  for (let i = 0; i < label.length; i++) {
    const code = label.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) {
      fail(`character at ${i} is not printable ASCII`);
    }
  }
}

function main(): void {
  checkLabel(TEXT);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, TEXT, "utf8");
  const written = readFileSync(target, "utf8");
  if (written !== TEXT) {
    fail("entry.txt on disk does not match the label");
  }
}

main();
