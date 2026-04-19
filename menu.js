// Tutaj definiujesz wszystkie swoje linki. 
// Jak dodasz nowe ćwiczenie, dopisujesz tylko jedną linijkę TUTAJ!
const menuLinks = [
    { url: 'index.html', text: '📖 Teoria: Analogie' },
    { url: 'cwiczenia.html', text: '💻 Lab 1: Podstawy' },
    { url: 'cwiczenia2.html', text: '💻 Lab 2: VLANy' },
    { url: 'cwiczenia3.html', text: '💻 Lab 3: DHCP' },
    { url: 'cwiczenia4.html', text: '💻 Lab 4: DNS i NAT' }
];

// Funkcja budująca menu
function buildMenu() {
    // Pobierz nazwę aktualnego pliku (np. "cwiczenia2.html")
    let currentFile = window.location.pathname.split('/').pop();
    if (currentFile === '') currentFile = 'index.html'; // Domyślnie dla strony głównej

    let navHTML = '<nav class="main-nav">';

    // Generowanie przycisków
    menuLinks.forEach(link => {
        // Jeśli URL linku zgadza się z obecnym plikiem, dodaj klasę "active"
        let activeClass = (currentFile === link.url) ? 'active' : '';
        navHTML += `<a href="${link.url}" class="nav-btn ${activeClass}">${link.text}</a>`;
    });

    navHTML += '</nav>';

    // Wstawienie wygenerowanego menu do elementu o id "menu-container"
    document.getElementById('menu-container').innerHTML = navHTML;
}

// Uruchom funkcję po załadowaniu strony
document.addEventListener('DOMContentLoaded', buildMenu);
