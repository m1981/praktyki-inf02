# Symulatory sieciowe Filaru 1 (źródła)

| Strona (plik generowany – **nie edytuj ręcznie**)          | Źródła       | Wejście HTML |
| ---------------------------------------------------------- | ------------ | ------------ |
| [`01-sieci/symulator-arp.html`](../symulator-arp.html)     | `src/arp/`   | `arp.html`   |
| [`01-sieci/symulator-maska.html`](../symulator-maska.html) | `src/maska/` | `maska.html` |

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

Warstwy według [`architektura.md`](architektura.md), rozdz. 2. Stan po kroku 2 migracji: `model/` i
`net/` gotowe; `engine/`, `ui/`, `content/` powstaną w krokach 3–5.

| Plik                     | Rola                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- |
| `src/model/siec.ts`      | **jedyne miejsce z adresami IP, MAC, portami i kablami** + selektory            |
| `src/model/glossary.ts`  | nazwy urządzeń ze Słownika pojęć (mianownik, dopełniacz, forma krótka)          |
| `src/net/ipMath.ts`      | arytmetyka IPv4 (maska, adres sieci, Broadcast, bity)                           |
| `src/net/decide.ts`      | decyzja nadawcy: bezpośrednio, przez bramę albo brama poza siecią               |
| `src/net/path.ts`        | droga ramki po kablach (Unicast, objazd przez bramę, Broadcast)                 |
| `src/net/arp.ts`         | ramki ARP i stan tablic ARP/MAC po kolejnych krokach                            |
| `src/net/frame.ts`       | ramka, skok ramki, adres Broadcast                                              |
| `src/sim/types.ts`       | typy diagramu: karta urządzenia, kabel, `DiagramState`                          |
| `src/sim/graph.ts`       | czyste funkcje: `DiagramState` → węzły i krawędzie React Flow; `cable()`        |
| `src/sim/Diagram.tsx`    | diagram jako animowany slajd (bez edycji)                                       |
| `src/sim/DeviceNode.tsx` | karta urządzenia (rola, tło „w sieci / poza siecią”)                            |
| `src/sim/PacketEdge.tsx` | kabel + animowane ramki (SVG `animateMotion`), także kilka na jednym kablu      |
| `src/arp/scenario.ts`    | ARP: układ diagramu, ramki i kroki scenariusza (adresy z `model/`)              |
| `src/arp/reducer.ts`     | maszyna stanów kroków: `NEXT` / `PREV` / `RESET`                                |
| `src/maska/network.ts`   | maska: ustawienia ćwiczenia, karty urządzeń, diagram, gotowe przykłady, reducer |
| `src/maska/series.ts`    | seria M1–M4: teksty kroków i widoki                                             |
| `src/maska/*.tsx`        | widoki: seria, Tryb swobodny, decyzja, ulica adresów, bity                      |
| `src/literaly.test.ts`   | test: adresy IP i MAC są wpisane tylko w `model/`                               |
| `e2e/`                   | testy w przeglądarce, zrzuty i porównanie                                       |

## Nowy scenariusz ARP-owy (kroki)

Edytujesz tylko `src/arp/scenario.ts` (adresy i nazwy urządzeń bierzesz z `src/model/`). Broadcast/Unicast wynika z `frame.dstMac`, kierunek strzałki
z `flow.from` → `flow.to`, tablice ARP/MAC z pól `learns`. W `pnpm dev` funkcja `assertScenario`
zgłosi błąd, gdy skok nie idzie po istniejącym kablu.
