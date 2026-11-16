// Zależności między warstwami idą tylko w dół (architektura.md, rozdz. 2):
// pages → content → engine / ui → net → model → lib.
// Test czyta importy w źródłach. Dzięki temu np. `net/` nie zacznie po cichu zależeć od ekranu,
// a `ui/` od treści konkretnej lekcji.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('.', import.meta.url));

/** Wyższy numer = wyższa warstwa. `engine` i `ui` są na jednym poziomie. */
const LEVEL: Record<string, number> = {
 lib: 0,
 model: 1,
 net: 2,
 engine: 3,
 ui: 3,
 content: 4,
 pages: 5
};

function sourceFiles(dir: string): string[] {
 return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === '__snapshots__' ? [] : sourceFiles(path);
  return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
 });
}

const layerOf = (path: string) => relative(SRC, path).split(/[\\/]/)[0];

describe('warstwy kodu', () => {
 const files = sourceFiles(SRC).filter((f) => layerOf(f) in LEVEL);

 it('każdy plik źródłowy leży w jednej z warstw', () => {
  expect(sourceFiles(SRC).filter((f) => !(layerOf(f) in LEVEL))).toEqual([]);
  expect(files.length).toBeGreaterThan(30);
 });

 it.each(files.map((f) => [relative(SRC, f), f]))('%s importuje tylko w dół', (_name, file) => {
  const from = layerOf(file);
  const imports = [...readFileSync(file, 'utf8').matchAll(/from '(\.[^']*)'/g)].map((m) => m[1]);
  const upward = imports
   .map((spec) => layerOf(resolve(dirname(file), spec)))
   .filter((to) => to in LEVEL && LEVEL[to] > LEVEL[from]);
  expect(upward).toEqual([]);
 });
});
