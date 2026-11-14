import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Katalog główny strony (tam leżą common.css i menu.js).
const SITE_ROOT = fileURLToPath(new URL('../../', import.meta.url));
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

// DLACZEGO JEDEN PLIK HTML (vite-plugin-singlefile): strona działa bez serwera – uczniowie
// otwierają ją z dysku (file://), gdzie przeglądarka blokuje osobne moduły JS. Jeden plik
// z wbudowanym JS i CSS działa tak samo z dysku i na GitHub Pages.
export default defineConfig({
 base: './',
 plugins: [react(), viteSingleFile(), siteShell()],
 build: { outDir: 'dist', emptyOutDir: true }
});
