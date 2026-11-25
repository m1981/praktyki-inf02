// pnpm test:e2e – kryteria akceptacji z audyt.md (rozdz. 7), mierzone na zbudowanych stronach:
//   1–2. każdy krok mieści się bez przewijania w 1366×768 i 1280×720 (scena, tekst, przycisk),
//   8.   w kroku serii jest najwyżej jeden element sterujący (grupa przełącznika = 1),
//   15.  na telefonie 390×844 strona nie przewija się w poziomie,
//        brak błędów w konsoli.
// Uruchom po `pnpm build` (test ogląda pliki ../symulator-*.html). `--tabela` pokazuje pomiary.

import { DESKTOP, launch, openTab, PHONE, walk } from './lib.mjs';

const showTable = process.argv.includes('--tabela');

/** Pomiar jednego stanu – wykonywany w przeglądarce. */
function measure(kind) {
 const bottom = (el) => (el ? Math.round(el.getBoundingClientRect().bottom) : 0);
 const top = (el) => (el ? Math.round(el.getBoundingClientRect().top) : 0);
 const q = (s) => document.querySelector(s);
 const base = {
  scrollY: Math.round(window.scrollY),
  overflowX: document.documentElement.scrollWidth - window.innerWidth
 };

 if (kind === 'arp') {
  return {
   ...base,
   top: top(q('.sim-canvas')),
   lowest: Math.max(
    bottom(q('.sim-canvas')),
    bottom(q('.sim-step p')),
    bottom(q('.sim-btn--primary'))
   )
  };
 }
 if (kind === 'seria') {
  const controls = q('.sim-step .sim-controls');
  const buttons = [...controls.querySelectorAll('button, input')];
  const groups = controls.querySelectorAll('[role="group"]').length;
  const loose = buttons.filter((b) => !b.closest('[role="group"]')).length;
  return {
   ...base,
   top: top(q('.sr-question')),
   lowest: Math.max(
    bottom(q('.sim-stage--steps > :first-child')),
    bottom(q('.sim-step')),
    bottom(buttons.at(-1))
   ),
   // „Dalej: następne ćwiczenie” na ostatnim kroku to nawigacja, nie sterowanie ćwiczeniem.
   controls: groups + loose,
   isLastStep: Boolean(q('.sr-bridge'))
  };
 }
 if (kind === 'rozmowa') {
  // Scena i całe okno rozmowy (kwestia, zagadka, przyciski) widoczne bez przewijania.
  // Treść sceny nie może wystawać poza jej ramkę (np. wycinek arkusza w ćwiczeniu z tabelą).
  const board = q('.sim-stage--steps > :first-child');
  // Wnętrze okna z własnym przewijaniem (strona arkusza w warstwie 9, `data-scroll`) jest z założenia
  // dłuższe niż okno – liczy się samo okno, nie to, co w nim przewinięte niżej.
  const inner = Math.max(
   0,
   ...[...board.querySelectorAll('*')]
    .filter((el) => !el.parentElement?.closest('[data-scroll]'))
    .map(bottom)
  );
  return {
   ...base,
   top: top(q('.sim-stage--steps')),
   lowest: Math.max(bottom(board), bottom(q('.dl'))),
   outside: Math.max(0, inner - bottom(board))
  };
 }
 // Tryb swobodny: diagram i lekcja (albo podpowiedź) widoczne bez przewijania.
 return {
  ...base,
  top: top(q('.mk-lesson') ?? q('.sim-side')),
  lowest: Math.max(bottom(q('.mk-diagram .sim-canvas')), bottom(q('.mk-lesson')))
 };
}

const rows = [];
const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

const browser = await launch();
try {
 for (const viewport of DESKTOP) {
  const size = `${viewport.width}x${viewport.height}`;
  const { page, errors } = await openTab(browser, viewport);
  await walk(page, async ({ id, kind }) => {
   const m = await page.evaluate(measure, kind);
   rows.push({ ekran: size, stan: id, ...m });
   const where = `${size} ${id}`;
   // Rozwinięte sterowanie Trybu swobodnego jest z założenia dłuższe niż ekran (PYT-002a).
   if (kind !== 'swobodny-sterowanie') {
    if (m.lowest > viewport.height) fail(where, `dół ${m.lowest} px > ${viewport.height} px`);
    if (m.top < 0 || m.scrollY !== 0) fail(where, `strona przewinięta (scrollY ${m.scrollY})`);
   }
   if (m.outside > 0) fail(where, `treść sceny wystaje poza ramkę o ${m.outside} px`);
   if (kind === 'seria') {
    const allowed = m.isLastStep ? 2 : 1;
    if (m.controls > allowed)
     fail(where, `elementów sterujących: ${m.controls} (limit ${allowed})`);
   }
  });
  errors.forEach((e) => fail(size, e));
  await page.close();
 }

 const { page, errors } = await openTab(browser, PHONE);
 const size = `${PHONE.width}x${PHONE.height}`;
 await walk(page, async ({ id, kind }) => {
  const m = await page.evaluate(measure, kind);
  rows.push({ ekran: size, stan: id, overflowX: m.overflowX });
  if (m.overflowX > 0) fail(`${size} ${id}`, `przewijanie w poziomie: ${m.overflowX} px`);
 });
 errors.forEach((e) => fail(size, e));
 await page.close();
} finally {
 await browser.close();
}

if (showTable) console.table(rows);
if (failures.length > 0) {
 console.error(
  `❌ e2e: ${failures.length} błędów w ${rows.length} pomiarach\n` + failures.join('\n')
 );
 process.exit(1);
}
console.log(
 `✅ e2e: ${rows.length} pomiarów (ARP, seria M1–M4, Tryb swobodny, routing, arkusz) – wszystko mieści się na ekranie`
);
