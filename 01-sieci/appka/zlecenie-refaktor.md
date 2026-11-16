# Zlecenie: refaktor symulatorów (dla sub-agenta albo nowej sesji)

Status: gotowe do uruchomienia po decyzjach PYT-023–025 · 2026-11-17

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
  z linią `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Nie usuwaj plików spoza `src/` i `e2e/`. `przyklad.md` i `kontrakt.md` nie ruszasz.
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
