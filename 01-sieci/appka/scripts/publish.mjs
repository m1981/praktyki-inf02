// Kopiuje zbudowaną stronę (dist/index.html) do 01-sieci/symulator-arp.html
// i dopisuje ostrzeżenie, że to plik generowany.
import { readFileSync, writeFileSync } from 'node:fs';

const src = new URL('../dist/index.html', import.meta.url);
const dest = new URL('../../symulator-arp.html', import.meta.url);

const BANNER =
 '<!-- PLIK GENEROWANY – nie edytuj ręcznie. Źródło: 01-sieci/appka, budowanie: pnpm build -->';

const html = readFileSync(src, 'utf8').replace(/^<!doctype html>/i, (m) => `${m}\n${BANNER}`);
writeFileSync(dest, html);
console.log(`✅ 01-sieci/symulator-arp.html (${Math.round(html.length / 1024)} KB)`);
