import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/** Strony do zbudowania: `vite build --mode <strona>` → 01-sieci/symulator-<strona>.html */
const PAGES = ['arp', 'maska'] as const;
type Page = (typeof PAGES)[number];
const isPage = (mode: string): mode is Page => (PAGES as readonly string[]).includes(mode);

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));
// Katalog główny strony (tam leżą common.css i menu.js).
const SITE_ROOT = here('../../');
const SHARED_FILES = ['common.css', 'menu.js'];

/**
 * Dokłada wspólne pliki strony (style + nawigacja) jako zwykłe linki `../common.css`,
 * `../menu.js` – tak jak na każdej innej stronie filaru. order: 'post' = po bundlowaniu,
 * więc Vite NIE wciąga ich do paczki (zmiana w common.css działa bez przebudowy).
 * W `pnpm dev` serwuje te pliki z katalogu głównego repo.
 */
function siteShell(): Plugin {
 return {
  name: 'site-shell',
  transformIndexHtml: {
   order: 'post',
   handler: () => [
    {
     tag: 'link',
     attrs: { rel: 'stylesheet', href: '../common.css' },
     injectTo: 'head-prepend'
    },
    { tag: 'script', attrs: { src: '../menu.js' }, injectTo: 'body' }
   ]
  },
  configureServer(server) {
   server.middlewares.use((req, res, next) => {
    const file = SHARED_FILES.find((f) => req.url === `/${f}`);
    if (!file) return next();
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : 'text/javascript');
    createReadStream(SITE_ROOT + file).pipe(res);
   });
  }
 };
}

const BANNER =
 '<!-- PLIK GENEROWANY – nie edytuj ręcznie. Źródło: 01-sieci/appka, budowanie: pnpm build -->';

/** Po buildzie kopiuje dist/<strona>/<strona>.html do 01-sieci/symulator-<strona>.html. */
function publishPage(page: Page): Plugin {
 return {
  name: 'publish-page',
  apply: 'build',
  closeBundle() {
   const html = readFileSync(here(`dist/${page}/${page}.html`), 'utf8');
   const out = html.replace(/^<!doctype html>/i, (m) => `${m}\n${BANNER}`);
   writeFileSync(here(`../symulator-${page}.html`), out);
   console.log(`✅ 01-sieci/symulator-${page}.html (${Math.round(out.length / 1024)} KB)`);
  }
 };
}

// DLACZEGO JEDEN PLIK HTML NA STRONĘ (vite-plugin-singlefile): strona działa bez serwera –
// uczniowie otwierają ją z dysku (file://), gdzie przeglądarka blokuje osobne moduły JS.
// singlefile obsługuje jedno wejście, dlatego każdą stronę budujemy osobno (--mode).
export default defineConfig(({ command, mode }) => {
 if (command === 'build' && !isPage(mode)) {
  throw new Error(`Podaj stronę: vite build --mode ${PAGES.join('|')}`);
 }
 const page = isPage(mode) ? mode : undefined;
 return {
  base: './',
  plugins: [react(), viteSingleFile(), siteShell(), ...(page ? [publishPage(page)] : [])],
  build: page
   ? { outDir: `dist/${page}`, emptyOutDir: true, rollupOptions: { input: here(`${page}.html`) } }
   : undefined
 };
});
