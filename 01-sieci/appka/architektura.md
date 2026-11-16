# Architektura symulatorów – przegląd i projekt docelowy

Status: zatwierdzone (PYT-019–022: migracja kroki 1–6, osobne strony, puppeteer-core, treść w TypeScript) · 2026-11-16

## 1. Przegląd obecnego kodu (stan na `bb21569`)

Kod jest czytelny i otestowany (39 testów), ale powstał „ćwiczenie po ćwiczeniu”. Przed Projektem
ZS1 (11 kroków, 5 stref, ~25 urządzeń) trzeba usunąć miejsca, które przy każdym nowym ćwiczeniu
wymagają kopiowania albo edycji wspólnego kodu.

| #   | Zasada | Problem                                                                                                                                           | Dowód                                                                                                                         | Skutek dla ZS1                                                       |
| --- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | DRY    | **Trzy modele sieci.** ARP i maska mają osobne listy urządzeń, adresów, MAC i pozycji; seria M3/M4 buduje urządzenia ręcznie.                     | adresy/MAC jako literały: `arp/scenario.ts` 8×, `maska/network.ts` 8×, `maska/series.ts` 10×; nazwy urządzeń: 20× w 4 plikach | zmiana adresu = edycja w 3+ miejscach; ZS1 zmienia wszystkie adresy  |
| 2   | DRY    | **Trzy ekrany z własnym układem**: `NetworkSimulation` (ARP), `ExerciseScreen` (seria), `MaskExplorer` (tryb swobodny).                           | 3 komponenty układające scenę, panel kroku i przyciski                                                                        | zmiana układu = zmiana w 3 plikach                                   |
| 3   | DRY    | **Trzy maszyny stanów i dwie obsługi klawiatury**: `arp/reducer.ts`, `seriesReducer`, `maskReducer`; `ArrowRight` w 2 plikach.                    | `useReducer` w 3 plikach                                                                                                      | nawigacja ZS1 byłaby czwartą kopią                                   |
| 4   | OCP    | **Rozgałęzienia po rodzaju**: nowy widok albo nowa kontrolka = edycja `SeriesView.tsx`.                                                           | `v.kind === 'diagram' / 'fence'`, `controlKind === 'toggle' / 'next'`                                                         | każdy krok ZS1 z nowym widokiem (mapa, tabela portów…) zmienia rdzeń |
| 5   | SRP    | **`maska/network.ts` (293 linie) ma 5 powodów do zmiany**: dane urządzeń, decyzja nadawcy, budowa kart (teksty notatek), lekcje (treść), reducer. | jeden plik                                                                                                                    | zmiana tekstu lekcji dotyka logiki decyzji                           |
| 6   | SRP    | **Treść wymieszana z logiką**: teksty kroków i werdyktów w `scenario.ts`, `network.ts`, `series.ts`, `DecisionPanel.tsx`, `BitRuler.tsx`.         | 5 plików z polskimi zdaniami dla ucznia                                                                                       | redakcja tekstów wymaga czytania kodu                                |
| 7   | DRY    | **Wymiary układu w kilku miejscach**: 340 px sceny i 360 px kolumny w `sim.css` i `maska.css`; poprawki doklejane na końcu `sim.css`.             | `340px`/`360px`/`400px` w 2 plikach CSS                                                                                       | zmiana wysokości sceny = szukanie po CSS                             |
| 8   | –      | **Brak automatycznej kontroli „mieści się na ekranie”**: pomiary 1366×768 / 1280×720 robię skryptami w katalogu tymczasowym sesji.                | skrypty `measure.mjs`, `series.mjs` poza repo                                                                                 | zmiana układu może po cichu zepsuć kryterium z audytu                |
| 9   | SRP    | `Diagram` dopasowuje widok tylko przy starcie; seria obchodzi to przez `key={exIndex}`.                                                           | `SeriesView.tsx`                                                                                                              | ukryta zależność, łatwo ją zgubić                                    |

Dobre i do zachowania: `ipMath.ts` (czyste funkcje), `sim/graph.ts` (stan → węzły i krawędzie),
`PacketEdge`/`DeviceNode` (wspólny silnik diagramu), testy limitu słów i kabli, jeden plik HTML na
stronę.

**SOLID – co jest adekwatne w React + TypeScript:** SRP (moduł ma jeden powód do zmiany), OCP
(nowy przypadek = nowe dane albo nowy wpis w rejestrze, bez edycji rdzenia), DIP (ekran zależy od
kontraktu `Step`, nie od konkretnych widoków), ISP (widok dostaje tylko potrzebne dane). LSP ma
tu małe znaczenie (brak hierarchii klas). Nie wprowadzamy klas ani wzorców „na zapas” (YAGNI).

## 2. Projekt docelowy: cztery warstwy, każda z jednym źródłem prawdy

```
src/
  model/      CO JEST w firmie          – jedno źródło prawdy o sieci ZS1 (dane, bez Reacta)
  net/        JAK DZIAŁA sieć            – czyste funkcje: maska, decyzja nadawcy, droga ramki, ARP
  engine/     JAK SIĘ PRZECHODZI lekcję  – kontrakt Kurs → Ćwiczenie → Krok, nawigacja, rejestry
  ui/         JAK TO WYGLĄDA             – jeden szablon ekranu + widoki, panele, kontrolki, tokeny
  content/    CO MÓWIMY uczniowi         – treść lekcji jako dane (teksty, wybór widoków)
  pages/      wejścia (cienkie)          – arp, maska, projekt-zs1
```

Zależności tylko w dół: `pages → content → engine/ui → net → model`. `model` i `net` nie wiedzą
nic o React.

### 2.1 `model/` – jedna sieć ZS1 (rozwiązuje 1)

```ts
// model/zs1.ts – jedyne miejsce z adresami, MAC, strefami i kablami
export const ZONES = { serwerownia: { vlan: 10, net: '192.168.10.0/24' }, biuro: { vlan: 20, … }, … };
export const DEVICES = [
  { id: 'nas', kind: 'nas', zone: 'serwerownia', host: 40, mac: '…' },
  { id: 'drukarka', kind: 'printer', zone: 'biuro', host: 20, mac: '…' },
  …
];
export const LINKS = [ { a: 'router', b: 'sw-biuro' }, … ];
// model/glossary.ts – nazwy ze Słownika pojęć: { nas: { nom: 'Serwer NAS', gen: 'Serwera NAS' } }
```

Adres liczy się z `zone.net + host` – nie ma go nigdzie wpisanego ręcznie. Selektory
(`deviceIp(id)`, `devicesInZone(z)`) to jedyny sposób odczytu.

### 2.2 `net/` – logika (rozwiązuje 5)

`ipMath.ts` (bez zmian), `decide.ts` (decyzja nadawcy), `path.ts` (droga ramki po kablach na
podstawie decyzji – dziś ręczne `flows`), `arp.ts` (ramki ARP i tablice). Wszystko czyste funkcje
z testami.

### 2.3 `engine/` – kontrakt kroku i rejestry (rozwiązuje 3, 4)

```ts
interface Step {
 text: string; // ≤ 40 słów (test)
 change?: string; // pasek „Zmiana”
 view: ViewSpec; // np. { type: 'diagram', focus: ['laptop','sw-biuro','drukarka'], traffic: … }
 panels?: PanelSpec[]; // np. [{ type: 'arpTable', of: 'laptop' }]
 control?: ControlSpec; // np. { type: 'next' } | { type: 'toggle', options: [...] }
}
interface Exercise {
 code;
 title;
 question;
 steps: Step[];
 nextQuestion;
}
interface Course {
 id;
 title;
 exercises: Exercise[];
 freeMode?: ComponentType;
}

const VIEWS = { diagram: DiagramView, fence: FenceView, compare: CompareView, bits: BitsView };
const PANELS = {
 frame: FramePanel,
 arpTable: ArpTablePanel,
 macTable: MacTablePanel,
 decision: DecisionPanel
};
const CONTROLS = { next: NextButton, toggle: Toggle, choice: Choice };
```

- **OCP:** nowy rodzaj widoku = nowy komponent + jedna linia w rejestrze; szablon ekranu się nie
  zmienia. Nowe ćwiczenie = nowy plik w `content/`, zero zmian w kodzie.
- **Jedna nawigacja:** `useCourseNav(course)` – jeden reducer (krok, ćwiczenie), adres `#kod`,
  strzałki ← →, `hashchange`. Używają jej ARP, maska i ZS1.
- **`focus`** zamiast kopii urządzeń: widok wybiera urządzenia z modelu po id; reszta ukryta albo
  wyszarzona (stopniowe odsłanianie z audytu). `Diagram` sam dopasowuje widok, gdy zmienia się
  zbiór urządzeń (rozwiązuje 9).

### 2.4 `ui/` – jeden szablon ekranu (rozwiązuje 2, 7)

`LessonShell` to **jedyne miejsce układu**: zakładki ćwiczeń · pytanie · scena (widok) · panel
kroku (tekst, zmiana, kontrolka, pytanie na następne ćwiczenie) · panele pod sceną. Wymiary i
kolory znaczeń w jednym pliku tokenów:

```css
/* ui/tokens.css */
:root { --stage-h: 340px; --side-w: 360px; --c-broadcast: #e67e22; --c-unicast: #00b894; … }
```

Zmiana układu (np. panele po prawej zamiast pod sceną) = zmiana w `LessonShell` + tokenach.

### 2.5 `content/` – treść jako dane (rozwiązuje 6)

`content/arp.ts`, `content/maska.ts`, `content/zs1/krok-00.ts` … Tylko teksty i specyfikacje
widoków; zero logiki. Testy pilnują: ≤ 40 słów, każda ramka po istniejącym kablu, każde urządzenie
z `focus` istnieje w modelu, każde ćwiczenie ma `nextQuestion`, nazwy urządzeń tylko ze słownika.

### 2.6 Siatka bezpieczeństwa (rozwiązuje 8)

`pnpm test:e2e` w repo: puppeteer-core + zainstalowany Chrome; dla każdej strony i każdego kroku:
mieści się w 1366×768 i 1280×720, ≤ 1 kontrolka (grupa przełącznika = 1), brak błędów w konsoli.
Uruchamiane w `pnpm build`.

## 3. Plan migracji (każdy krok kończy się zielonymi testami i takim samym wyglądem)

| #   | Krok                                                                     | Dowód, że nic się nie zepsuło                           |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| 1   | Testy e2e w repo (obecne pomiary)                                        | e2e zielone na obecnym kodzie                           |
| 2   | `model/` + `glossary` + `net/` (na razie z adresami 10.10.10.x)          | testy jednostkowe; brak literałów adresów poza `model/` |
| 3   | `engine/` + `LessonShell` + rejestry; seria M1–M4 przeniesiona           | e2e + porównanie zrzutów przed/po                       |
| 4   | ARP przeniesiony na silnik (tablice jako panele)                         | e2e + zrzuty                                            |
| 5   | Tryb swobodny korzysta z `model/` i `net/`                               | e2e                                                     |
| 6   | Zmiana danych w `model/` na plan ZS1 (192.168.x) – jedna zmiana w danych | testy treści; teksty z adresami przechodzą test         |
| 7   | Dopiero teraz treść Projektu ZS1                                         | –                                                       |

Krok 6 pokazuje sens całej pracy: przejście na nowe adresy to zmiana w jednym pliku danych, a nie
w trzech modułach i pięciu plikach z tekstami.
