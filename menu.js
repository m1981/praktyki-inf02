document.addEventListener('DOMContentLoaded', function () {
    // 1. Wykrywanie głębokości (czy jesteśmy w głównym folderze, czy w podfolderze np. 02-windows)
    const path = window.location.pathname;
    const isSubfolder =
        path.includes('/01-sieci/') ||
        path.includes('/02-windows/') ||
        path.includes('/03-linux/') ||
        path.includes('/04-sprzet/') ||
        path.includes('/05-excel/');
    const prefix = isSubfolder ? '../' : './';

    // 2. Generowanie Globalnego Paska Nawigacji (Top Navbar)
    const navHTML = `
        <nav id="global-nav">
            <a href="${prefix}index.html" class="nav-brand">🏠 INF.02 Baza Wiedzy</a>
            <div class="nav-links">
                <a href="${prefix}setup.html">🛠️ Dzień 0</a>
                <a href="${prefix}01-sieci/index.html">🟢 Sieci</a>
                <a href="${prefix}02-windows/index.html">🪟 Windows</a>
                <a href="${prefix}03-linux/index.html">🐧 Linux</a>
                <a href="${prefix}04-sprzet/index.html">🔌 Sprzęt</a>
                <a href="${prefix}05-excel/index.html">📊 Excel</a>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // 3. Generowanie Okruszków (Breadcrumbs) - tylko dla laboratoriów
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

        const pageTitle = document.title; // Pobiera tytuł z tagu <title>

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
