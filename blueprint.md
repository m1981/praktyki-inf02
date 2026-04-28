# 📘 BLUEPRINT: Struktura Treści Edukacyjnych (Projekt INF.02)

## 1. Cel i Odbiorca (Target Audience)

- **Odbiorca:** Uczniowie technikum informatycznego (wiek 16-19 lat).
- **Poziom wiedzy:** Początkujący / Średniozaawansowany (znają podstawy obsługi komputera, ale nie rozumieją architektury korporacyjnej).
- **Cel główny:** Przygotowanie do zdania państwowego egzaminu zawodowego (INF.02) oraz zbudowanie praktycznych umiejętności inżynierskich (DevOps/SysOps mindset).
- **Ton narracji:** Profesjonalny, ale luźny (tzw. _Edutainment_). Język prosty, unikający akademickiego żargonu, nastawiony na praktykę. Trener występuje w roli mentora/starszego kolegi z branży.

## 2. Architektura Modułu (Struktura Katalogu)

Każdy duży temat (Filar) składa się z dwóch rodzajów plików:

1. **Plik Teoretyczny (`index.html`):** Buduje kontekst biznesowy i architektoniczny. Odpowiada na pytanie _"Dlaczego to robimy?"_.
2. **Pliki Laboratoryjne (`labX-temat.html`):** Instrukcje krok po kroku. Odpowiadają na pytanie _"Jak to zrobić i jak zdać egzamin?"_.

---

## 3. Konwencje Stylistyczne i Nawigacyjne (Globalne)

Każdy plik HTML musi bezwzględnie zawierać:

- **Style i Skrypty:** Podpięcie `<link rel="stylesheet" href="../common.css" />` w sekcji `<head>` oraz `<script src="../menu.js"></script>` na końcu `<body>`.
- **Zmienne Kolorystyczne (CSS Variables):** Definiowane w `<style>` w sekcji `<head>`. Każdy filar ma swój branding:
    - _Windows:_ Zielony (`#00b894`), Czerwony (`#d63031`), Niebieski (`#0984e3`).
    - _Linux:_ Pomarańczowy Ubuntu (`#E95420`), Fiolet Ubuntu (`#77216F`), Ciemny (`#2C001E`).
- **Nawigacja Dolna (`course-nav`):** Na samym dole każdego pliku muszą znajdować się przyciski "Poprzedni" i "Następny" ułatwiające przechodzenie przez kurs.

---

## 4. Szablon Pliku Teoretycznego (`index.html`)

### A. Nagłówek (Header)

- **Tytuł:** Jasny i opisowy (np. _Filar 2: Windows Server_).
- **Podtytuł:** Pytanie retoryczne lub problem z życia wzięty (np. _Jak działa sieć w naszej szkole?_).

### B. Karty Kroków (`<div class="card">`)

- **Tytuł i Tag:** Chwytliwy tytuł oraz tag z emoji (np. `<span class="tag">🛑 Restrykcje</span>`).
- **Lista techniczna (`<ul class="tech-list">`):** 3-4 krótkie punkty wyjaśniające technologię.
- **Analogia (`<div class="analogy-box">`):** Kluczowy element! Każda trudna technologia musi być wytłumaczona przez analogię (np. _Kontroler Domeny to bramkarz w klubie_).

### C. Sekret Inżyniera (`<div class="card">` ze specjalnym formatowaniem)

- Blok z ikoną 🕵️‍♂️. Wyjaśnia różnicę między tym, czego wymaga egzamin CKE (często przestarzałe metody), a tym, jak pracuje się w prawdziwej korporacji (np. _komendy `net` vs PowerShell_).

### D. Zakończenie

- **Podsumowanie (`<div class="conclusion-box">`):** Akapit motywacyjny łączący teorię z egzaminem.
- **Siatka Laboratoriów (`<div class="labs-grid">`):** Kafelki z linkami do poszczególnych plików `labX.html`.

---

## 5. Szablon Pliku Laboratoryjnego (`labX-temat.html`)

### A. Nagłówek i Cel

- **Tytuł i Czas:** Kreatywny tytuł i realistyczna estymacja (np. `<span class="time-badge">Czas: 45 min</span>`).
- **Cel (`<div class="goal-box">`):** Jedno zdanie wyjaśniające, co uczeń osiągnie na końcu laba.

### B. Wizualizacja (Opcjonalnie dla sieci)

- **Topologia (`<div class="topology">`):** Jeśli lab dotyczy sieci (np. Firewall, Routing), używamy wizualizacji z ikonami FontAwesome, aby pokazać przepływ ruchu między maszynami.

### C. Formatowanie Instrukcji (Task List)

- **Ścieżki GUI:** `<div class="gui-path">` ze strzałkami `<span class="gui-arrow">➔</span>` (np. _Narzędzia ➔ Zarządzanie zasadami grupy_).
- **Bloki CLI:** `<div class="cli-block">` z komentarzami `<span class="cli-comment">` wyjaśniającymi komendy.
- **Klawisze:** Używamy tagu `<kbd>` dla skrótów klawiszowych (np. `<kbd>TAB</kbd>`, `<kbd>Ctrl</kbd> + <kbd>C</kbd>`).

### D. Bloki Trenerskie (Kluczowy element dydaktyczny!)

Wplatane pomiędzy kroki instrukcji:

1. **Najczęstszy błąd (`<div class="pitfall-box">`):**
    - _Ikona:_ 🚨
    - _Treść:_ Opis typowego błędu uczniów (np. _Spacje w plikach YAML, brak flagi -aG_).
2. **Złota Rada Trenera (`<div class="golden-rule-box">`):**
    - _Ikona:_ 💡
    - _Treść:_ Wskazówka z "prawdziwego życia" IT (np. _Święta Trójca GPO, używanie flagi -h_).

### E. Referencje Egzaminacyjne (`<details class="exam-reference">`)

- Rozwijany blok (akordeon) wplatany w zadania.
- Zawiera dokładny miesiąc i rok egzaminu, link do PDF oraz cytat (`<blockquote>`) z oryginalną treścią zadania CKE. Buduje to zaufanie ucznia do materiału.

### F. Weryfikacja Egzaminacyjna (`<div class="exam-verify-box">`)

Zawsze na końcu laboratorium. Tłumaczy, jak uczeń musi udowodnić wykonanie zadania przed egzaminatorem.

- _Warianty:_
    - **📸 Zrzut ekranu:** Co dokładnie ma być na screenie i gdzie go zapisać.
    - **🙋‍♂️ Podniesienie ręki:** Co zostawić na ekranie przed wezwaniem egzaminatora.
    - **📝 Papierowa tabela:** Przypomnienie o wpisaniu komendy długopisem do arkusza.

---

## 6. Wytyczne dla LLM (Prompting Instructions)

_Jeśli w przyszłości poprosisz AI o wygenerowanie nowego modułu, wklej ten Blueprint i dodaj poniższe polecenie:_

> **Prompt dla LLM:**
> "Działaj jako certyfikowany trener IT, ekspert DevOps i specjalista Instructional Design. Wygeneruj moduł szkoleniowy dla tematu [WPISZ TEMAT, np. Routing i VLANy w Packet Tracer].
>
> 1. Stosuj się rygorystycznie do dostarczonego pliku `blueprint.md`.
> 2. Wygeneruj plik `index.html` z teorią, używając silnych, życiowych analogii oraz bloku 'Sekret Inżyniera'.
> 3. Wygeneruj pliki `labX.html` z instrukcjami krok po kroku.
> 4. Zdefiniuj lokalne zmienne CSS (`:root`) w sekcji `<head>` dopasowane kolorystycznie do tematu.
> 5. Obowiązkowo wpleć bloki `pitfall-box` (najczęstsze błędy), `golden-rule-box` (wskazówki z branży) oraz `exam-reference` (cytaty z arkuszy CKE).
> 6. Używaj tagów `<kbd>` dla klawiszy, `<div class="gui-path">` dla klikania i `<div class="cli-block">` dla terminala.
> 7. Zakończ każde laboratorium blokiem `exam-verify-box`, wyjaśniającym, jak zadanie jest oceniane na egzaminie INF.02.
> 8. Pamiętaj o dolnej nawigacji `<div class="course-nav">`."
