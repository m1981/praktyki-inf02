# Symulator ARP i Unicast (źródła)

Gotowa strona: [`01-sieci/symulator-arp.html`](../symulator-arp.html) – **plik generowany, nie edytuj go ręcznie**.

## Praca

| Komenda (w tym katalogu) | Co robi                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `pnpm install`           | instaluje zależności (raz)                                               |
| `pnpm dev`               | podgląd na żywo pod `http://localhost:5173`                              |
| `pnpm build`             | sprawdza typy, buduje i nadpisuje `../symulator-arp.html` (commituj go!) |

Wynik to **jeden plik HTML** z wbudowanym JS i CSS, więc działa z dysku (`file://`) i na GitHub Pages.
Wspólne `../common.css` i `../menu.js` są podpinane linkiem (plugin `site-shell` w `vite.config.ts`).

## Gdzie co jest

| Plik                        | Rola                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `src/simulationConfig.ts`   | **dane**: urządzenia, kable, ramki i kroki scenariusza (bez Reacta) |
| `src/simulationReducer.ts`  | maszyna stanów: `NEXT` / `PREV` / `RESET`                           |
| `src/graph.ts`              | czyste funkcje: krok → węzły, krawędzie, stan tablic ARP/MAC        |
| `src/NetworkSimulation.tsx` | układ strony, przyciski, klawiatura ← →                             |
| `src/DeviceNode.tsx`        | karta urządzenia na diagramie                                       |
| `src/PacketEdge.tsx`        | kabel + animowana ramka (SVG `animateMotion`)                       |
| `src/InfoPanels.tsx`        | tabela ramki, tablica ARP Laptopa, tablica MAC Switcha              |

## Nowy krok lub scenariusz

Edytujesz tylko `src/simulationConfig.ts`. Broadcast/Unicast wynika z `frame.dstMac`, kierunek strzałki
z `flow.from` → `flow.to`, tablice ARP/MAC z pól `learns`. W `pnpm dev` funkcja `assertScenario`
zgłosi błąd, gdy skok nie idzie po istniejącym kablu.
