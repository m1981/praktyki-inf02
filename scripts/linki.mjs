// Strażnik linków (PYT-084a). Zatrzymuje commit, gdy:
//   1. link na stronie prowadzi do pliku, którego nie ma w repozytorium,
//   2. do strony HTML nie prowadzi żaden link (strona-sierota),
//   3. pozycja listy ćwiczeń (cwiczenia.js) wskazuje plik, którego nie ma.
// Źródła linków: strony HTML, pasek menu (menu.js) i lista ćwiczeń (cwiczenia.js).
// Uruchamiane przez hook pre-commit oraz ręcznie: pnpm linki
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// appka = źródła symulatorów; ich strony wynikowe (01-sieci/symulator-*.html) są sprawdzane.
const SKIP_DIRS = new Set(['appka']);
// Strony, do których z założenia nic nie prowadzi.
const NO_INCOMING_OK = new Set(['index.html']);

// DLACZEGO GIT, A NIE DYSK: tak jak KONSPEKT.md – liczy się to, co trafi do repozytorium.
// Robocze pliki spoza gita nie są ani źródłem, ani celem linku.
function tracked(pattern) {
 return execFileSync('git', ['ls-files', '--cached', '-z', '--', pattern], {
  cwd: ROOT,
  encoding: 'utf8'
 })
  .split('\0')
  .filter(Boolean)
  .filter((f) => !f.split('/').some((part) => SKIP_DIRS.has(part)))
  .filter((f) => existsSync(join(ROOT, f)));
}

const files = new Set(tracked('*'));
const pages = tracked('*.html');

/** Linki `href` w HTML – bez skryptów, stylów i komentarzy (w paczkach JS są napisy podobne do linków). */
function hrefs(html) {
 const body = html.replace(
  /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,
  ''
 );
 return [...body.matchAll(/\bhref\s*=\s*"([^"]*)"/gi)].map((m) => m[1]);
}

/** Ścieżka od katalogu głównego albo null dla linków zewnętrznych i kotwic. */
function resolve(from, href) {
 const path = decodeURI(href.split('#')[0].split('?')[0]);
 if (!path || /^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//')) return null;
 return posix.normalize(posix.join(posix.dirname(from), path));
}

const problems = [];
const incoming = new Map(pages.map((p) => [p, 0]));
const count = (target) => incoming.has(target) && incoming.set(target, incoming.get(target) + 1);

for (const page of pages) {
 for (const href of hrefs(readFileSync(join(ROOT, page), 'utf8'))) {
  const target = resolve(page, href);
  if (target === null) continue;
  const file = target.endsWith('/') || target === '.' ? posix.join(target, 'index.html') : target;
  if (!files.has(file)) problems.push(`zepsuty link: ${page} → ${href}`);
  else if (file !== page) count(file);
 }
}

// Pasek menu: `${prefix}01-sieci/index.html` itd. – ścieżki od katalogu głównego.
for (const m of readFileSync(join(ROOT, 'menu.js'), 'utf8').matchAll(
 /\$\{prefix\}([\w./-]+\.html)/g
)) {
 if (!files.has(m[1])) problems.push(`zepsuty link w menu.js: ${m[1]}`);
 count(m[1]);
}

// Lista ćwiczeń: strona zbiorcza i stopki „poprzednie / następne”.
const list = readFileSync(join(ROOT, 'cwiczenia.js'), 'utf8');
for (const m of list.matchAll(/plik:\s*'([^']+)'/g)) {
 if (!files.has(m[1])) problems.push(`cwiczenia.js: brak pliku ${m[1]}`);
 count(m[1]);
}

for (const [page, n] of incoming) {
 if (n === 0 && !NO_INCOMING_OK.has(page))
  problems.push(`strona-sierota (nic do niej nie prowadzi): ${page}`);
}

if (problems.length > 0) {
 console.error(
  `❌ linki: ${problems.length} problemów\n` + problems.map((p) => `   ${p}`).join('\n')
 );
 process.exit(1);
}
console.log(`🔗 linki: ${pages.length} stron, wszystkie linki działają, sierot brak`);
