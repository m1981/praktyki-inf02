// Kryterium końca etapu A (zlecenie-refaktor.md): adresy IP i MAC są wpisane tylko w `model/`.
// Test czyta źródła (bez komentarzy) i szuka literałów. Wyjątki: `model/` (źródło prawdy), pliki testów
// (przykłady do obliczeń) i adres Broadcast w `net/frame.ts` (stała protokołu, nie dana sieci).

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BROADCAST_MAC } from './net/frame';

const SRC = fileURLToPath(new URL('.', import.meta.url));
// Pełny adres IPv4 albo jego trzy pierwsze liczby („numer sieci” 10.10.10).
const IP = /\b\d{1,3}(?:\.\d{1,3}){2,3}\b/g;
const MAC = /\b[0-9A-F]{2}(?::[0-9A-F]{2}){5}\b/gi;

function sourceFiles(dir: string): string[] {
 return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === '__snapshots__' ? [] : sourceFiles(path);
  return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.test.ts') ? [path] : [];
 });
}

describe('adresy tylko w model/', () => {
 const files = sourceFiles(SRC).filter((f) => !relative(SRC, f).startsWith('model'));

 it('sprawdza wszystkie warstwy kodu', () => {
  expect(files.length).toBeGreaterThan(15);
 });

 it.each(files.map((f) => [relative(SRC, f), f]))('%s – bez literałów IP i MAC', (_name, file) => {
  // Komentarze pomijamy: przykład „/25 → 255.255.255.128” w opisie funkcji to nie dana sieci.
  const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const found = [...(text.match(IP) ?? []), ...(text.match(MAC) ?? [])].filter(
   (literal) => literal !== BROADCAST_MAC
  );
  expect(found).toEqual([]);
 });
});
