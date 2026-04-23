# 📘 BLUEPRINT: Struktura Treści Edukacyjnych (Projekt INF.02)

## 1. Cel i Odbiorca (Target Audience)

- **Odbiorca:** Uczniowie technikum informatycznego (wiek 16-19 lat).
- **Poziom wiedzy:** Początkujący / Średniozaawansowany (znają podstawy obsługi komputera, ale nie rozumieją architektury korporacyjnej).
- **Cel główny:** Przygotowanie do zdania państwowego egzaminu zawodowego (INF.02) oraz zbudowanie praktycznych umiejętności inżynierskich (DevOps/SysOps mindset).
- **Ton narracji:** Profesjonalny, ale luźny (tzw. _Edutainment_). Język prosty, unikający akademickiego żargonu, nastawiony na praktykę. Trener występuje w roli mentora/starszego kolegi z branży.

## 2. Architektura Modułu (Struktura Katalogu)

Każdy duży temat (Filar) składa się z dwóch rodzajów plików:

1.  **Plik Teoretyczny (`index.html`):** Buduje kontekst biznesowy i architektoniczny. Odpowiada na pytanie _"Dlaczego to robimy?"_.
2.  **Pliki Laboratoryjne (`labX-temat.html`):** Instrukcje krok po kroku. Odpowiadają na pytanie _"Jak to zrobić i jak zdać egzamin?"_.

---

## 3. Szablon Pliku Teoretycznego (`index.html`)

### A. Nagłówek (Header)

- **Tytuł:** Jasny i opisowy (np. _Filar 2: Windows Server_).
- **Podtytuł:** Pytanie retoryczne lub problem z życia wzięty (np. _Jak działa sieć w naszej szkole?_).

### B. Karty Kroków (Step Cards)

Każde zagadnienie techniczne (np. Active Directory, GPO) jest przedstawione jako osobna karta (`<div class="card">`).

- **Tytuł:** Chwytliwy (np. _Koszmar informatyka_, _Władza Absolutna_).
- **Tag:** Krótka kategoria z emoji (np. `🛑 Restrykcje`, `🗂️ Struktura`).
- **Lista techniczna (`<ul>`):** 3-4 krótkie punkty wyjaśniające technologię w prostych słowach.
- **Analogia (Kluczowy element!):** Blok `<div class="analogy-box">`. Każda trudna technologia **musi** być wytłumaczona za pomocą analogii ze świata rzeczywistego (np. _Kontroler Domeny to bramkarz w klubie_, _GPO to regulamin szkolny_).

### C. Podsumowanie (Conclusion)

- Krótki akapit motywacyjny, łączący teorię z nadchodzącym egzaminem.

---

## 4. Szablon Pliku Laboratoryjnego (`labX-temat.html`)

### A. Nagłówek Laboratorium

- **Tytuł:** Kreatywny, łączący fabułę z technologią (np. _Lab 1: Narodziny Szefa (Kontroler Domeny)_).
- **Czas wykonania:** Realistyczna estymacja (np. _Czas: 45 min_).
- **Cel (Goal Box):** Jedno zdanie wyjaśniające, co uczeń osiągnie na końcu laba, wraz z odniesieniem do historycznych arkuszy egzaminacyjnych (np. _Z arkuszy: v1.1, v1.7_).

### B. Lista Zadań (Task List)

Instrukcje krok po kroku. Zamiast ścian tekstu, używamy specyficznych formatowań:

- **Ścieżki GUI:** Jeśli uczeń musi coś wyklikać, używamy bloku `<div class="gui-path">` ze strzałkami (np. _Narzędzia ➔ Zarządzanie zasadami grupy_).
- **Bloki CLI:** Jeśli uczeń musi wpisać komendę, używamy bloku `<div class="cli-block">` z komentarzami wyjaśniającymi, co robi dana komenda.

### C. Bloki Trenerskie (Kluczowy element dydaktyczny!)

Wplatane pomiędzy kroki instrukcji. Służą do budowania "inżynierskiego myślenia" i unikania frustracji.

1.  **Najczęstszy błąd (`<div class="pitfall-box">`):**
    - _Ikona:_ 🚨
    - _Treść:_ Opis typowego błędu, który popełniają uczniowie (np. _Próba podłączenia do domeny bez ustawienia DNS_).
2.  **Złota Rada Trenera (`<div class="golden-rule-box">`):**
    - _Ikona:_ 💡
    - _Treść:_ Wskazówka z "prawdziwego życia" IT lub sposób na szybkie rozwiązanie problemu (np. _Święta Trójca GPO: gpupdate, wyloguj, zaloguj_).

### D. Weryfikacja Egzaminacyjna (`<div class="exam-verify-box">`)

Zawsze na końcu laboratorium. Tłumaczy, jak uczeń musi udowodnić wykonanie zadania przed egzaminatorem.

- _Styl:_ Czerwona, przerywana ramka (przyciąga wzrok).
- _Warianty:_
    - **Zrzut ekranu:** Instrukcja, co dokładnie ma być na screenie i gdzie go zapisać (np. _stacja_testy.docx na pendrive_).
    - **Podniesienie ręki:** Instrukcja, co zostawić na ekranie przed wezwaniem egzaminatora.
    - **Papierowa tabela:** Przypomnienie o konieczności wpisania komendy długopisem do arkusza.

---

## 5. Wytyczne dla LLM (Prompting Instructions)

_Jeśli w przyszłości poprosisz AI o wygenerowanie nowego modułu, wklej ten Blueprint i dodaj poniższe polecenie:_

> **Prompt dla LLM:**
> "Działaj jako certyfikowany trener IT i ekspert Instructional Design. Wygeneruj moduł szkoleniowy dla tematu [WPISZ TEMAT, np. Routing i VLANy w Packet Tracer].
>
> 1. Stwórz plik `index.html` z teorią, używając silnych, życiowych analogii (zgodnie z Blueprintem).
> 2. Stwórz pliki `labX.html` z instrukcjami krok po kroku.
> 3. Obowiązkowo wpleć bloki `pitfall-box` (najczęstsze błędy uczniów) oraz `golden-rule-box` (wskazówki z branży).
> 4. Zakończ każde laboratorium blokiem `exam-verify-box`, wyjaśniającym, jak zadanie jest oceniane na egzaminie INF.02.
> 5. Używaj dostarczonych klas CSS i struktury HTML."
