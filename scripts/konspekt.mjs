// Generuje KONSPEKT.md: mapę wszystkich plików HTML z ich nagłówkami h1-h3.
// Uruchamiane przez hook pre-commit oraz ręcznie: pnpm konspekt
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'KONSPEKT.md');
const SKIP_DIRS = new Set(['node_modules', '.git', '.idea', '.husky', 'scripts']);

function findHtml(dir) {
 return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : findHtml(join(dir, e.name));
  return e.name.endsWith('.html') ? [join(dir, e.name)] : [];
 });
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

const files = findHtml(ROOT)
 .map((f) => relative(ROOT, f).split('\\').join('/'))
 .sort();

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
 // Wcięcie wg poziomu, ale najwyżej o jeden poziom głębiej niż poprzedni nagłówek (np. h1 -> h3)
 let prevDepth = -1;
 for (const { level, text } of headings) {
  const depth = Math.min(level - 1, prevDepth + 1);
  lines.push(`${'  '.repeat(depth)}- **H${level}** ${text}`);
  prevDepth = depth;
 }
 lines.push('');
}

writeFileSync(OUT, lines.join('\n'));
console.log(`📑 KONSPEKT.md: ${files.length} plików HTML`);
