# INF.02 - Baza Wiedzy

Kompletne materiały do egzaminu zawodowego **INF.02 - Administracja Systemami i Sieciami Komputerowymi**.

## 📁 Struktura Projektu

Pełna, zawsze aktualna mapa stron (wszystkie pliki HTML z nagłówkami h1–h3): **[KONSPEKT.md](KONSPEKT.md)**.

Konspekt generuje skrypt `scripts/konspekt.mjs`. Uruchamia się automatycznie w hooku pre-commit, a ręcznie: `pnpm konspekt`.

- `index.html`, `syllabus.html`, `setup.html`: strona główna, sylabus egzaminu, Dzień 0
- `01-sieci/` … `06-integracja/`: filary; w każdym `index.html` (teoria) + `labN-*.html` (laboratoria)
- `egzaminy/`: omówienia arkuszy CKE
- `common.css`, `menu.js`: wspólne style i nawigacja

## 🎨 Funkcje

### ✅ Zaimplementowane

- **Sticky Global Navigation**: Zawsze widoczny pasek nawigacji na górze
- **Breadcrumbs**: Automatyczne ścieżki nawigacyjne ("Strona Główna / Filar / Lab")
- **Previous/Next Navigation**: Przyciski na dole każdego laboratorium
- **Responsywny Design**: Działa na desktopie, tablecie i telefonie
- **Spójne Style**: Jeden plik CSS dla całego projektu
- **Schematyczne Topologie**: Wizualne drzewa sieci w Packet Tracer
- **Code Blocks**: Podświetlone bloki CLI z komentarzami

### 🚀 System Nawigacji

Plik `menu.js` automatycznie:

1. Wykrywa, czy jesteś w głównym katalogu czy podfolderze
2. Generuje sticky navbar z linkami do wszystkich filarów
3. Tworzy breadcrumbs pokazujące aktualną lokalizację
4. Dostosowuje ścieżki względne (`./` vs `../`)

## 🛠️ Jak używać

### Lokalne przeglądanie

1. Sklonuj repozytorium
2. Otwórz `index.html` w przeglądarce
3. Nawiguj między filarami i laboratoriami

### Publikacja na GitHub Pages

1. Push do repozytorium GitHub
2. Settings → Pages → Source: main branch / root
3. Twoja strona będzie dostępna pod: `https://username.github.io/repo-name/`

## 📝 Dodawanie nowej zawartości

### Nowe laboratorium

1. Skopiuj szablon istniejącego lab (np. `01-sieci/lab1-podstawy.html`)
2. Zmień tytuł w `<title>` (wykorzystywany w breadcrumbs)
3. Dodaj linki Previous/Next na dole:

```html
<div class="course-nav">
 <a href="lab1.html" class="course-btn">⬅️ Poprzedni: Lab 1</a>
 <a href="lab3.html" class="course-btn next">Następny: Lab 3 ➡️</a>
</div>

<script src="../menu.js"></script>
```

4. Upewnij się, że ścieżka CSS to `../common.css` (subfolder) lub `common.css` (root)

### Nowy filar

1. Utwórz folder (np. `07-chmura/`)
2. Dodaj `index.html` (teoria) z odpowiednimi stylami
3. Zaktualizuj `menu.js` - dodaj link w `nav-links`
4. Dodaj kafelek na stronie głównej (`index.html`)

## 🎓 Materiały egzaminacyjne

- **Sieci**: Cisco Packet Tracer (adresacja, VLANy, routing, DHCP/DNS/NAT)
- **Windows**: VirtualBox z Windows Server (AD, GPO, NTFS, udziały)
- **Linux**: Terminal (uprawnienia, dowiązania, archiwizacja)
- **Sprzęt**: Okablowanie strukturalne, diagnostyka SMART
- **Excel**: Formuły, formatowanie warunkowe, kosztorysy

## 📚 Źródła

- Podstawa Programowa INF.02
- Przykładowe arkusze egzaminacyjne
- Dokumentacja Cisco, Microsoft, Linux Foundation

## 📄 Licencja

Materiały edukacyjne dla uczniów przygotowujących się do egzaminu INF.02.

---

**Powodzenia na egzaminie! 🎉**
