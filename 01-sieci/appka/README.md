# Symulatory sieciowe Filaru 1 (źródła)

| Strona (plik generowany – **nie edytuj ręcznie**)          | Źródła                                         | Wejście HTML |
| ---------------------------------------------------------- | ---------------------------------------------- | ------------ |
| [`01-sieci/symulator-arp.html`](../symulator-arp.html)     | `src/arp/`                                     | `arp.html`   |
| [`01-sieci/symulator-maska.html`](../symulator-maska.html) | `src/pages/maska.tsx`, `src/content/maska*.ts` | `maska.html` |

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
`pages → content → engine / ui → net → model → lib`. Stan po kroku 3 migracji: strona maski działa na
silniku; Symulator ARP (`src/arp/`) przejdzie na niego w kroku 4.

| Katalog        | Rola                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `src/lib/`     | arytmetyka IPv4 (`ipv4.ts`) – bez wiedzy o sieci i o ekranie                              |
| `src/model/`   | CO JEST w sieci: **jedyne miejsce z adresami IP, MAC, portami i kablami** + słownik nazw  |
| `src/net/`     | JAK DZIAŁA sieć: decyzja nadawcy, droga ramki, ARP, ruch w sieci (czyste funkcje)         |
| `src/engine/`  | JAK SIĘ PRZECHODZI lekcję: kontrakt Kurs → Ćwiczenie → Krok, nawigacja, rejestry          |
| `src/ui/`      | JAK TO WYGLĄDA: jeden szablon ekranu, widoki, elementy sterujące, diagram, tokeny i style |
| `src/content/` | CO MÓWIMY uczniowi: teksty i sceny kroków jako dane                                       |
| `src/pages/`   | wejścia stron: składają kurs z treści i podają go szablonowi                              |
| `e2e/`         | testy w przeglądarce, zrzuty i porównanie                                                 |

| Plik                          | Rola                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `src/model/siec.ts`           | urządzenia, adresy, kable + selektory (jedyny sposób odczytu)                 |
| `src/model/glossary.ts`       | nazwy urządzeń ze Słownika pojęć (mianownik, dopełniacz, forma krótka)        |
| `src/net/decide.ts`           | decyzja nadawcy: bezpośrednio, przez bramę albo brama poza siecią             |
| `src/net/mask.ts`             | ćwiczenia z maską: ustawienia → decyzja → droga ramki                         |
| `src/net/path.ts`             | droga ramki po kablach (Unicast, objazd przez bramę, Broadcast)               |
| `src/net/traffic.ts`          | ruch w sieci w jednej chwili: role urządzeń i skoki ramek                     |
| `src/engine/types.ts`         | kontrakt `Course` / `Exercise` / `Step`                                       |
| `src/engine/nav.ts`           | jedna maszyna stanów nawigacji + adres `#kod`                                 |
| `src/engine/registry.tsx`     | rejestry: rodzaj widoku i elementu sterującego → komponent                    |
| `src/ui/LessonShell.tsx`      | **jedyne miejsce układu ekranu**: zakładki, pytanie, scena, tekst, sterowanie |
| `src/ui/tokens.css`, `.ts`    | wymiary układu (CSS) i kolory ramek (TS) – jedyne miejsce, gdzie są wpisane   |
| `src/ui/views/`               | sceny: diagram, oś adresów z płotami, tabela porównania                       |
| `src/ui/controls/`            | elementy sterujące: przycisk „dalej”, przełącznik                             |
| `src/ui/diagram/`             | diagram React Flow: karta urządzenia, kabel z animowaną ramką                 |
| `src/ui/free/`, `ui/panels/`  | Tryb swobodny maski i jego panele (decyzja, ulica adresów, bity)              |
| `src/content/maska.ts`        | seria M1–M4: teksty i sceny kroków                                            |
| `src/content/maska-uklad.ts`  | układ diagramu maski: pozycje kart, boki kabli, napisy na kartach             |
| `src/content/content.test.ts` | testy treści: ≤ 40 słów, ramki po kablach, nazwy tylko ze słownika            |
| `src/literaly.test.ts`        | test: adresy IP i MAC są wpisane tylko w `model/`                             |
| `src/niezmiennosc.test.ts`    | strażnik refaktoru: dane i teksty zgodne ze wzorcem sprzed etapu B            |

## Nowe ćwiczenie w serii

Dopisujesz obiekt `Exercise` w `src/content/` (teksty, scena `view`, element sterujący `control`).
Kodu w `engine/` i `ui/` nie zmieniasz. `pnpm test` sprawdzi limit słów, kable i nazwy urządzeń.

Nowy rodzaj sceny (np. mapa firmy) = nowy komponent w `src/ui/views/` + jego opis w unii `ViewSpec`
i jedna linia w rejestrze `src/engine/registry.tsx`.

## Nowy scenariusz ARP-owy (kroki)

Edytujesz tylko `src/arp/scenario.ts` (adresy i nazwy urządzeń bierzesz z `src/model/`). Broadcast/Unicast wynika z `frame.dstMac`, kierunek strzałki
z `flow.from` → `flow.to`, tablice ARP/MAC z pól `learns`. W `pnpm dev` funkcja `assertScenario`
zgłosi błąd, gdy skok nie idzie po istniejącym kablu.
