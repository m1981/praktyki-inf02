// Generuje KONSPEKT.md: mapę wszystkich plików HTML z ich nagłówkami h1-h3.
// Uruchamiane przez hook pre-commit oraz ręcznie: pnpm konspekt
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'KONSPEKT.md');
// appka = źródła symulatora (React); do konspektu trafia gotowa strona 01-sieci/symulator-arp.html
const SKIP_DIRS = new Set(['appka']);

// DLACZEGO GIT, A NIE DYSK: konspekt ma opisywać repozytorium. Robocze, niezacommitowane pliki
// HTML nie mogą trafić do KONSPEKT.md jako martwe linki. --cached = także pliki już dodane
// (git add), bo hook pre-commit uruchamia skrypt przed zapisaniem commita. -z = bezpieczne
// polskie znaki w nazwach (bez cytowania ścieżek przez gita).
function trackedHtml() {
 return execFileSync('git', ['ls-files', '--cached', '-z', '--', '*.html'], {
  cwd: ROOT,
  encoding: 'utf8'
 })
  .split('\0')
  .filter(Boolean)
  .filter((f) => !f.split('/').some((part) => SKIP_DIRS.has(part)))
  .filter((f) => existsSync(join(ROOT, f))); // usunięty z dysku, ale jeszcze nie z indeksu
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

function cleanText(html) {
 return html
  .replace(/<[^>]+>/g, '')
  .replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m)
  .replace(/\s+/g, ' ')
  .trim();
}

function outline(html) {
 const body = html.replace(
  /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,
  ''
 );
 const title = body.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
 const headings = [...body.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
  level: Number(m[1]),
  text: cleanText(m[2])
 }));
 return { title: title ? cleanText(title[1]) : null, headings };
}

const files = trackedHtml().sort();

const lines = [
 '# Konspekt plików HTML (nagłówki h1–h3)',
 '',
 '> Plik generowany automatycznie przez `scripts/konspekt.mjs` (hook pre-commit). Nie edytuj ręcznie.',
 ''
];

for (const file of files) {
 const { title, headings } = outline(readFileSync(join(ROOT, file), 'utf8'));
 lines.push(`## [\`${file}\`](${file})`, '');
 if (title) lines.push(`_title: ${title}_`, '');
 if (!headings.length) lines.push('- (brak nagłówków h1–h3)');
 // Wcięcie = liczba nadrzędnych nagłówków (h1 -> h3 bez h2 daje jeden poziom, a nie dwa)
 const ancestors = [];
 for (const { level, text } of headings) {
  while (ancestors.length && ancestors.at(-1) >= level) ancestors.pop();
  lines.push(`${'  '.repeat(ancestors.length)}- **H${level}** ${text}`);
  ancestors.push(level);
 }
 lines.push('');
}

writeFileSync(OUT, lines.join('\n'));
console.log(`📑 KONSPEKT.md: ${files.length} plików HTML`);
