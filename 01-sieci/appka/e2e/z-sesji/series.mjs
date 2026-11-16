// Seria M1–M4: każdy krok – czy pytanie, wizualizacja, tekst i przycisk mieszczą się bez przewijania.
import puppeteer from 'puppeteer-core';

const URL = 'file:///Users/michal/PycharmProjects/praktyki-inf02/01-sieci/symulator-maska.html#m1';
const OUT = process.argv[2];
const browser = await puppeteer.launch({
 executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = [];
for (const [w, h] of [
 [1366, 768],
 [1280, 720],
 [390, 844]
]) {
 await page.setViewport({ width: w, height: h });
 await page.goto('about:blank');
 await page.goto(URL, { waitUntil: 'load' });
 await wait(600);
 for (let k = 0; k < 9; k++) {
  const m = await page.evaluate(() => {
   const r = (s) => document.querySelector(s)?.getBoundingClientRect();
   const vis = document.querySelector('.sim-stage--steps > :first-child').getBoundingClientRect();
   const btn = [...document.querySelectorAll('.sim-step .sim-controls button')]
    .at(-1)
    ?.getBoundingClientRect();
   const text = r('.sim-step');
   const controls = [...document.querySelectorAll('.sim-step .sim-controls button')].length;
   return {
    hash: location.hash,
    badge: document.querySelector('.sim-badge')?.innerText,
    q: Math.round(r('.sr-question').top),
    visBottom: Math.round(vis.bottom),
    textBottom: Math.round(text.bottom),
    btnBottom: Math.round(btn?.bottom ?? 0),
    controls,
    scrollY: window.scrollY
   };
  });
  const lowest = Math.max(m.visBottom, m.textBottom, m.btnBottom);
  rows.push({ size: `${w}x${h}`, ...m, lowest, fits: lowest <= h && m.scrollY === 0 });
  if (w !== 1280) {
   await wait(2600);
   await page.screenshot({
    path: `${OUT}-${w}-${m.hash.slice(1)}-${m.badge?.split(' ')[1]}.png`,
    fullPage: w === 390
   });
  }
  await page.keyboard.press('ArrowRight');
  await wait(400);
 }
}
console.table(rows);
console.log(errors.join('\n') || 'no page errors');
await browser.close();
