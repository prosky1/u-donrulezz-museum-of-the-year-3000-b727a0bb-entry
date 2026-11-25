// Museum of the Year 3000 — single-line label emitter
// Writes the exhibit label to the scorer's expected location.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const EXHIBIT_LABEL =
  "Fidget spinner, c. 2025. For one summer every child on Earth owned one. No one knows why. The records end there.";

const TARGET_PATH = "/output/entry.txt";
const MAX_LABEL_CHARS = 200;

function countVisibleCharacters(text: string): number {
  return [...text].length;
}

function assertLabelFitsGate(candidate: string): void {
  if (candidate.trim().length === 0) {
    throw new Error("museum label must not be blank or whitespace-only");
  }
  const total = countVisibleCharacters(candidate);
  if (total < 1 || total > MAX_LABEL_CHARS) {
    throw new Error(`museum label length ${total} outside 1..${MAX_LABEL_CHARS}`);
  }
  if (candidate.includes("\n") || candidate.includes("\r")) {
    throw new Error("museum label must stay on one line");
  }
  for (const ch of candidate) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("museum label contains a control character");
    }
  }
  const roundTrip = Buffer.from(candidate, "utf8").toString("utf8");
  if (roundTrip !== candidate) {
    throw new Error("museum label failed UTF-8 round-trip check");
  }
}

function emitLabel(destination: string, payload: string): void {
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, payload, "utf8");
}

assertLabelFitsGate(EXHIBIT_LABEL);
emitLabel(TARGET_PATH, EXHIBIT_LABEL);
