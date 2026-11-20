// Katalog główny serwisu = katalog, w którym leży ten plik (działa z dysku i na GitHub Pages,
// na każdej głębokości katalogów). `currentScript` jest dostępny tylko przy pierwszym uruchomieniu.
const MENU_SCRIPT = document.currentScript;
const SITE_ROOT = new URL('.', MENU_SCRIPT ? MENU_SCRIPT.src : window.location.href);
// Strony z własnym wyglądem (laby w `01-sieci/laby-vlan/`) biorą tylko stopkę ćwiczeń, bez paska.
const ONLY_FOOTER = Boolean(MENU_SCRIPT && MENU_SCRIPT.hasAttribute('data-tylko-stopka'));

document.addEventListener('DOMContentLoaded', function () {
 exerciseFooter();
 if (ONLY_FOOTER) return;

 // 1. Wykrywanie głębokości
 const path = window.location.pathname;
 const isSubfolder =
  path.includes('/01-sieci/') ||
  path.includes('/02-windows/') ||
  path.includes('/03-linux/') ||
  path.includes('/04-sprzet/') ||
  path.includes('/05-excel/') ||
  path.includes('/06-integracja/');
 const prefix = isSubfolder ? '../' : './';

 // 2. Generowanie Globalnego Paska Nawigacji
 const navHTML = `
        <nav id="global-nav">
            <a href="${prefix}index.html" class="nav-brand">🏠 INF.02 Baza Wiedzy</a>
            <div class="nav-links">
                <a href="${prefix}setup.html">🛠️ Dzień 0</a>
                <a href="${prefix}topology.html">🗺️ Topologia</a>
                <a href="${prefix}01-sieci/index.html">🟢 Sieci</a>
                <a href="${prefix}02-windows/index.html">🪟 Windows</a>
                <a href="${prefix}03-linux/index.html">🐧 Linux</a>
                <a href="${prefix}04-sprzet/index.html">🔌 Sprzęt</a>
                <a href="${prefix}05-excel/index.html">📊 Excel</a>
                <a href="${prefix}06-integracja/index.html">🔗 Integracja</a>
            </div>
        </nav>
    `;
 document.body.insertAdjacentHTML('afterbegin', navHTML);

 // 3. Generowanie Okruszków (Breadcrumbs)
 if (isSubfolder && !path.endsWith('index.html')) {
  let pillarName = '';
  let pillarLink = '';

  if (path.includes('01-sieci')) {
   pillarName = '🟢 Filar 1: Sieci';
   pillarLink = 'index.html';
  }
  if (path.includes('02-windows')) {
   pillarName = '🪟 Filar 2: Windows';
   pillarLink = 'index.html';
  }
  if (path.includes('03-linux')) {
   pillarName = '🐧 Filar 3: Linux';
   pillarLink = 'index.html';
  }
  if (path.includes('04-sprzet')) {
   pillarName = '🔌 Filar 4: Sprzęt';
   pillarLink = 'index.html';
  }
  if (path.includes('05-excel')) {
   pillarName = '📊 Filar 5: Excel';
   pillarLink = 'index.html';
  }
  if (path.includes('06-integracja')) {
   pillarName = '🔗 Filar 6: Integracja';
   pillarLink = 'index.html';
  } // <-- DODANE

  const pageTitle = document.title;

  const breadcrumbsHTML = `
            <div id="breadcrumbs">
                <a href="${prefix}index.html">🏠 Strona Główna</a> / 
                <a href="${pillarLink}">${pillarName}</a> / 
                <span>${pageTitle}</span>
            </div>
        `;

  // Wstawiamy okruszki zaraz pod headerem
  const header = document.querySelector('header');
  if (header) {
   header.insertAdjacentHTML('afterend', breadcrumbsHTML);
  }
 }
});

// 4. Stopka ćwiczeń interaktywnych (PYT-084a): „◀ poprzednie · 🎮 wszystkie · następne ▶”.
// Lista i kolejność są w cwiczenia.js – jedynym miejscu, w którym się je dopisuje.
function exerciseFooter() {
 withExercises(function (data) {
  const here = decodeURI(window.location.pathname);
  const list = data.lista;
  const i = list.findIndex(function (e) {
   return here.endsWith('/' + e.plik);
  });
  if (i < 0) return;
  const url = function (path) {
   return new URL(path, SITE_ROOT).href;
  };
  const prev = list[i - 1];
  const next = list[i + 1];
  const link = function (e, cls, text) {
   return e ? `<a class="${cls}" href="${url(e.plik)}">${text}</a>` : '<span></span>';
  };
  const footer = `
        <nav class="cw-stopka" aria-label="Ćwiczenia interaktywne">
            ${link(prev, 'cw-poprzednie', prev ? `◀ ${prev.ikona} ${prev.nazwa}` : '')}
            <a class="cw-wszystkie" href="${url('cwiczenia.html')}">🎮 Wszystkie ćwiczenia</a>
            ${link(next, 'cw-nastepne', next ? `${next.ikona} ${next.nazwa} ▶` : '')}
        </nav>
    `;
  addFooterStyle();
  document.body.insertAdjacentHTML('beforeend', footer);
 });
}

/** Wczytuje cwiczenia.js (raz) i przekazuje listę. Strona zbiorcza ładuje ją sama. */
function withExercises(callback) {
 if (window.CWICZENIA) return callback(window.CWICZENIA);
 const script = document.createElement('script');
 script.src = new URL('cwiczenia.js', SITE_ROOT).href;
 script.onload = function () {
  if (window.CWICZENIA) callback(window.CWICZENIA);
 };
 document.head.appendChild(script);
}

/** Styl stopki jest tutaj, nie w common.css: laby VLAN nie wczytują common.css. */
function addFooterStyle() {
 if (document.getElementById('cw-stopka-styl')) return;
 const style = document.createElement('style');
 style.id = 'cw-stopka-styl';
 style.textContent = `
        .cw-stopka { display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; align-items: center;
            max-width: 1200px; margin: 28px auto 24px; padding: 14px 16px 0; box-sizing: border-box;
            border-top: 1px solid rgba(127, 127, 127, 0.3); font: 600 0.95rem/1.3 system-ui, sans-serif; }
        .cw-stopka a { color: inherit; text-decoration: none; padding: 8px 12px; border-radius: 8px;
            border: 1px solid rgba(127, 127, 127, 0.45); }
        .cw-stopka a:hover, .cw-stopka a:focus-visible { border-color: currentColor; }
        .cw-stopka .cw-wszystkie { text-align: center; }
        .cw-stopka .cw-poprzednie { justify-self: start; }
        .cw-stopka .cw-nastepne { justify-self: end; text-align: right; }
        @media (max-width: 700px) { .cw-stopka { grid-template-columns: 1fr; }
            .cw-stopka > * { justify-self: stretch !important; text-align: center !important; }
            .cw-stopka span { display: none; } }
    `;
 document.head.appendChild(style);
}
