// pnpm e2e:shots <katalog> [--ref <commit>]
// Zapisuje zrzut (PNG) i widoczny tekst (TXT) każdego stanu obu stron – materiał do porównania
// „przed refaktorem = po refaktorze” (zlecenie-refaktor.md). Animacje ramek są wyłączone
// (prefers-reduced-motion), żeby dwa przebiegi na tym samym kodzie dawały te same piksele.
//   bez --ref : strony z dysku (../symulator-*.html, po `pnpm build`)
//   --ref X   : strony z commita X (np. main) – wzorzec „przed”, bez przełączania gałęzi

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DESKTOP, launch, openTab, PHONE, SITE_DIR, walk } from './lib.mjs';

const args = process.argv.slice(2);
const refAt = args.indexOf('--ref');
const ref = refAt >= 0 ? args[refAt + 1] : undefined;
const outDir = args.find((a, i) => !a.startsWith('--') && (refAt < 0 || i !== refAt + 1));
if (!outDir || (refAt >= 0 && !ref)) {
 console.error('Użycie: pnpm e2e:shots <katalog> [--ref <commit>]');
 process.exit(2);
}

/** Wyciąga strony i wspólne pliki z commita do katalogu tymczasowego o tym samym układzie. */
function checkoutRef(gitRef) {
 const root = mkdtempSync(join(tmpdir(), 'symulatory-ref-'));
 mkdirSync(join(root, '01-sieci'));
 const files = [
  'common.css',
  'menu.js',
  '01-sieci/symulator-arp.html',
  '01-sieci/symulator-maska.html'
 ];
 for (const file of files) {
  const content = execFileSync('git', ['show', `${gitRef}:${file}`], {
   cwd: resolve(SITE_DIR, '..'),
   maxBuffer: 64 * 1024 * 1024
  });
  writeFileSync(join(root, file), content);
 }
 // Strony dodane później – starsze commity ich nie mają i to nie jest błąd.
 for (const file of ['01-sieci/symulator-routing.html', '01-sieci/symulator-arkusz.html']) {
  try {
   const content = execFileSync('git', ['show', `${gitRef}:${file}`], {
    cwd: resolve(SITE_DIR, '..'),
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore']
   });
   writeFileSync(join(root, file), content);
  } catch {
   // brak strony w tym commicie
  }
 }
 return join(root, '01-sieci') + '/';
}

const siteDir = ref ? checkoutRef(ref) : SITE_DIR;
const out = resolve(outDir);
mkdirSync(out, { recursive: true });

const browser = await launch();
let count = 0;
try {
 // Jedna rozdzielczość komputera i telefon: układ dwukolumnowy i jednokolumnowy.
 for (const viewport of [DESKTOP[0], PHONE]) {
  const { page } = await openTab(browser, viewport, { reducedMotion: true });
  await walk(
   page,
   async ({ id }) => {
    const name = `${viewport.width}-${id}`;
    await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
    const text = await page.evaluate(() => document.body.innerText);
    writeFileSync(join(out, `${name}.txt`), text);
    count++;
   },
   // Dłuższa pauza: przejścia kolorów (0,4 s) i błysk nowego wiersza (1,2 s) muszą się skończyć.
   { siteDir, settleMs: 1500 }
  );
  await page.close();
 }
} finally {
 await browser.close();
}
console.log(`✅ ${count} zrzutów (${ref ? `commit ${ref}` : 'strony z dysku'}) → ${out}`);
