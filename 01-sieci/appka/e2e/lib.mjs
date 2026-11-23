// Wspólne narzędzia testów e2e: uruchomienie Chrome i przejście przez WSZYSTKIE stany stron
// (każdy krok ARP, każdy krok serii M1–M4, każdy przykład Trybu swobodnego).
// DLACZEGO JEDNA LISTA STANÓW: test „mieści się na ekranie” i zrzuty do porównania przed/po
// oglądają dokładnie te same ekrany – nie da się sprawdzić jednego, a pominąć drugiego.

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

/** Katalog ze stronami wynikowymi (01-sieci). */
export const SITE_DIR = fileURLToPath(new URL('../../', import.meta.url));

const CHROME_CANDIDATES = [
 process.env.CHROME_PATH,
 '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
 '/usr/bin/google-chrome',
 '/usr/bin/chromium',
 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].filter(Boolean);

export async function launch() {
 const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
 if (!executablePath) {
  throw new Error('Nie znaleziono Chrome. Ustaw zmienną CHROME_PATH na plik programu Chrome.');
 }
 return puppeteer.launch({ executablePath });
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Rozdzielczości z kryteriów akceptacji (audyt.md, rozdz. 7). */
export const DESKTOP = [
 { width: 1366, height: 768 },
 { width: 1280, height: 720 }
];
export const PHONE = { width: 390, height: 844 };

/**
 * Otwiera kartę z podaną rozdzielczością i zbiera błędy konsoli.
 * `reducedMotion` wyłącza animacje ramek – potrzebne do powtarzalnych zrzutów.
 */
export async function openTab(browser, viewport, { reducedMotion = false } = {}) {
 const page = await browser.newPage();
 await page.setViewport(viewport);
 if (reducedMotion) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
 }
 const errors = [];
 page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
 page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
 });
 return { page, errors };
}

async function goto(page, siteDir, file, hash = '') {
 // about:blank: sama zmiana #… nie przeładowuje strony, a każdy przebieg ma startować od zera.
 await page.goto('about:blank');
 await page.goto(pathToFileURL(siteDir + file).href + hash, { waitUntil: 'load' });
 await page.waitForSelector('#root .sim');
}

/**
 * Przechodzi przez wszystkie stany obu stron. Dla każdego woła `visit({ id, kind, page })`.
 * `kind`: 'arp' | 'seria' | 'swobodny' | 'swobodny-sterowanie'.
 * `settleMs` – czas na dokończenie przejść CSS po każdej zmianie.
 */
export async function walk(page, visit, { siteDir = SITE_DIR, settleMs = 400 } = {}) {
 // --- ARP: Start + kroki, strzałką → aż przycisk „Następny krok” zgaśnie ---
 await goto(page, siteDir, 'symulator-arp.html');
 for (let i = 0; ; i++) {
  await wait(settleMs);
  await visit({ id: `arp-${i}`, kind: 'arp', page });
  if (await page.$eval('.sim-btn--primary', (b) => b.disabled)) break;
  await page.keyboard.press('ArrowRight');
 }

 // --- Seria M1–M4: strzałką → aż adres zmieni się na #swobodny ---
 await goto(page, siteDir, 'symulator-maska.html', '#m1');
 for (;;) {
  await wait(settleMs);
  const where = await page.evaluate(() => ({
   hash: location.hash.slice(1),
   step: document.querySelector('.sim-badge')?.innerText.split(' ')[1]
  }));
  if (where.hash === 'swobodny') break;
  await visit({ id: `${where.hash}-${where.step}`, kind: 'seria', page });
  await page.keyboard.press('ArrowRight');
 }

 // --- Tryb swobodny: każdy gotowy przykład, potem rozwinięte sterowanie z maską /30 ---
 await goto(page, siteDir, 'symulator-maska.html', '#swobodny');
 const presets = await page.$$('.mk-preset');
 for (let i = 0; i < presets.length; i++) {
  await presets[i].click();
  await wait(settleMs);
  await visit({ id: `swobodny-p${i + 1}`, kind: 'swobodny', page });
 }
 await page.$eval('details.mk-free', (d) => (d.open = true));
 await page.$eval('#mk-prefix', (el) => {
  // React nasłuchuje „input”; wartość trzeba ustawić setterem prototypu, nie przez el.value.
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '30');
  el.dispatchEvent(new Event('input', { bubbles: true }));
 });
 await wait(settleMs);
 await visit({ id: 'swobodny-maska30', kind: 'swobodny-sterowanie', page });

 // --- Strony w stylu „rozmowa”: strzałką → aż do ostatniej kropki ostatniej sceny ---
 // Strony są nowsze niż wzorce „przed” ze starych commitów, więc tam ich po prostu nie ma.
 await walkDialog(page, visit, {
  siteDir,
  settleMs,
  file: 'symulator-routing.html',
  prefix: 'routing'
 });
 await walkDialog(page, visit, {
  siteDir,
  settleMs,
  file: 'symulator-arkusz.html',
  prefix: 'arkusz'
 });
}

/**
 * Przechodzi przez stronę w stylu „rozmowa”. W kroku z ćwiczeniem „uczeń sam” (klikanie kart,
 * odpowiedź do wyboru, tabela adresów) odwiedza jeszcze dwa stany: po złej odpowiedzi (`-blad`)
 * i po dobrej (`-dobrze`).
 */
async function walkDialog(page, visit, { siteDir, settleMs, file, prefix }) {
 if (!existsSync(siteDir + file)) return;
 await goto(page, siteDir, file);
 for (let guard = 0; guard < 200; guard++) {
  await wait(settleMs);
  const where = await page.evaluate(() => {
   const dots = [...document.querySelectorAll('.dl-dots i')];
   const tabs = [...document.querySelectorAll('.sr-tab')];
   const step = dots.filter((d) => d.classList.contains('on')).length;
   return {
    scene: tabs.findIndex((t) => t.getAttribute('aria-current') === 'step') + 1 || 1,
    step,
    // Ostatni krok ostatniej sceny: przycisk „dalej” wraca tam na początek, więc nie gaśnie.
    isEnd:
     step === dots.length &&
     (tabs.length === 0 || tabs.at(-1).getAttribute('aria-current') === 'step'),
    task: document.querySelector('[data-line]')
     ? 'linie'
     : document.querySelector('[data-tile]')
       ? 'tabela'
       : document.querySelector('[data-pick]')
         ? 'klik'
         : document.querySelector('.dl-quiz [data-ok]')
           ? 'wybor'
           : undefined
   };
  });
  const id = `${prefix}-${where.scene}-${String(where.step).padStart(2, '0')}`;
  await visit({ id, kind: 'rozmowa', page });
  if (where.task) {
   await page.evaluate(answerTask, where.task, false);
   await wait(settleMs);
   await visit({ id: `${id}-blad`, kind: 'rozmowa', page });
   await page.evaluate(answerTask, where.task, true);
   await wait(settleMs);
   await visit({ id: `${id}-dobrze`, kind: 'rozmowa', page });
  }
  if (where.isEnd) break;
  await page.keyboard.press('ArrowRight');
 }
}

/** W przeglądarce: zła albo dobra odpowiedź w ćwiczeniu „uczeń sam”. */
async function answerTask(task, right) {
 // Przerwa po kliknięciu: React musi narysować wybór, zanim przyjdzie następne kliknięcie.
 const click = async (el) => {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 30));
 };
 if (task === 'klik' || task === 'wybor') {
  const scope = task === 'klik' ? '[data-pick]' : '.dl-quiz [data-ok]';
  const all = [...document.querySelectorAll(scope)];
  if (right) for (const el of all.filter((e) => e.dataset.ok === '1')) await click(el);
  else await click(all.find((el) => el.dataset.ok === '0'));
  return;
 }
 // Linijki: zaznacz i „Sprawdź”. Zła odpowiedź = jedna linijka spoza odpowiedzi.
 if (task === 'linie') {
  const all = [...document.querySelectorAll('[data-line]')];
  for (const el of all.filter((e) => e.getAttribute('aria-pressed') === 'true')) await click(el);
  if (right) for (const el of all.filter((e) => e.dataset.ok === '1')) await click(el);
  else await click(all.find((e) => e.dataset.ok === '0'));
  await click(document.querySelector('[data-check]'));
  return;
 }
 // Tabela: linijka arkusza → pole tabeli. „automatycznie” wypełnia cały wiersz (pole adresu).
 const tiles = [...document.querySelectorAll('[data-tile]')].filter((t) => !t.disabled);
 const cellFor = (tile) => {
  const [card, field] = tile.dataset.tile.split(':');
  return `${card}:${field === 'auto' ? 'ip' : field}`;
 };
 if (!right) {
  const tile = tiles[0];
  const other = [...document.querySelectorAll('[data-cell]')].find(
   (c) => c.dataset.cell.split(':')[0] !== tile.dataset.tile.split(':')[0]
  );
  await click(tile);
  await click(other);
  return;
 }
 for (const tile of tiles) {
  await click(tile);
  await click(document.querySelector(`[data-cell="${cellFor(tile)}"]`));
 }
}
