import puppeteer from 'puppeteer-core';
const [, , url, out, w = '1400', h = '1300'] = process.argv;
const browser = await puppeteer.launch({
 executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
 args: ['--allow-file-access-from-files']
});
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
 if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text());
});
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.setViewport({ width: +w, height: +h });
await page.goto(url, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 800));
for (let i = 0; i <= 5; i++) {
 if (i > 0) {
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, i === 4 || i === 5 ? 1900 : 900));
 }
 await page.screenshot({ path: `${out}-${i}.png`, fullPage: true });
}
// open questions
await page.$$eval('details', (ds) => ds.forEach((d) => (d.open = true)));
await page.screenshot({ path: `${out}-q.png`, fullPage: true });
console.log(errors.join('\n') || 'no console errors');
await browser.close();
