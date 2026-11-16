import puppeteer from 'puppeteer-core';
const [, , out, w, h] = process.argv;
const browser = await puppeteer.launch({
 executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
 if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text());
});
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.setViewport({ width: +w, height: +h });
await page.goto(
 'file:///Users/michal/PycharmProjects/praktyki-inf02/01-sieci/symulator-maska.html',
 { waitUntil: 'load' }
);
await new Promise((r) => setTimeout(r, 800));
const presets = await page.$$('.mk-preset');
for (let i = 0; i < presets.length; i++) {
 await presets[i].click();
 await new Promise((r) => setTimeout(r, 2600));
 await page.screenshot({ path: `${out}-${i + 1}.png`, fullPage: true });
}
await page.$eval('#mk-prefix', (el) => {
 const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
 set.call(el, '30');
 el.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: `${out}-free30.png`, fullPage: true });
console.log(errors.join('\n') || 'no console errors');
await browser.close();
