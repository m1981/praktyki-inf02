# Symulatory sieciowe Filaru 1 (źródła)

| Strona (plik generowany – **nie edytuj ręcznie**)          | Wejście strony        | Treść                   | Wejście HTML |
| ---------------------------------------------------------- | --------------------- | ----------------------- | ------------ |
| [`01-sieci/symulator-arp.html`](../symulator-arp.html)     | `src/pages/arp.tsx`   | `src/content/arp.ts`    | `arp.html`   |
| [`01-sieci/symulator-maska.html`](../symulator-maska.html) | `src/pages/maska.tsx` | `src/content/maska*.ts` | `maska.html` |

Plan kolejnych symulatorów: [`plan.md`](plan.md).

## Praca

| Komenda (w tym katalogu) | Co robi                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `pnpm install`           | instaluje zależności (raz)                                                            |
| `pnpm dev`               | podgląd na żywo: `http://localhost:5173/arp.html`, `http://localhost:5173/maska.html` |
| `pnpm test`              | testy logiki (Vitest)                                                                 |
| `pnpm build`             | typy + testy + build obu stron → nadpisuje `../symulator-*.html` (commituj je!) + e2e |
| `pnpm test:e2e`          | zbudowane strony w Chrome: każdy krok mieści się w 1366×768 i 1280×720, brak błędów   |

Każda strona to **jeden plik HTML** z wbudowanym JS i CSS, więc działa z dysku (`file://`) i na GitHub
Pages. `vite-plugin-singlefile` obsługuje jedno wejście, dlatego każdą stronę budujemy osobno
(`vite build --mode arp|maska`). Wspólne `../common.css` i `../menu.js` są podpinane linkiem (plugin
`site-shell` w `vite.config.ts`).

## Testy e2e i porównanie „przed = po”

Testy e2e używają `puppeteer-core` i Chrome zainstalowanego w systemie (nic nie pobierają). Gdy Chrome
jest w innym miejscu niż domyślne, ustaw zmienną `CHROME_PATH`.

| Komenda                               | Co robi                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm test:e2e --tabela`              | pokazuje pomiary każdego stanu (dolna krawędź w px, liczba kontrolek)    |
| `pnpm e2e:shots <katalog> --ref main` | zrzut i tekst każdego stanu stron z commita `main` (wzorzec „przed”)     |
| `pnpm e2e:shots <katalog>`            | to samo dla stron z dysku (po `pnpm build`)                              |
| `pnpm e2e:compare <przed> <po>`       | refaktor przechodzi, gdy tekst jest identyczny, a obraz różni się ≤ 0,1% |

`src/niezmiennosc.test.ts` trzyma wzorzec danych i tekstów (`src/__snapshots__/`). Odświeżaj go
(`pnpm test -u`) tylko przy zatwierdzonej zmianie treści.

## Gdzie co jest

Warstwy według [`architektura.md`](architektura.md), rozdz. 2. Zależności idą tylko w dół:
`pages → content → engine / ui → net → model → lib`. Obie strony działają na jednym silniku i jednym
szablonie ekranu (stan po kroku 5 migracji).

| Katalog        | Rola                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `src/lib/`     | arytmetyka IPv4 (`ipv4.ts`) – bez wiedzy o sieci i o ekranie                              |
| `src/model/`   | CO JEST w sieci: **jedyne miejsce z adresami IP, MAC, portami i kablami** + słownik nazw  |
| `src/net/`     | JAK DZIAŁA sieć: decyzja nadawcy, droga ramki, ARP, ruch w sieci (czyste funkcje)         |
| `src/engine/`  | JAK SIĘ PRZECHODZI lekcję: kontrakt Kurs → Ćwiczenie → Krok, nawigacja, rejestry          |
| `src/ui/`      | JAK TO WYGLĄDA: jeden szablon ekranu, widoki, panele, elementy sterujące, diagram, tokeny |
| `src/content/` | CO MÓWIMY uczniowi: teksty i sceny kroków jako dane                                       |
| `src/pages/`   | wejścia stron: składają kurs z treści i podają go szablonowi                              |
| `e2e/`         | testy w przeglądarce, zrzuty i porównanie                                                 |

| Plik                            | Rola                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `src/model/siec.ts`             | urządzenia, adresy, kable + selektory (jedyny sposób odczytu)                 |
| `src/model/glossary.ts`         | nazwy urządzeń ze Słownika pojęć (mianownik, dopełniacz, forma krótka)        |
| `src/net/decide.ts`             | decyzja nadawcy: bezpośrednio, przez bramę albo brama poza siecią             |
| `src/net/mask.ts`               | ćwiczenia z maską: ustawienia → decyzja → droga ramki                         |
| `src/net/path.ts`               | droga ramki po kablach (Unicast, objazd przez bramę, Broadcast)               |
| `src/net/traffic.ts`            | ruch w sieci w jednej chwili: role urządzeń i skoki ramek                     |
| `src/net/arp.ts`                | ramki ARP i tablice ARP/MAC każdego urządzenia po kolejnych krokach           |
| `src/engine/types.ts`           | kontrakt `Course` / `Exercise` / `Step`                                       |
| `src/engine/nav.ts`             | jedna maszyna stanów nawigacji + adres `#kod`                                 |
| `src/engine/registry.tsx`       | rejestry: rodzaj widoku, panelu i elementu sterującego → komponent            |
| `src/engine/check.ts`           | kontrola spójności kursu w `pnpm dev` (ramki tylko po kablach)                |
| `src/ui/LessonShell.tsx`        | **jedyne miejsce układu ekranu**: zakładki, pytanie, scena, tekst, sterowanie |
| `src/ui/tokens.css`, `.ts`      | wymiary układu (CSS) i kolory ramek (TS) – jedyne miejsce, gdzie są wpisane   |
| `src/ui/views/`                 | sceny: diagram, oś adresów z płotami, tabela porównania                       |
| `src/ui/panels/`                | panele: ramka, tablice ARP/MAC, pytania; decyzja, ulica adresów, bity         |
| `src/ui/controls/`              | elementy sterujące: przycisk „dalej”, przełącznik, kroki scenariusza          |
| `src/ui/diagram/`               | diagram React Flow: karta urządzenia, kabel z animowaną ramką                 |
| `src/ui/free/`                  | Tryb swobodny maski: ekran i stan ustawień (treść dostaje z `content/`)       |
| `src/ui/text.tsx`               | wypełnianie pól `{nazwa}` i pogrubienia `**…**` w tekstach z `content/`       |
| `src/content/arp.ts`            | Symulator ARP: układ diagramu, ramki i kroki scenariusza                      |
| `src/content/maska.ts`          | seria M1–M4: teksty i sceny kroków                                            |
| `src/content/maska-swobodny.ts` | Tryb swobodny: gotowe przykłady z lekcjami i zdania paneli                    |
| `src/content/maska-uklad.ts`    | układ diagramu maski: pozycje kart, boki kabli, napisy na kartach             |
| `src/content/content.test.ts`   | testy treści: ≤ 40 słów, ramki po kablach, nazwy tylko ze słownika            |
| `src/warstwy.test.ts`           | test: zależności między warstwami idą tylko w dół                             |
| `src/literaly.test.ts`          | test: adresy IP i MAC są wpisane tylko w `model/`                             |
| `src/niezmiennosc.test.ts`      | strażnik refaktoru: dane i teksty zgodne ze wzorcem sprzed etapu B            |

## Redakcja tekstów

Wszystkie zdania dla ucznia są w `src/content/`. Zmieniasz tylko tekst w cudzysłowach. W Trybie
swobodnym pola w klamrach (np. `{dst}`) wypełnia kod, a `**tekst**` oznacza pogrubienie. Krótkie napisy
interfejsu (nagłówki tabel, przyciski „Wstecz”, „Dalej”) są w komponentach `src/ui/`.

## Nowe ćwiczenie w serii

Dopisujesz obiekt `Exercise` w `src/content/` (teksty, scena `view`, element sterujący `control`).
Kodu w `engine/` i `ui/` nie zmieniasz. `pnpm test` sprawdzi limit słów, kable i nazwy urządzeń.

Nowy rodzaj sceny (np. mapa firmy) = nowy komponent w `src/ui/views/` + jego opis w unii `ViewSpec`
i jedna linia w rejestrze `src/engine/registry.tsx`.

## Nowy scenariusz ARP-owy (kroki)

Edytujesz tylko `src/content/arp.ts` (adresy i nazwy urządzeń bierzesz z `src/model/`). Broadcast/Unicast
wynika z `frame.dstMac`, kierunek strzałki z `flow.from` → `flow.to`, tablice ARP/MAC z pól `learns`
(każde urządzenie ma własne tablice: `{ device: 'laptop', arp: [...] }`, `{ device: 'switch', mac: [...] }`).
W `pnpm dev` funkcja `assertCourse` zgłosi błąd, gdy skok nie idzie po istniejącym kablu.
