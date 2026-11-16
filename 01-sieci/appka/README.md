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
| `pnpm build`             | typy + testy + build obu stron → nadpisuje `../symulator-*.html` (commituj je!)       |

Każda strona to **jeden plik HTML** z wbudowanym JS i CSS, więc działa z dysku (`file://`) i na GitHub
Pages. `vite-plugin-singlefile` obsługuje jedno wejście, dlatego każdą stronę budujemy osobno
(`vite build --mode arp|maska`). Wspólne `../common.css` i `../menu.js` są podpinane linkiem (plugin
`site-shell` w `vite.config.ts`).

## Gdzie co jest

| Plik                        | Rola                                                                       |
| --------------------------- | -------------------------------------------------------------------------- |
| `src/sim/types.ts`          | wspólne typy: urządzenie, kabel, ramka, skok ramki, `DiagramState`         |
| `src/sim/graph.ts`          | czyste funkcje: `DiagramState` → węzły i krawędzie React Flow              |
| `src/sim/Diagram.tsx`       | diagram jako animowany slajd (bez edycji)                                  |
| `src/sim/DeviceNode.tsx`    | karta urządzenia (rola, tło „w sieci / poza siecią”)                       |
| `src/sim/PacketEdge.tsx`    | kabel + animowane ramki (SVG `animateMotion`), także kilka na jednym kablu |
| `src/arp/scenario.ts`       | **dane** ARP: urządzenia, kable, ramki i kroki scenariusza                 |
| `src/arp/reducer.ts`        | maszyna stanów kroków: `NEXT` / `PREV` / `RESET`                           |
| `src/maska/ipMath.ts`       | arytmetyka IPv4 (maska, adres sieci, Broadcast, bity)                      |
| `src/maska/network.ts`      | **decyzja nadawcy** `decide()`, gotowe przykłady, reducer                  |
| `src/maska/network.test.ts` | testy lekcji (/24, /25, /26, pułapka) i wszystkich kombinacji ustawień     |
| `src/maska/*.tsx`           | widoki: decyzja, ulica adresów, bity                                       |

## Nowy scenariusz ARP-owy (kroki)

Edytujesz tylko `src/arp/scenario.ts`. Broadcast/Unicast wynika z `frame.dstMac`, kierunek strzałki
z `flow.from` → `flow.to`, tablice ARP/MAC z pól `learns`. W `pnpm dev` funkcja `assertScenario`
zgłosi błąd, gdy skok nie idzie po istniejącym kablu.
