# Rejestr pytań

Prowadzi agent zgodnie z [`kontrakt.md`](kontrakt.md) (rozdz. 4). Odpowiedź operatora zapisuję dosłownie.
Źródło pytań 001–006: audyt dydaktyczny symulatorów z 2026-11-17 (raport w katalogu tymczasowym sesji,
zob. PYT-004).

## Przegląd

| ID      | Rodzaj  | Status        | Temat                                                          |
| ------- | ------- | ------------- | -------------------------------------------------------------- |
| PYT-001 | decyzja | zamknięte (a) | Miejsce serii M1–M4 w kolejności i status gałęzi L oraz P      |
| PYT-002 | decyzja | zamknięte (a) | Los obecnych pełnych widoków (ARP, maska)                      |
| PYT-003 | decyzja | zamknięte (a) | Jedna metafora maski w Filarze 1 i korekta zdania w Lab 1      |
| PYT-004 | decyzja | zamknięte (a) | Zapis raportu audytu do repozytorium                           |
| PYT-005 | decyzja | zamknięte (a) | Start szybkich wygranych 1–6 z audytu                          |
| PYT-006 | decyzja | zamknięte (a) | Dopasowanie kontraktu do pracy nad materiałami (nie harnessem) |
| PYT-007 | decyzja | zamknięte (a) | Układ maski, żeby diagram i lekcja mieściły się na ekranie     |
| PYT-008 | decyzja | zamknięte (b) | Commit i push szybkich wygranych, audytu i rejestru            |

## Pytania

### PYT-001 · decyzja · zamknięte

- **Kontekst:** audyt proponuje rozbić symulatory na mikro-ćwiczenia: A1–A4 (ARP), B1–B2 (Switch),
  M1–M4 (maska), L1–L3 (liczenie podsieci), P1–P2 (pułapki). Trzeba ustalić kolejność względem
  `plan.md`.
- **Opcje:** (a) M1–M4 przed scenariuszem 2, L i P jako gałęzie; (b) M1–M4 po scenariuszu 2;
  (c) wszystko obowiązkowe, po kolei.
- **Rekomendacja:** (a). M4 kończy się pytaniem, od którego startuje scenariusz 2. L1–L3 przy Kroku 5
  teorii (egzamin wymaga liczenia adresu sieci i Broadcastu). P1–P2 po Lab 1 Fazie 3.
- **Skutek braku odpowiedzi:** nie zaczynam serii mikro-ćwiczeń.
- **Odpowiedź (2026-11-17):** „wszystkie a” → (a)

### PYT-002 · decyzja · zamknięte

- **Kontekst:** obecne strony pokazują wszystko naraz. Po rozbiciu na serię mogą zniknąć albo zostać
  jako ostatni ekran.
- **Opcje:** (a) zostawić jako „Tryb swobodny” na końcu serii; (b) usunąć.
- **Rekomendacja:** (a). Przydają się przy rzutniku i uczniowi po serii. Szkodzą tylko jako pierwszy
  ekran.
- **Skutek braku odpowiedzi:** nie zaczynam serii mikro-ćwiczeń.
- **Odpowiedź (2026-11-17):** „wszystkie a” → (a)

### PYT-003 · decyzja · zamknięte

- **Kontekst:** Filar 1 ma trzy metafory maski: „kod pocztowy dzielnicy” (`index.html`, Krok 5),
  „wioska” (`lab1-podstawy.html`, Faza 1), „płot i działka” (symulator). Lab 1 pisze „maska podsieci
  decyduje o tym, kto z kim może rozmawiać” – to sugeruje ścianę, którą ćwiczenie M4 obala.
- **Opcje:** (a) „płot i działka” wszędzie + wpis do słownika + nowe zdanie w Lab 1: „maska decyduje,
  czy nadawca wysyła bezpośrednio, czy przez bramę”; (b) zostawić trzy metafory.
- **Rekomendacja:** (a).
- **Skutek braku odpowiedzi:** teksty teorii i Lab 1 zostają bez zmian.
- **Odpowiedź (2026-11-17):** „zgoda wedlug sugesti” → (a)
- **Wykonanie:** `cceb206`.

### PYT-004 · decyzja · zamknięte

- **Kontekst:** raport audytu (makiety 15 ekranów, pomiary, 58 zrzutów) leży w katalogu tymczasowym
  sesji i zniknie po jej końcu.
- **Opcje:** (a) skopiować `raport.md` do `01-sieci/appka/audyt.md` (bez zrzutów, bez commita);
  (b) skopiować razem ze zrzutami; (c) nie zapisywać.
- **Rekomendacja:** (a). Makiety i tabele są w tekście; zrzuty to tylko dowód pomiaru.
- **Skutek braku odpowiedzi:** raport przepada po zamknięciu sesji.
- **Odpowiedź (2026-11-17):** „wszystkie a” → (a)

### PYT-005 · decyzja · zamknięte

- **Kontekst:** szybkie wygrane z audytu nie zmieniają struktury ćwiczeń: (1) krótki nagłówek i ramka
  „Inny świat” jako dymek, (2) ARP: tekst i przyciski obok diagramu, (3) opisy ≤ 40 słów, (4) maska:
  sterowanie poza przykładami w „Tryb swobodny”, (5) pomarańczowy tylko dla Broadcastu, (6) animacja:
  2 cykle i stop. Zmiana (3) zmienia numery kroków ARP, więc wymaga też poprawki odsyłacza w Lab 1.
- **Opcje:** (a) wdrożyć 1–6 teraz, bez commita, z pomiarem „mieści się w 1366×768”; (b) czekać na
  PYT-001–003 i robić od razu serię; (c) wybrać tylko część.
- **Rekomendacja:** (a). Uczniowie dostają lepszą wersję szybko; seria i tak użyje tych samych zmian.
- **Skutek braku odpowiedzi:** nie zmieniam kodu.
- **Odpowiedź (2026-11-17):** „wszystkie a” → (a)

### PYT-006 · decyzja · zamknięte

- **Kontekst:** `kontrakt.md` opisuje pracę nad harnessem SDLC: wymienia repozytoria `mieszkanie` i
  `iso-template-agent`, a sekcja STAN liczy „wymagania i testy negatywne”. Tu pracujemy nad
  materiałami INF.02.
- **Opcje:** (a) wersja 1.2 kontraktu dopasowana do tej pracy (STAN: ćwiczenia, testy, otwarte
  pytania); (b) stosować obecny kontrakt z dopasowaniem w locie.
- **Rekomendacja:** (a), krótka zmiana w rozdz. 3 i 5.
- **Skutek braku odpowiedzi:** stosuję (b) i każde dopasowanie zaznaczam w meldunku.
- **Odpowiedź (2026-11-17):** „zgoda wedlug sugesti” → (a)
- **Wykonanie:** `kontrakt.md` wersja 1.2.

### PYT-007 · decyzja · zamknięte

- **Kontekst:** po szybkich wygranych ARP mieści się w 1366×768 i 1280×720, maska nie: diagram
  kończy się na 898–924 px. Nad diagramem stoją: przykłady z lekcją, pasek „Tryb swobodny” i
  legenda. Zmiana wykracza poza zakres PYT-005.
- **Opcje:** (a) lekcja do prawej kolumny nad decyzją, pasek „Tryb swobodny” i legenda pod
  diagram, diagram 340 px; (b) tylko pasek i legenda pod diagram (szacunek: dół diagramu ~750–776
  px – w 1366×768 na granicy, w 1280×720 nie); (c) zostawić do serii M1–M4.
- **Rekomendacja:** (a) – to układ z audytu (lekcja obok animacji); szacunek: dół diagramu ~680–706
  px, mieści się w obu rozdzielczościach. Do potwierdzenia pomiarem po zmianie.
- **Skutek braku odpowiedzi:** maska wymaga przewijania do diagramu.
- **Odpowiedź (2026-11-17):** „zgoda wedlug sugesti” → (a)
- **Wykonanie:** `cceb206` – pomiar: dół diagramu i lekcji na 662 px w 1366×768 i 1280×720.

### PYT-008 · decyzja · zamknięte

- **Kontekst:** niezacommitowane: szybkie wygrane (kod + 2 strony), `audyt.md`, `rejestr-pytan.md`,
  `HISTORIA_ZMIAN.md`, `plan.md`, Lab 1. `kontrakt.md` i `przyklad.md` to Twoje pliki, też
  niezacommitowane.
- **Opcje:** (a) commit i push moich zmian (2 commity: szybkie wygrane; audyt + rejestr), bez
  `kontrakt.md` i `przyklad.md`; (b) to samo + `kontrakt.md`; (c) poczekać na PYT-007 i
  commitować razem.
- **Rekomendacja:** (b) – kontrakt mówi, że nowa sesja zaczyna od kontraktu i rejestru, więc oba
  powinny być w repo.
- **Skutek braku odpowiedzi:** zmiany zostają tylko na dysku.
- **Odpowiedź (2026-11-17):** „zgoda wedlug sugesti” → (b)
- **Wykonanie:** `cceb206` (kod i treść), drugi commit: audyt, rejestr, kontrakt, plan.
