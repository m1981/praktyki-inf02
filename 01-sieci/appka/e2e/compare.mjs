// pnpm e2e:compare <katalog-przed> <katalog-po>
// Porównuje zrzuty i teksty z `pnpm e2e:shots`. Refaktor przechodzi, gdy:
//   – tekst każdego stanu jest identyczny co do znaku,
//   – obraz różni się najwyżej w 0,1% pikseli (zlecenie-refaktor.md).

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const [before, after] = process.argv.slice(2);
if (!before || !after) {
 console.error('Użycie: pnpm e2e:compare <katalog-przed> <katalog-po>');
 process.exit(2);
}

const MAX_DIFF_RATIO = 0.001;
const names = (dir, ext) =>
 readdirSync(dir)
  .filter((f) => f.endsWith(ext))
  .sort();
const failures = [];
let worst = 0;

const beforePngs = names(before, '.png');
const afterPngs = names(after, '.png');
if (beforePngs.join() !== afterPngs.join()) {
 failures.push(`inna lista stanów: przed ${beforePngs.length}, po ${afterPngs.length}`);
}

for (const file of beforePngs.filter((f) => afterPngs.includes(f))) {
 const a = PNG.sync.read(readFileSync(join(before, file)));
 const b = PNG.sync.read(readFileSync(join(after, file)));
 if (a.width !== b.width || a.height !== b.height) {
  failures.push(`${file}: rozmiar ${a.width}×${a.height} → ${b.width}×${b.height}`);
 } else {
  const diff = pixelmatch(a.data, b.data, undefined, a.width, a.height, { threshold: 0.1 });
  const ratio = diff / (a.width * a.height);
  worst = Math.max(worst, ratio);
  if (ratio > MAX_DIFF_RATIO) {
   failures.push(`${file}: ${diff} różnych pikseli (${(ratio * 100).toFixed(3)}%)`);
  }
 }

 const txt = file.replace(/\.png$/, '.txt');
 if (readFileSync(join(before, txt), 'utf8') !== readFileSync(join(after, txt), 'utf8')) {
  failures.push(`${txt}: tekst na ekranie się zmienił`);
 }
}

if (failures.length > 0) {
 console.error(`❌ porównanie: ${failures.length} różnic\n` + failures.join('\n'));
 process.exit(1);
}
console.log(
 `✅ ${beforePngs.length} stanów: tekst identyczny, największa różnica obrazu ${(worst * 100).toFixed(4)}% pikseli`
);
