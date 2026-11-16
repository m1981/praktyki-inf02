// Pomiar „mieści się bez przewijania” dla ARP (każdy krok) i maski (każdy przykład).
import puppeteer from 'puppeteer-core';

const BASE = 'file:///Users/michal/PycharmProjects/praktyki-inf02/01-sieci/';
const OUT = process.argv[2];
const SIZES = [
 [1366, 768],
 [1280, 720]
];
const browser = await puppeteer.launch({
 executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const box = (sel) =>
 page.$eval(sel, (el) => {
  const r = el.getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
 });

const rows = [];
for (const [w, h] of SIZES) {
 await page.setViewport({ width: w, height: h });

 // ARP
 await page.goto(BASE + 'symulator-arp.html', { waitUntil: 'load' });
 await wait(600);
 for (let i = 0; i < 7; i++) {
  if (i > 0) {
   await page.keyboard.press('ArrowRight');
   await wait(400);
  }
  const canvas = await box('.sim-canvas');
  const text = await box('.sim-step p');
  const btn = await box('.sim-btn--primary');
  const scrollY = await page.evaluate(() => window.scrollY);
  const words = await page.$eval('.sim-step p', (el) => el.innerText.split(/\s+/).length);
  const maxBottom = Math.max(canvas.bottom, text.bottom, btn.bottom);
  rows.push({
   page: 'ARP',
   size: `${w}x${h}`,
   view: i === 0 ? 'Start' : `Krok ${i}`,
   canvasTop: canvas.top,
   lowest: maxBottom,
   fits: maxBottom <= h && canvas.top >= 0 && scrollY === 0,
   words
  });
  if (w === 1366 && [0, 4, 6].includes(i)) {
   await wait(1500);
   await page.screenshot({ path: `${OUT}-arp-${i}.png` });
  }
 }

 // Maska
 await page.goto('about:blank');
 await page.goto(BASE + 'symulator-maska.html#swobodny', { waitUntil: 'load' });
 await wait(600);
 const presets = await page.$$('.mk-preset');
 for (let i = 0; i < presets.length; i++) {
  await presets[i].click();
  await wait(400);
  const canvas = await box('.mk-diagram .sim-canvas');
  const lesson = await box('.mk-lesson');
  const controls = await page.$$eval(
   'button, input',
   (els) =>
    els.filter((e) => {
     const r = e.getBoundingClientRect();
     return e.checkVisibility() && r.width > 0 && r.bottom > 0 && r.top < innerHeight;
    }).length
  );
  rows.push({
   page: 'Maska',
   size: `${w}x${h}`,
   view: `Przykład ${i + 1}`,
   canvasTop: canvas.top,
   lowest: Math.max(canvas.bottom, lesson.bottom),
   fits: canvas.bottom <= h && lesson.top >= 0,
   visibleControls: controls
  });
  if (w === 1366 && [1, 2].includes(i)) {
   await wait(1500);
   await page.screenshot({ path: `${OUT}-maska-${i + 1}.png` });
  }
 }
}
console.table(rows);
console.log(errors.join('\n') || 'no page errors');
await browser.close();
