# Zlecenie: „Arkusz krok po kroku”, etapy 1–2 (dla nowej sesji)

Status: do wykonania · 2026-11-20 · decyzje: PYT-073 (ścieżka), PYT-074a (scenariusz przyjęty).

Ten plik to kompletny brief. Wykonawca nie zna wcześniejszej rozmowy – wszystko, czego potrzebuje,
jest tu i w plikach, które wskazuje.

## Po co to robimy

Uczniowie (16 lat, przygotowanie do INF.02) radzą sobie z Windows i Linuksem, a wykładają się na
sieciach. Ich słowa: mają kłopot z „suchym tekstem” arkusza, „nie widzą tego jeszcze w głowach
i robią na czuja”. Budujemy ścieżkę sześciu etapów, która zamienia arkusz egzaminacyjny w obrazek,
tabelę i kolejność kroków. To zlecenie obejmuje **etapy 1 i 2**.

## Przeczytaj w tej kolejności

1. `01-sieci/appka/kontrakt.md` – zasady pracy z operatorem (meldunek, pytania, granice). Obowiązuje.
2. `01-sieci/appka/rejestr-pytan.md` – wystarczy przegląd i wpisy od PYT-053 do końca.
3. `01-sieci/appka/mapa-nauki-sieci.md`, sekcja „Ścieżka przyjęta” – cały plan i jego uzasadnienie.
4. `01-sieci/appka/scenariusz-arkusz-1-2.md` – **zatwierdzona treść etapów 1–2** (kwestie, stany
   schematu, ćwiczenia, reakcje na błąd).
5. `01-sieci/appka/README.md` – warstwy kodu, budowanie, testy.
6. Wzór wykonania: `src/content/routing.ts`, `src/ui/views/PostView.tsx`, `src/ui/DialogStep.tsx`,
   `src/ui/controls/TalkControl.tsx`, `src/ui/dialog.css` – tak powstała strona „List za płot”.

## Stan repozytorium w chwili przekazania

- Gałąź `main`. `origin/main` = `99f8df9`. Lokalnie jest jeden niewypchnięty commit roboczy
  `e414f6f` (mapa).
- Na dysku, bez commita: `mapa-nauki-sieci.md` (zmieniona), `rejestr-pytan.md` (zmieniony),
  `scenariusz-arkusz-1-2.md` (nowy), `zlecenie-arkusz.md` (nowy). To celowe pliki tej pracy.
  Commit i push wymagają zgody operatora (kontrakt, rozdz. 3).
- Pliki operatora, których nie wolno ruszać ani dodawać do commita: `01-sieci/appka/przyklad.md`,
  katalog `egzaminy/`, pliki spoza gita w katalogu głównym i w `01-sieci/`.
- Dwa pliki `egzaminy/*zasady-oceniania.pdf` są w gicie, ale nie ma ich na dysku. To nie nasza zmiana.
- Stan sprawdzeń przed przekazaniem: 427/427 testów, e2e 150 pomiarów zielone (`pnpm build`).

## Co ma powstać

Nowa strona `01-sieci/symulator-arkusz.html` („Arkusz krok po kroku”) na istniejącym silniku, z dwiema
zakładkami: etap 1 „Koloruję sieci” i etap 2 „Z arkusza do tabeli adresów”. Każdy etap to scena
w stylu „rozmowa” (Ola i Kuba), a po niej ćwiczenie, które uczeń robi sam.

| Element                    | Skąd                                | Uwagi                                                                                      |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| Kwestie i stany schematu   | `scenariusz-arkusz-1-2.md`          | Przepisać co do słowa. Zmiana kwestii = najpierw zmiana w scenariuszu, za zgodą operatora. |
| Styl „rozmowa”             | już jest w silniku                  | `style: 'dialog'`, kontrolki `talk` i `quiz`, test: kwestia ≤ 12 słów.                     |
| Schemat z arkusza          | **nowy widok** w `src/ui/views/`    | Ruter – Serwer (dwie karty) – Przełącznik – Stacja robocza; karty jako osobne, klikalne.   |
| Kolorowanie sieci          | stan widoku                         | Niebieska, zielona, fioletowa. Pomarańczowej nie używać – u nas znaczy tylko Broadcast.    |
| Ćwiczenie „kliknij kartę”  | **nowa kontrolka albo tryb widoku** | Polecenie, klikanie kart, reakcja na błąd z tabeli scenariusza.                            |
| Ćwiczenie „tabela adresów” | **nowy widok albo panel**           | Uczeń klika linijkę arkusza, potem pole tabeli. Dobre wpisy zostają, złe wracają.          |
| Dane arkusza               | `src/model/` (nowy plik)            | Adresy tylko w `model/` – pilnuje tego `src/literaly.test.ts`.                             |
| Nazwy urządzeń             | jak w arkuszu                       | „Ruter”, „Przełącznik”, „Stacja robocza”, „Serwer” (PYT-074a). Patrz „Pułapki”.            |

Arkusz przewodni: styczeń 2025 (`egzaminy/inf02-2025-styczen-egzamin-zawodowy-praktyczny.pdf`).
Potrzebne linijki są przepisane w scenariuszu.

## Jak to wpiąć (wzór: strona routingu)

1. `routing.html` → analogiczny `arkusz.html`; wejście `src/pages/arkusz.tsx`.
2. `vite.config.ts`: dopisać stronę do `PAGES`. `package.json`: dopisać `vite build --mode arkusz`
   do skryptu `build`.
3. `e2e/lib.mjs`: dopisać przejście przez nową stronę do `walk`; `e2e/test.mjs`: pomiar „mieści się
   na ekranie” dla scen i dla ćwiczeń. `e2e/shots.mjs`: dopisać stronę do listy stron opcjonalnych.
4. `src/content/content.test.ts`: dopisać kurs do `COURSES`.
5. README: wiersz w tabeli stron i w tabeli plików.

## Kryteria końca

- `pnpm build` zielony: typy, testy, trzy stare strony + nowa, e2e.
- Każdy krok scen i każde polecenie ćwiczeń mieści się w 1366×768 i 1280×720 bez przewijania.
- Stare strony bez zmian: `pnpm e2e:shots <katalog>` i `pnpm e2e:compare` względem wzorca z
  `origin/main` – jedyną różnicą ma być lista stanów (nowa strona).
- Kwestie zgodne ze scenariuszem co do słowa.
- Obejrzane zrzuty co najmniej: początek i koniec każdej sceny, każde ćwiczenie w stanie „błąd”
  i „dobrze”. Ruch (kolorowanie, lot adresu) operator ogląda sam – powiedz mu, które kroki.
- Strona **nie** jest podlinkowana z teorii, dopóki operator nie zdecyduje.

## Pułapki, które już wyszły

- **Słownik nazw.** `model/glossary.ts` ma „Router (Brama)” i „Switch”. Ta strona używa nazw
  z arkusza. Nie zmieniaj istniejących wpisów (zmieniłyby się inne strony i wzorzec treści);
  dodaj osobne nazwy dla tej ścieżki.
- **Test nazw** (`content.test.ts`) wymaga wielkiej litery w nazwach urządzeń, ale kwestie postaci
  są z niego zwolnione. Zakaz słów „komputer”, „przełącznik”, „ruter” obowiązuje wszędzie – a nazwy
  z arkusza to właśnie „Ruter” i „Przełącznik”. Trzeba ten test dopasować do decyzji PYT-074a
  i powiedzieć o tym operatorowi w meldunku.
- **Wzorzec treści** `src/niezmiennosc.test.ts`: odświeżać (`pnpm exec vitest run -u`) tylko po
  zatwierdzonej zmianie treści starych stron. Nowa strona nie powinna go ruszać.
- **Podział tekstu na węzły** zmienia piksele (np. `{a} {b}` zamiast jednego napisu). Dotyczy tylko
  starych stron, gdy się je dotyka.
- **Animacja ruchu**: zrzuty powstają z wyłączoną animacją, więc ruchu nie widać w testach.
- **Telefon**: rysunek SVG skaluje się do szerokości i napisy robią się bardzo małe. Znane,
  nierozwiązane; nie obiecuj czytelności na telefonie.
- **Prettier** uruchamia się z katalogu głównego repo (`pnpm exec prettier --write …`), nie z `appka`.
- **Hook przed commitem** sam dopisuje nowe strony do `KONSPEKT.md` – to normalne.

## Jak pracować z operatorem (poza kontraktem)

- Operator czyta meldunki na szybko i często dyktuje. Pisz krótko, zwykłymi słowami, z tabelami.
- Odpowiada skrótami, np. „74a”. Każde pytanie musi mieć numer, opcje i rekomendację.
- Makiet i dłuższych zestawień nie pokazuj mu w Markdownie – woli stronę HTML otwartą w przeglądarce.
- Polecenia w terminalu mają być krótkie i czytelne. Raz odrzucił długie polecenie z osadzonym
  skryptem, bo wyglądało na ryzykowne. Skrypty zapisuj narzędziem do zapisu plików, potem uruchamiaj.
- Przed każdym nowym numerem pytania i przed commitem zrób `git fetch` i sprawdź `origin/main` –
  dwa razy inna sesja zajęła te same numery. Pierwszy wolny numer: **PYT-075**.
- Commit, push, usuwanie plików, zmiana treści dla ucznia poza zatwierdzonym zakresem, linki z teorii:
  zawsze pytaj.
- Linia w commitach: `Co-Authored-By` z nazwą modelu, który wykonał pracę (PYT-044a).

## Co dalej, po etapach 1–2 (nie w tym zleceniu)

| Etap | Temat                           | Uwaga                                                       |
| ---- | ------------------------------- | ----------------------------------------------------------- |
| 3    | Kto rozdaje adresy (DHCP)       | ten sam arkusz: zakres i rezerwacja na ruterze              |
| 4    | W jakiej kolejności konfiguruję | zależy od modeli rutera i przełącznika w pracowni – zapytać |
| 5    | Ping nie działa                 | lista kontrolna od kabla do zapory                          |
| 6    | To samo z VLAN-ami              | arkusze z czerwca 2023–2026                                 |
| obok | „siłownia” z masek              | adres sieci, Broadcast, pierwszy i ostatni host             |

Każdy etap zaczyna się od scenariusza do akceptacji operatora, dopiero potem kod.

Otwarte poza tą ścieżką: PYT-065 (nawiązania do schematów z arkuszy – ta ścieżka je realizuje),
druga scena routingu „droga powrotna”, napis „To ja!” przy strzałce ARP (dodany bez scenariusza,
operator nie zgłosił uwag).

## Pierwsza wiadomość do operatora

Krótki meldunek stanu według kontraktu (rozdz. 5 i 7): co przeczytałeś, w jakim stanie jest
repozytorium, jak rozumiesz zakres etapów 1–2 i od czego zaczynasz. Jeśli coś w tym zleceniu jest
niejasne albo sprzeczne z plikami, zapytaj, zanim zaczniesz kod.
