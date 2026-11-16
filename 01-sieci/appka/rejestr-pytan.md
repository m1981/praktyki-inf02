# Rejestr pytań

Prowadzi agent zgodnie z [`kontrakt.md`](kontrakt.md) (rozdz. 4). Odpowiedź operatora zapisuję dosłownie.
Źródło pytań 001–006: audyt dydaktyczny symulatorów z 2026-11-16 (raport w katalogu tymczasowym sesji,
zob. PYT-004).

## Przegląd

| ID      | Rodzaj     | Status           | Temat                                                          |
| ------- | ---------- | ---------------- | -------------------------------------------------------------- |
| PYT-001 | decyzja    | zamknięte (a)    | Miejsce serii M1–M4 w kolejności i status gałęzi L oraz P      |
| PYT-002 | decyzja    | zamknięte (a)    | Los obecnych pełnych widoków (ARP, maska)                      |
| PYT-003 | decyzja    | zamknięte (a)    | Jedna metafora maski w Filarze 1 i korekta zdania w Lab 1      |
| PYT-004 | decyzja    | zamknięte (a)    | Zapis raportu audytu do repozytorium                           |
| PYT-005 | decyzja    | zamknięte (a)    | Start szybkich wygranych 1–6 z audytu                          |
| PYT-006 | decyzja    | zamknięte (a)    | Dopasowanie kontraktu do pracy nad materiałami (nie harnessem) |
| PYT-007 | decyzja    | zamknięte (a)    | Układ maski, żeby diagram i lekcja mieściły się na ekranie     |
| PYT-008 | decyzja    | zamknięte (b)    | Commit i push szybkich wygranych, audytu i rejestru            |
| PYT-009 | decyzja    | zamknięte (a)    | Od której serii mikro-ćwiczeń zacząć                           |
| PYT-010 | decyzja    | zamknięte (→014) | Ocena serii M1–M4 i commit                                     |
| PYT-011 | decyzja    | zamknięte (a)    | Jedna sieć firmy: źródło prawdy i plan adresów                 |
| PYT-012 | decyzja    | zamknięte (a)    | Gdzie mieszka plan sieci firmy                                 |
| PYT-013 | decyzja    | zamknięte (a)    | Model fizyczny: switch w każdej strefie czy VLAN-y od początku |
| PYT-014 | decyzja    | zamknięte (a)    | Commit serii M1–M4 jako stanu pośredniego                      |
| PYT-015 | decyzja    | zamknięte (a)    | Rozbudowa planu ZS1, żeby pokazać maski inne niż /24           |
| PYT-016 | decyzja    | zamknięte (a)    | Nowa treść M4: zła maska /16 na Laptopie                       |
| PYT-017 | decyzja    | zamknięte (a)    | Projekt ZS1 „od pustej kartki” jako rama wszystkich ćwiczeń    |
| PYT-018 | decyzja    | zamknięte (a)    | Inwentarz urządzeń firmy ZS1                                   |
| PYT-019 | decyzja    | zamknięte (a)    | Porządek w kodzie przed Projektem ZS1                          |
| PYT-020 | decyzja    | zamknięte (a)    | Jedna aplikacja czy osobne strony na wspólnym silniku          |
| PYT-021 | decyzja    | zamknięte (a)    | Narzędzie testów „mieści się na ekranie”                       |
| PYT-022 | decyzja    | zamknięte (a)    | Format treści lekcji                                           |
| PYT-023 | decyzja    | zamknięte (c)    | Orkiestracja refaktoru: sub-agenci czy kolejna sesja           |
| PYT-024 | decyzja    | zamknięte (a)    | Commity sub-agenta na gałęzi roboczej `refaktor-silnik`        |
| PYT-025 | decyzja    | zamknięte        | Commit dokumentów przed refaktorem                             |
| PYT-026 | decyzja    | zamknięte (a)    | Push commita `dd0c904` na GitHub                               |
| PYT-027 | z-domyslna | zamknięte (a)    | Adres 10.10.10.0/24 w nagłówkach stron poza `model/`           |
| PYT-028 | decyzja    | zamknięte (a)    | Scalenie etapu A do `main` po przeglądzie                      |
| PYT-029 | decyzja    | zamknięte (a)    | Folder i nazwy labów VLAN i podsieci                           |
| PYT-030 | decyzja    | zamknięte (a)    | Zakres przenoszonych plików labów                              |
| PYT-031 | decyzja    | zamknięte (a)    | Push gałęzi `laby-vlan` i szkic PR w publicznym repo           |
| PYT-032 | z-domyslna | zamknięte (a)    | Prettier na plikach labów osobnym commitem                     |

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
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-002 · decyzja · zamknięte

- **Kontekst:** obecne strony pokazują wszystko naraz. Po rozbiciu na serię mogą zniknąć albo zostać
  jako ostatni ekran.
- **Opcje:** (a) zostawić jako „Tryb swobodny” na końcu serii; (b) usunąć.
- **Rekomendacja:** (a). Przydają się przy rzutniku i uczniowi po serii. Szkodzą tylko jako pierwszy
  ekran.
- **Skutek braku odpowiedzi:** nie zaczynam serii mikro-ćwiczeń.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-003 · decyzja · zamknięte

- **Kontekst:** Filar 1 ma trzy metafory maski: „kod pocztowy dzielnicy” (`index.html`, Krok 5),
  „wioska” (`lab1-podstawy.html`, Faza 1), „płot i działka” (symulator). Lab 1 pisze „maska podsieci
  decyduje o tym, kto z kim może rozmawiać” – to sugeruje ścianę, którą ćwiczenie M4 obala.
- **Opcje:** (a) „płot i działka” wszędzie + wpis do słownika + nowe zdanie w Lab 1: „maska decyduje,
  czy nadawca wysyła bezpośrednio, czy przez bramę”; (b) zostawić trzy metafory.
- **Rekomendacja:** (a).
- **Skutek braku odpowiedzi:** teksty teorii i Lab 1 zostają bez zmian.
- **Odpowiedź (2026-11-16):** „zgoda wedlug sugesti” → (a)
- **Wykonanie:** `cceb206`.

### PYT-004 · decyzja · zamknięte

- **Kontekst:** raport audytu (makiety 15 ekranów, pomiary, 58 zrzutów) leży w katalogu tymczasowym
  sesji i zniknie po jej końcu.
- **Opcje:** (a) skopiować `raport.md` do `01-sieci/appka/audyt.md` (bez zrzutów, bez commita);
  (b) skopiować razem ze zrzutami; (c) nie zapisywać.
- **Rekomendacja:** (a). Makiety i tabele są w tekście; zrzuty to tylko dowód pomiaru.
- **Skutek braku odpowiedzi:** raport przepada po zamknięciu sesji.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-005 · decyzja · zamknięte

- **Kontekst:** szybkie wygrane z audytu nie zmieniają struktury ćwiczeń: (1) krótki nagłówek i ramka
  „Inny świat” jako dymek, (2) ARP: tekst i przyciski obok diagramu, (3) opisy ≤ 40 słów, (4) maska:
  sterowanie poza przykładami w „Tryb swobodny”, (5) pomarańczowy tylko dla Broadcastu, (6) animacja:
  2 cykle i stop. Zmiana (3) zmienia numery kroków ARP, więc wymaga też poprawki odsyłacza w Lab 1.
- **Opcje:** (a) wdrożyć 1–6 teraz, bez commita, z pomiarem „mieści się w 1366×768”; (b) czekać na
  PYT-001–003 i robić od razu serię; (c) wybrać tylko część.
- **Rekomendacja:** (a). Uczniowie dostają lepszą wersję szybko; seria i tak użyje tych samych zmian.
- **Skutek braku odpowiedzi:** nie zmieniam kodu.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-006 · decyzja · zamknięte

- **Kontekst:** `kontrakt.md` opisuje pracę nad harnessem SDLC: wymienia repozytoria `mieszkanie` i
  `iso-template-agent`, a sekcja STAN liczy „wymagania i testy negatywne”. Tu pracujemy nad
  materiałami INF.02.
- **Opcje:** (a) wersja 1.2 kontraktu dopasowana do tej pracy (STAN: ćwiczenia, testy, otwarte
  pytania); (b) stosować obecny kontrakt z dopasowaniem w locie.
- **Rekomendacja:** (a), krótka zmiana w rozdz. 3 i 5.
- **Skutek braku odpowiedzi:** stosuję (b) i każde dopasowanie zaznaczam w meldunku.
- **Odpowiedź (2026-11-16):** „zgoda wedlug sugesti” → (a)
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
- **Odpowiedź (2026-11-16):** „zgoda wedlug sugesti” → (a)
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
- **Odpowiedź (2026-11-16):** „zgoda wedlug sugesti” → (b)
- **Wykonanie:** `cceb206` (kod i treść), drugi commit: audyt, rejestr, kontrakt, plan.

### PYT-009 · decyzja · zamknięte

- **Kontekst:** szybkie wygrane wdrożone; kolejność serii ustalona w PYT-001a. Seria to już
  implementacja nowych ekranów (makiety: `audyt.md`, rozdz. 5).
- **Opcje:** (a) najpierw M1–M4 (maska); (b) najpierw A1–A4 + B1–B2 (ARP i Switch); (c) wstrzymać
  serię.
- **Rekomendacja:** (a). Maska była najbardziej przeciążona (18 pojęć, z czego 4 potrzebne do celu),
  a ARP po szybkich wygranych już mieści się na ekranie. M4 prowadzi prosto do scenariusza 2.
- **Skutek braku odpowiedzi:** nie zaczynam serii.
- **Odpowiedź (2026-11-16):** „a i wtedy obacze sam jak to wyglada” → (a); operator obejrzy wynik przed commitem.
- **Wykonanie:** seria M1–M4 gotowa, bez commita (czeka na ocenę operatora).

### PYT-010 · decyzja · zamknięte (rozstrzygnięte przez PYT-011–014)

- **Kontekst:** seria M1–M4 działa lokalnie (`01-sieci/symulator-maska.html`), bez commita. Operator
  ogląda ją sam.
- **Opcje:** (a) akceptuję – commit i push (1 commit); (b) uwagi do poprawy, potem commit;
  (c) odrzucam serię – wracam do wersji z `cceb206`.
- **Rekomendacja:** (b) albo (a) – zależy od oglądu; uwagi najlepiej jako lista „ćwiczenie – co
  zmienić”.
- **Skutek braku odpowiedzi:** zmiany zostają tylko na dysku.
- **Odpowiedź (2026-11-16):** „Lepiej ale potrzeba jeszcze pracy. zacznijmy moze od ustalenia jednej i ostatecznej sieci z podsieciami ktore beda trzonem cwiczen” → nie (a); praca trwa, najpierw jedna sieć (PYT-011–013). Węższe pytanie o commit stanu pośredniego: PYT-014.

### PYT-011 · decyzja · zamknięte

- **Kontekst:** dziś materiały używają co najmniej 5 różnych adresacji: VirtualBox 192.168.10.0/24
  (`topology.html`), Lab 1 192.168.1.0/24 + 192.168.2.0/24, Lab 2–3 192.168.10/20.0/24 + WAN
  200.0.0.0/30, symulatory 10.10.10.0/24, infografiki 10.0.x + 192.168.99.0/24. Arkusze CKE
  2021–2026 używają wszystkich trzech pul prywatnych (10/8, 172.16/12, 192.168/16) i masek /8–/25.
- **Opcje:** (a) firma ZS1 na liczbach z labów: 192.168.&lt;VLAN&gt;.0/24 – Serwerownia 10, Biuro 20,
  Księgowość 30, Goście 99; WAN 200.0.0.0/30; w każdej podsieci ten sam układ hostów (.1 router,
  .2 switch, .10–.50 stałe, .100–.250 DHCP); (b) infografika „4 strefy” (10.0.10/20/30 +
  192.168.99); (c) „Ściąga SOHO” – jedna płaska 10.10.10.0/24; (d) nowy plan 10.10.&lt;VLAN&gt;.0/24
  tylko dla symulatorów, laby bez zmian.
- **Rekomendacja:** (a). Maszyny z VirtualBox zachowują adresy (.10, .20, .30, DHCP .100–.150) –
  zero zmian w labach VirtualBox i zrzutach. Lab 2–3 już pasują. Znika ramka „Inny świat”.
- **Skutek braku odpowiedzi:** nie zmieniam adresów nigdzie.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-012 · decyzja · zamknięte

- **Kontekst:** README: „Sieć opisuje tylko `topology.html`”. Dziś opisuje on tylko świat VirtualBox.
- **Opcje:** (a) nowa sekcja na górze `topology.html`: „Plan sieci firmy ZS1 (widok z góry)”;
  fazy VirtualBox jako zbliżenie na Serwerownię; (b) osobna strona `siec-firmy.html`.
- **Rekomendacja:** (a) – jedno źródło prawdy, zgodne z regułą README.
- **Skutek braku odpowiedzi:** plan zostaje w rejestrze, bez strony.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-013 · decyzja · zamknięte

- **Kontekst:** strefy można połączyć fizycznie (osobny switch w każdej, router z portem na strefę)
  albo logicznie (jeden switch, VLAN-y, Router-on-a-Stick).
- **Opcje:** (a) najpierw fizycznie: switch w każdej strefie, router na styku; potem Lab 2 pokazuje
  to samo na VLAN-ach – te same adresy; (b) VLAN-y od początku.
- **Rekomendacja:** (a) – granica strefy = ściana pokoju = port routera; najłatwiejsze do zobaczenia.
- **Skutek braku odpowiedzi:** symulatory i rysunki zakładają (a) tymczasowo.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-014 · decyzja · zamknięte

- **Kontekst:** węższe pytanie z PYT-010. Seria M1–M4 jest lepsza od wersji opublikowanej, ale
  przejdzie przeróbkę na nowe adresy.
- **Opcje:** (a) commit i push teraz jako stan pośredni; (b) trzymać na dysku do przeróbki.
- **Rekomendacja:** (a) – uczniowie od razu dostają lepszą wersję, praca jest zabezpieczona.
- **Skutek braku odpowiedzi:** zmiany zostają tylko na dysku.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)
- **Wykonanie:** commit serii M1–M4 jako stanu pośredniego `bb21569`.

### PYT-015 · decyzja · zamknięte

- **Kontekst:** pytanie operatora: czy da się rozbudować sieć bez psucia planu i pokazać maski jako
  granice; czy dziś robi się to jeszcze, czy tylko VLAN-ami. VLAN i podsieć działają w parze (jeden
  VLAN = jedna podsieć z maską i bramą). W małych sieciach prywatnych normą jest /24 na VLAN; inne
  maski pojawiają się na łączu do Internetu (/30, /29), w podsumowaniach („cała firma” /16) i na
  egzaminie (CKE: /8, /16, /25).
- **Opcje:** (a) rozbudowa bez zmiany 4 stref: widoczne łącze WAN 200.0.0.0/30, widok „cała firma”
  192.168.0.0/16 z płotami /24 między strefami, nowa strefa Monitoring (kamery) VLAN 40
  192.168.40.0/26 ze stałymi adresami; (b) tylko WAN /30 + widok /16, bez nowej strefy; (c) bez
  rozbudowy – maski spoza /24 tylko w ćwiczeniach L1–L3.
- **Rekomendacja:** (a). Monitoring daje w planie prawdziwe miejsce na maskę mniejszą niż /24
  (egzamin), a nie łamie żadnego adresu.
- **Skutek braku odpowiedzi:** plan w `topology.html` zapisuję w wersji 4 strefy + WAN /30.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-016 · decyzja · zamknięte

- **Kontekst:** przy switchu w każdej strefie (PYT-013a) obecna lekcja M4 („Broadcast dociera za
  płot”) traci sens – płot pokrywa się ze ścianą pokoju, a prawdziwą ścianą jest Router.
- **Opcje:** (a) nowe M4 „Zła maska”: Laptop w Biurze ma maskę /16, uważa Serwer NAS z Serwerowni za
  „swojego”, pyta przez ARP – nikt nie odpowiada, bo ARP nie przechodzi przez Router; (b) usunąć M4.
- **Rekomendacja:** (a) – pokazuje naraz: maska to reguła nadawcy, a ścianą jest Router.
  Założenie do notatki dla nauczyciela: Router ma wyłączone proxy ARP (zalecane; domyślnie bywa
  włączone, np. w Cisco).
- **Skutek braku odpowiedzi:** M4 zostaje w obecnej wersji do czasu przeróbki serii.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-017 · decyzja · zamknięte

- **Kontekst:** propozycja operatora: pokazać pracę sieciowca end to end, zaczynając od pustej kartki.
  Szkic kroków 0–10: `plan.md`, sekcja „Projekt ZS1”.
- **Opcje:** (a) Projekt ZS1 jako rama: jedna trwała mapa, każdy krok = jedna decyzja, istniejące
  ćwiczenia wpięte w kroki 3 i 8, na końcu firma ZS2 z innymi adresami (transfer na egzamin);
  (b) zostać przy osobnych seriach bez ramy; (c) swobodny edytor sieci (przeciągnij i upuść).
- **Rekomendacja:** (a). Rama daje sens kolejności, a jedna decyzja na krok trzyma obciążenie
  poznawcze nisko. (c) odradzam: duże obciążenie dla ucznia i duży koszt budowy.
- **Skutek braku odpowiedzi:** pracuję dalej nad seriami bez ramy.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-018 · decyzja · zamknięte

- **Kontekst:** inwentarz urządzeń ZS1 (tabela w `plan.md`, sekcja „Projekt ZS1”): Serwer NAS .40,
  Drukarka w Biurze .20, Księgowość bez własnej drukarki, Monitoring z rejestratorem i 4 kamerami.
- **Opcje:** (a) przyjąć tabelę jako część planu ZS1; urządzenia pokazujemy dopiero w kroku, który
  ich potrzebuje; (b) tylko urządzenia używane w obecnych ćwiczeniach; (c) poprawki operatora.
- **Rekomendacja:** (a).
- **Skutek braku odpowiedzi:** plan w `topology.html` ma tylko strefy i urządzenia z labów.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-019 · decyzja · zamknięte

- **Kontekst:** przegląd kodu (`architektura.md`, rozdz. 1): 3 modele sieci, 3 ekrany z własnym
  układem, 3 maszyny stanów, rozgałęzienia po rodzaju widoku, treść w kodzie, wymiary w 2 plikach CSS.
- **Opcje:** (a) migracja według `architektura.md`, rozdz. 3, kroki 1–6, każdy z dowodem „wygląda
  tak samo”; (b) tylko kroki 1–3 (testy e2e, model, silnik), ARP później; (c) bez porządków.
- **Rekomendacja:** (a). Krok 6 (nowe adresy ZS1) staje się zmianą jednego pliku danych.
- **Skutek braku odpowiedzi:** nie zmieniam kodu.
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-020 · decyzja · zamknięte

- **Kontekst:** strony `symulator-arp.html` i `symulator-maska.html` są podlinkowane z teorii i Lab 1.
- **Opcje:** (a) osobne cienkie strony na wspólnym silniku + nowa strona Projektu ZS1; stare linki
  działają; (b) jedna aplikacja z rozdziałami pod `#`, stare strony przekierowują.
- **Rekomendacja:** (a) – linki z labów zostają, każda strona ładuje tylko swoją treść.
- **Skutek braku odpowiedzi:** zakładam (a).
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-021 · decyzja · zamknięte

- **Kontekst:** kryterium audytu „mieści się w 1366×768” sprawdzam dziś skryptami poza repo.
- **Opcje:** (a) puppeteer-core + Chrome zainstalowany na Macu (już działa, nic nie pobiera);
  (b) Playwright (standard, ale pobiera własne przeglądarki, kilkaset MB).
- **Rekomendacja:** (a) – wystarczy do jednego autora; ścieżkę do Chrome opisuję w README.
- **Skutek braku odpowiedzi:** zakładam (a).
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-022 · decyzja · zamknięte

- **Kontekst:** treść lekcji (teksty kroków) trafi do `content/`. Pytanie, czy chcesz ją redagować
  sam.
- **Opcje:** (a) pliki TypeScript z typami – edytujesz tylko teksty w cudzysłowach, test od razu
  łapie błędy (limit słów, nieznane urządzenie); (b) Markdown/YAML – wygodniejsze do pisania, ale
  wymaga parsera i słabiej łapie błędy.
- **Rekomendacja:** (a).
- **Skutek braku odpowiedzi:** zakładam (a).
- **Odpowiedź (2026-11-16):** „wszystkie a” → (a)

### PYT-023 · decyzja · zamknięte

- **Kontekst:** operator: „przemyśl jak zorkiestrować ten refaktor za pomocą subagenta(ów), bo
  kończy nam się sesja”. Brief: `zlecenie-refaktor.md`. Sub-agent startuje bez kontekstu (czyta
  ~35–50 tys. tokenów kodu i dokumentów), więc nie jest tańszy od pracy w tej sesji; zysk to
  ochrona kontekstu tej sesji i praca w tle. Kroki migracji zależą od siebie, więc równoległość
  nic nie daje. Sub-agent w tle kończy się razem z tą sesją.
- **Opcje:** (a) dwóch sub-agentów po kolei w osobnej kopii repo (worktree): A = kroki 1–2,
  B = kroki 3–5; przegląd po każdym; (b) jeden sub-agent na kroki 1–5; (c) bez sub-agentów: nowa
  sesja zaczyna od `zlecenie-refaktor.md`.
- **Rekomendacja:** (a), jeśli sesja ma jeszcze zapas; (c), jeśli ma się skończyć w ciągu godziny.
  W obu przypadkach postęp jest bezpieczny dzięki commitom na gałęzi roboczej (PYT-024).
- **Skutek braku odpowiedzi:** nie uruchamiam sub-agentów.
- **Odpowiedź (2026-11-16):** „mamy 600k tokenow na liczniku. 23c” → (c): refaktor w nowej sesji od `zlecenie-refaktor.md`, bez sub-agentów.

### PYT-024 · decyzja · zamknięte

- **Kontekst:** kontrakt wymaga zgody na commit. Bez commitów przerwana praca przepada. Po PYT-023c dotyczy wykonawcy w nowej sesji, nie sub-agenta.
- **Opcje:** (a) sub-agent commituje na lokalnej gałęzi `refaktor-silnik`, jeden commit na krok,
  bez push i bez scalania do `main`; (b) sub-agent nie commituje, zostawia zmiany na dysku.
- **Rekomendacja:** (a).
- **Skutek braku odpowiedzi:** sub-agent nie commituje.
- **Stan (2026-11-16):** etap A wykonany w nowej sesji na polecenie operatora („wykonaj etap A”),
  bez commita; zmiany leżą na dysku w katalogu roboczym gałęzi `main`.
- **Odpowiedź (2026-11-16):** „wszystko a” → (a)

### PYT-025 · decyzja · zamknięte

- **Kontekst:** dokumenty refaktoru (`architektura.md`, `zlecenie-refaktor.md`, rejestr, plan) i
  skrypty pomiarowe nie były w repo – nowa sesja ani kopia repo by ich nie widziały.
- **Odpowiedź (2026-11-16):** „zrob commit przed refaktorem” → commit (bez push).

### PYT-026 · decyzja · zamknięte

- **Kontekst:** commit `dd0c904` (dokumenty refaktoru, zlecenie, skrypty pomiarowe) jest tylko
  lokalnie.
- **Opcje:** (a) push na `main`; (b) zostawić lokalnie.
- **Rekomendacja:** (a) – kopia zlecenia poza komputerem.
- **Skutek braku odpowiedzi:** commit zostaje lokalnie.
- **Odpowiedź (2026-11-16):** „wszystko a” → (a)

### PYT-027 · z-domyslna · zamknięte

- **Kontekst:** po etapie A adresy IP i MAC są wpisane tylko w `src/model/siec.ts` (pilnuje tego
  test). Wyjątek: stałe nagłówki stron `arp.html` i `maska.html` z ramką „Przykładowe biuro”
  i adresem 10.10.10.0/24. To zwykły HTML, nie może czytać modelu.
- **Opcje:** (a) zostawić do etapu C – ramka i tak znika po przejściu na plan ZS1 (PYT-011a);
  (b) już teraz generować ramkę z modelu wtyczką w `vite.config.ts`.
- **Rekomendacja:** (a) – praca nad (b) przepadłaby w etapie C.
- **Skutek braku odpowiedzi:** pracuję według (a); w kroku 6 adres w nagłówkach trzeba zmienić
  albo usunąć ręcznie.
- **Odpowiedź (2026-11-16):** „wszystko a” → (a)

### PYT-028 · decyzja · zamknięte

- **Kontekst:** przegląd etapu A (2026-11-16): weryfikacja agenta potwierdzona (tsc, 87/87 testów,
  e2e 63 pomiary, 42 stany identyczne z `dd0c904`). Uwagi do etapu B i C w `zlecenie-refaktor.md`,
  sekcja „Uwagi z przeglądu etapu A”; żadna nie blokuje scalenia.
- **Opcje:** (a) po commitach na `refaktor-silnik` (PYT-024) scalić etap A do `main` (bez zmian dla
  ucznia) i wypchnąć razem z `dd0c904` (PYT-026); (b) trzymać gałąź do końca etapu B.
- **Rekomendacja:** (a) – krótko żyjąca gałąź, mniejsze ryzyko konfliktów; uczeń nie widzi zmian.
- **Skutek braku odpowiedzi:** etap A zostaje na gałęzi.
- **Odpowiedź (2026-11-16):** „wszystko a” → (a)

### PYT-029 · decyzja · zamknięte

- **Kontekst:** dwa laby (podsieci, VLAN) powstały w osobnym repozytorium roboczym sesji. Mają
  trafić do `praktyki-inf02` z historią. Konwencja repo: `index.html` w filarze to teoria.
- **Opcje:** (a) `01-sieci/laby-vlan/`, `index.html` → `podsieci.html` w całej historii;
  (b) osobny folder w katalogu głównym, np. `laby-interaktywne/`.
- **Rekomendacja:** (a) – tematycznie to Filar 1; nazwa nie myli się ze stroną teorii.
- **Skutek braku odpowiedzi:** nic nie trafia do repo.
- **Odpowiedź (2026-11-17):** „wszystko tak jak zelecasz” → (a)

### PYT-030 · decyzja · zamknięte

- **Kontekst:** w repozytorium roboczym są oba laby, scenariusze `.md` i źródła talii Slides do
  Kłopotu 2 (nieaktualne względem obecnej animacji).
- **Opcje:** (a) przenieść wszystko; (b) bez `prezentacja-vlan/`.
- **Rekomendacja:** (a) – pełna historia; talię można usunąć później.
- **Skutek braku odpowiedzi:** nic nie trafia do repo.
- **Odpowiedź (2026-11-17):** „wszystko tak jak zelecasz” → (a)

### PYT-031 · decyzja · zamknięte

- **Kontekst:** repo jest publiczne i ma GitHub Pages z `main`. Wypchnięta gałąź i PR są widoczne
  od razu; na Pages laby trafią dopiero po scaleniu.
- **Opcje:** (a) push gałęzi `laby-vlan` i szkic PR teraz; (b) wstrzymać push.
- **Rekomendacja:** (a) – przegląd w PR, `main` bez zmian do scalenia.
- **Skutek braku odpowiedzi:** gałąź zostaje lokalnie.
- **Odpowiedź (2026-11-17):** „wszystko tak jak zelecasz” → (a)

### PYT-032 · z-domyslna · zamknięte

- **Kontekst:** hook pre-commit formatuje Prettierem pliki w commicie. Pliki labów nie były
  formatowane.
- **Opcje:** (a) Prettier na nowych plikach osobnym commitem; (b) zostawić bez formatowania.
- **Rekomendacja:** (a) – zgodność z repo; działanie sprawdzone w przeglądarce.
- **Skutek braku odpowiedzi:** pracuję według (a).
- **Odpowiedź (2026-11-17):** „wszystko tak jak zelecasz” → (a)
