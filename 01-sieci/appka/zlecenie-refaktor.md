# Zlecenie: refaktor symulatorów (dla sub-agenta albo nowej sesji)

Status: etapy A i B wykonane 2026-11-16. Etap A jest na `main`; etap B (kroki 3–5) jest po rebase na `origin/main` i czeka na push (PYT-047). Następny: etap C, po przeglądzie. Stan uwag z przeglądu etapu A: sekcja na końcu pliku.

Ten plik to kompletny brief. Wykonawca nie zna wcześniejszej rozmowy – wszystko, czego potrzebuje,
jest tu i w plikach, które wskazuje.

## Kontekst (przeczytaj w tej kolejności)

1. `01-sieci/appka/kontrakt.md` – zasady pracy z operatorem (meldunek, pytania, granice).
2. `01-sieci/appka/architektura.md` – **projekt docelowy (rozdz. 2) i plan migracji (rozdz. 3)**.
3. `01-sieci/appka/README.md` – budowanie (`pnpm build`), układ plików.
4. `01-sieci/appka/audyt.md`, rozdz. 7 – kryteria akceptacji (mieści się na ekranie, ≤ 40 słów…).
5. `01-sieci/appka/e2e/z-sesji/` – robocze skrypty pomiarowe (punkt wyjścia dla kroku 1).

Repo: `/Users/michal/PycharmProjects/praktyki-inf02`. Kod: `01-sieci/appka/src`. Strony wynikowe
(generowane, commitowane): `01-sieci/symulator-arp.html`, `01-sieci/symulator-maska.html`.

## Zasada nadrzędna: refaktor = zero zmian dla ucznia (kroki 1–5)

Po każdym kroku strony wyglądają i działają **tak samo** jak przed nim: te same teksty, adresy,
kolejność, kolory, układ. Zmienia się tylko kod. Dowód: testy jednostkowe + e2e zielone, a zrzuty
każdego kroku przed i po są takie same (zrzuty z `prefers-reduced-motion: reduce`, żeby animacja
nie psuła porównania; porównanie pikselowe, np. `pixelmatch`, tolerancja ≤ 0,1% pikseli).

## Etapy i wykonawcy

| Etap | Kroki z `architektura.md` rozdz. 3                                                                                    | Wykonawca                        | Koniec etapu                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| A    | 1 (e2e w repo), 2 (`model/`, `glossary`, `net/`)                                                                      | sub-agent A                      | `pnpm build` z e2e zielony; brak literałów adresów/MAC/nazw poza `model/` |
| B    | 3 (`engine/`, `LessonShell`, rejestry, seria M1–M4), 4 (ARP), 5 (Tryb swobodny)                                       | sub-agent B                      | wszystkie strony na jednym szablonie; zrzuty przed = po                   |
| C    | 6 (adresy ZS1 w `model/`) + treść (ARP: Laptop → Drukarka; M2 widok /16; M4 „Zła maska”) + plan ZS1 w `topology.html` | osobno, po przeglądzie operatora | – (zmienia treść dla ucznia, więc nie jest refaktorem)                    |

## Ograniczenia

- Zmieniasz tylko `01-sieci/appka/**` oraz generowane `01-sieci/symulator-*.html`. Nic poza tym
  (bez `common.css`, `menu.js`, labów, `topology.html`).
- Commit: tylko na gałęzi roboczej `refaktor-silnik`, jeden commit na krok migracji, **bez push i bez
  scalania do `main`** (kontrakt, rozdz. 3). Wiadomość commita po angielsku, w trybie rozkazującym,
  z linią `Co-Authored-By` podającą model, który wykonał pracę (PYT-044a), np.
  `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`.
- Nie usuwasz plików bez zgody operatora (kontrakt, rozdz. 3). `przyklad.md` i `kontrakt.md` nie ruszasz.
- Nie dodawaj zależności poza: `pixelmatch`, `pngjs` (porównanie zrzutów), `puppeteer-core` (e2e).
- Teksty dla ucznia przenosisz do `content/` **bez zmiany ani jednego słowa** (test porównuje).
- Hook pre-commit uruchamia PurgeCSS, konspekt i Prettier – to normalne.

## Kiedy przerwać i zameldować (kontrakt, rozdz. 6)

- zrzuty przed/po różnią się i nie umiesz tego usunąć bez zmiany treści,
- krok wymaga zmiany poza dozwolonymi plikami,
- projekt z `architektura.md` okazuje się w istotnym punkcie błędny.

## Meldunek na koniec etapu (format z kontraktu, rozdz. 5)

WNIOSEK · WYKONANO (commity, pliki) · STAN (testy, e2e, porównanie zrzutów) · PROBLEMY · PACZKA
PYTAŃ (pytania do operatora, z rekomendacją) · OD CIEBIE.

## Uwagi z przeglądu etapu A (2026-11-16) – do uwzględnienia w etapie B

Przegląd potwierdził: tsc bez błędów, 87/87 testów, e2e 63 pomiary, 42 stany identyczne z `dd0c904`
(tekst co do znaku, 0,0000% pikseli; strony zbudowane po ostatniej zmianie źródeł).

| #   | Uwaga                                                                                                                                                                                                                                                                           | Kiedy                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | `model/` importuje `net/ipMath` – odwrotny kierunek zależności. Przenieść `ipMath` do neutralnej warstwy `src/lib/ipv4.ts`, z której korzystają `model/` i `net/`.                                                                                                              | etap B, krok 3             |
| 2   | `net/path.floodPath` rozsyła Broadcast przez **wszystkie** urządzenia, także przez Router. Dziś Router jest liściem, więc wynik jest dobry; w ZS1 Broadcast „przeszedłby” do innych stref. Dodać zatrzymanie na urządzeniach L3 + test „Broadcast nie przechodzi przez Router”. | przed etapem C (konieczne) |
| 3   | `model.switchPort` zakłada jeden kabel do jednego Switcha i port tylko po stronie Switcha. W ZS1 Router ma kabel do każdej strefy – port po obu stronach kabla (`portA`, `portB`).                                                                                              | przed etapem C             |
| 4   | `net/arp.Learns` ma pola `laptopArp` / `switchMac` – skrojone pod jeden scenariusz. Uogólnić na tablice per urządzenie (`{ device, arp: [] }`, `{ device, mac: [] }`).                                                                                                          | etap B, krok 4 (ARP)       |
| 5   | `maska/network.ts` importuje `cable()` z `sim/graph` (warstwa widoku). W etapie B specyfikacja kabli z bokami kart należy do widoku/treści, nie do logiki.                                                                                                                      | etap B, krok 3             |
| 6   | Wzorzec `__snapshots__/niezmiennosc.test.ts.snap` (~9500 linii) to tymczasowy strażnik refaktoru. Usunąć po etapie C (ZS1 i tak zmienia wszystkie dane).                                                                                                                        | etap C                     |
| 7   | Brak testu „tylko nazwy ze słownika” w zdaniach dla ucznia (agent to zgłosił) – dodać przy przenoszeniu treści do `content/`.                                                                                                                                                   | etap B                     |
| 8   | `ipMath.firstThreeOctets` i `BitRuler` zakładają maski /24–/30. Widok „cała firma /16” (PYT-015a) wymaga uogólnienia.                                                                                                                                                           | etap C                     |
| 9   | Zlecenie pozwalało usuwać pliki w `e2e/`, a kontrakt (rozdz. 3) wymaga zgody na usuwanie. Błąd zlecenia (autor: agent poprzedniej sesji). Usunięte `e2e/z-sesji/` jest w historii (`dd0c904`). Od teraz obowiązuje kontrakt.                                                    | od razu                    |

## Stan uwag po etapie B (2026-11-16)

| #   | Stan                                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Zrobione: `src/lib/ipv4.ts`; kierunku zależności pilnuje `src/warstwy.test.ts`.                                                          |
| 2   | Otwarte – przed etapem C (PYT-045).                                                                                                      |
| 3   | Otwarte – przed etapem C (PYT-045).                                                                                                      |
| 4   | Zrobione: `net/arp.ts` – `Learn = { device, arp }` albo `{ device, mac }`, funkcje `arpTableAt` i `macTableAt` dla dowolnego urządzenia. |
| 5   | Zrobione: `net/mask.ts` nie zna kabli ani kart; układ jest w `content/maska-uklad.ts`.                                                   |
| 6   | Otwarte – etap C. Test `niezmiennosc.test.ts` przepisuje nowy kształt danych na stary, żeby porównać go z niezmienionym wzorcem.         |
| 7   | Zrobione: `content/content.test.ts`, grupa „nazwy urządzeń tylko ze słownika”.                                                           |
| 8   | Otwarte – etap C.                                                                                                                        |
| 9   | Zastosowane: usuwanie plików tylko za zgodą (PYT-042, zakres: `src/`).                                                                   |
