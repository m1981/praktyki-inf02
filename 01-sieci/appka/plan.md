# Plan: symulatory sieciowe dla Filaru 1

Plan dalszych materiałów po symulatorze ARP. Źródła symulatorów: `01-sieci/appka/` (README tamże).

## Stan (2026-11-17)

| Co                                                                                | Gdzie                                                   | Commit                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| Symulator ARP i Unicast (6 kroków, tablice ARP/MAC, 2 pytania „Sprawdź się”)      | `01-sieci/symulator-arp.html`                           | `e37ef02`                                       |
| Link z teorii (Filar 1, Krok 4) i z Lab 1 Faza 1                                  | `01-sieci/index.html`, `lab1-podstawy.html`             | `e37ef02`, `3a38b64`                            |
| Pasek nawigacji na telefonie w jednej linii                                       | `common.css`                                            | `1c317ef`                                       |
| Konspekt tylko z plików w gicie                                                   | `scripts/konspekt.mjs`                                  | `e3f35b0`                                       |
| Wizualizacja maski: suwak /24–/30, 4 lekcje, decyzja nadawcy, ulica adresów, bity | `01-sieci/symulator-maska.html`                         | `288c31d`                                       |
| Audyt dydaktyczny + szybkie wygrane (PYT-005)                                     | `01-sieci/appka/audyt.md`, oba symulatory               | `cceb206`                                       |
| Układ maski na jednym ekranie (PYT-007), metafora „płot i działka” (PYT-003)      | oba symulatory, `index.html`, Lab 1                     | `cceb206`                                       |
| Seria M1–M4 + Tryb swobodny (PYT-009)                                             | `01-sieci/symulator-maska.html` (`src/maska/series.ts`) | stan pośredni (PYT-014a), przeróbka na plan ZS1 |
| Refaktor, etap A: testy e2e w repo, `model/` + słownik nazw + `net/` (PYT-019)    | `01-sieci/appka/e2e`, `src/model`, `src/net`            | bez commita (PYT-024 otwarte)                   |

## Zasada dydaktyczna

**Każda technologia to odpowiedź na problem, na który uczeń trafił w poprzednim kroku.** Każdy
scenariusz kończy się pytaniem, na które odpowiada następny scenariusz. Symulator ARP kończy się
pytaniem: „O czyj MAC zapyta Laptop przy 8.8.8.8?”.

**Wspólny motyw:** każde urządzenie coś pamięta w tabeli. Laptop: tablica ARP. Switch: tablica MAC.
Router: tablica routingu i tablica NAT. Serwer DHCP: lista dzierżaw. Silnik symulatora pokazuje tabele,
które zapełniają się krok po kroku (`learns` w `simulationConfig.ts`) – ten sam wzorzec dla każdego
scenariusza.

## Kolejność scenariuszy

| #   | Scenariusz                   | Problem na start (motywacja)                                                               | Kluczowa myśl dla ucznia                                                                                    | Lab w repo     |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | -------------- |
| 1   | ✅ **ARP i Unicast**         | Laptop zna IP Serwera NAS, ale do ramki potrzebuje adresu MAC                              | IP mówi _dokąd_, MAC mówi _do kogo w tym kablu_                                                             | Lab 1 Faza 1   |
| 2   | **Do Internetu przez bramę** | „O czyj MAC zapyta Laptop przy 8.8.8.8?”                                                   | ARP o MAC Routera. **Na każdym routerze MAC się zmienia, a adres IP zostaje**                               | Lab 1 Fazy 2–3 |
| 3   | **Tablica routingu**         | Router dostał pakiet. Skąd wie, którym portem go wysłać?                                   | Najdłuższy pasujący prefiks. Brak trasy = Router wyrzuca pakiet                                             | Lab 3 Faza 2   |
| 4   | **VLAN i trunk**             | W symulatorze ARP Router dostał cudzy Broadcast. Przy 200 komputerach każdy słyszy każdego | VLAN dzieli domenę rozgłoszeniową. Trunk (802.1Q) przenosi wiele VLAN-ów jednym kablem dzięki znacznikowi   | Lab 2 Faza 1   |
| 5   | **Router-on-a-Stick**        | Po podziale na VLAN-y księgowość nie widzi drukarki                                        | Ruch między VLAN-ami musi przejść przez L3 – te same zasady co w scenariuszu 2                              | Lab 2 Faza 2   |
| 6   | **DHCP (DORA)**              | Ręczne wpisywanie IP na 200 komputerach jest nierealne                                     | Klient nie ma IP, więc pyta przez Broadcast. Router nie przepuszcza Broadcastów, stąd _ip helper_           | Lab 3 Faza 1   |
| 7   | **DNS**                      | Ludzie pamiętają `www.egzamin.pl`, a nie adresy IP                                         | DNS działa _przed_ ARP. Pełna kolejność: DNS → decyzja L3 → ARP → ramka                                     | Lab 3 Faza 3   |
| 8   | **NAT/PAT**                  | Adresów IPv4 zabrakło, a adresy `10.x` nie istnieją w Internecie                           | Router podmienia IP i port i zapamiętuje to w tablicy NAT – dlatego odpowiedź wraca do właściwego komputera | Lab 3 Faza 4   |

**Poza zakresem INF.02** (CCNA, tylko jako ciekawostka): STP (pętle i burza rozgłoszeniowa przy
zapasowych kablach), TTL w `traceroute`.

## Rekomendacja: następny jest scenariusz 2

- **Największa wartość:** najczęstszy błąd uczniów to pomylenie, co się zmienia na routerze (MAC), a co
  zostaje (IP). Bez tego nie zrozumieją NAT ani VLAN-ów.
- **Najmniejszy koszt:** ta sama topologia plus węzeł „Internet”. Zmiany w silniku:
  1. panel ramki z osobnymi polami nagłówka IP (IP nadawcy, IP odbiorcy) obok pól MAC;
  2. pokazanie, że Router przepisuje nagłówek L2 (nowe MAC nadawcy i odbiorcy, IP bez zmian);
  3. wybór scenariusza (reducer ma już na to miejsce – akcja np. `SELECT_SCENARIO`).
- **Pytanie startowe:** gotowe – symulator ARP kończy się pytaniem o 8.8.8.8.

## Luka w teorii

Lab 3 używa DHCP, DNS i NAT, ale `01-sieci/index.html` nie ma dla nich kroków teorii (są tylko: OSI,
L2, L3, ARP, Subnetting, VLAN, Routing). Scenariusze 6–8 mogą razem z symulatorem uzupełnić trzy
brakujące karty teorii.

## Pomysł: wizualizacja „maska wyznacza granice dla pakietów”

### Analiza

**Najważniejsza poprawka merytoryczna:** maska **nie stawia fizycznej ściany**. Ramka Broadcast
(np. ARP Request) i tak dociera do każdego urządzenia na tym samym Switchu (w tym samym VLAN-ie), bez
względu na maski. Maska to **reguła w głowie nadawcy**: „czy cel jest w mojej sieci?”

- **Tak** → nadawca pyta przez ARP o MAC celu i wysyła ramkę bezpośrednio.
- **Nie** → nadawca pyta przez ARP o MAC bramy i oddaje ramkę Routerowi.

Prawdziwą granicę dla ramek stawia **Router** (i VLAN). Wizualizacja musi więc pokazać dwie warstwy
naraz: **logiczną** (maska = decyzja nadawcy) i **fizyczną** (kabel i Switch = dokąd ramka naprawdę
może dojść). Najciekawsze momenty to te, w których te dwie warstwy się nie zgadzają.

### Projekt: trzy powiązane widoki i jeden suwak maski (/24 … /30)

| Widok                  | Co pokazuje                                                                                                                                | Co uczeń odkrywa                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **A. Linijka bitów**   | IP Laptopa i IP celu w postaci 32 bitów; bity sieci (maska) podświetlone; wynik AND = adres sieci dla obu                                  | Decyzja to porównanie dwóch liczb: „sieci równe / różne”                                       |
| **B. Ulica z płotami** | Oś adresów 10.10.10.0–255, urządzenia jako domki; płoty co rozmiar bloku (/25 → .128, /26 → .64, .128, .192); działka Laptopa podświetlona | Skąd się biorą granice podsieci (wielokrotności rozmiaru bloku), adres sieci i adres Broadcast |
| **C. Topologia**       | Ten sam diagram co w symulatorze ARP; ramka idzie bezpośrednio przez Switch albo objazdem przez Router, zależnie od decyzji z widoku A     | Ten sam kabel, a inna droga – decyduje maska                                                   |

Przykładowe urządzenia na osi: Router `.1`, Serwer NAS `.30`, Laptop `.105`, Drukarka `.130`,
Kamera `.200`.

| Maska                | Co się dzieje (Laptop `.105` wysyła)                                            | Lekcja                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /24                  | Wszyscy w jednej sieci – wszystko bezpośrednio                                  | Punkt wyjścia (symulator ARP)                                                                                                                                                                                                      |
| /25                  | Płot na `.128`. NAS bezpośrednio; Drukarka `.130` i Kamera `.200` – przez bramę | Ten sam Switch, a ruch idzie przez Router                                                                                                                                                                                          |
| /26                  | Laptop w działce `.64–.127`, Router `.1` w działce `.0–.63`                     | **Brama poza moją siecią** – typowy błąd konfiguracji. Brama musi leżeć w sieci hosta (Windows pokazuje ostrzeżenie, Linux odrzuca taką trasę)                                                                                     |
| Pułapka: różne maski | Laptop `/24`, NAS `/26`                                                         | **Ruch asymetryczny:** Laptop uważa NAS za „swojego” i wysyła bezpośrednio. NAS uważa Laptop za „obcego” i odpowiada przez Router. Gdy NAS nie ma bramy, odpowiedź w ogóle nie wraca – „ping nie odpowiada”, choć kabel jest dobry |

### Wykonalność w obecnym silniku

- **Da się.** Węzły (`DeviceNode`), kable i animację ramki (`PacketEdge`) można użyć bez zmian.
- **Nowe:** to nie jest scenariusz z krokami, tylko tryb interaktywny – droga ramki wynika z funkcji
  `isLocal(srcIp, dstIp, mask) = (src & mask) === (dst & mask)`, a nie z danych kroku. Nowy komponent
  z suwakiem + widoki A i B (SVG/HTML, bez React Flow).
- **Szacunek:** średni – mniej więcej tyle co cały symulator ARP. Logika jest prosta; większość pracy
  to czytelne widoki A i B na telefonie.
- **Miejsce w kolejności:** przed scenariuszem 2 albo zaraz po nim (wiąże się z Krokiem 5 teorii:
  Subnetting).

## Projekt ZS1 – firma od pustej kartki (PYT-015–018)

Status: zatwierdzone (PYT-011–018). Kolejność prac: najpierw porządek w kodzie (PYT-019), potem treść.

### Zasada

Jedna firma (ZS1) budowana krok po kroku na **jednej, trwałej mapie**. Każdy krok = jedna decyzja i
jeden nowy element na mapie. Mapa pokazuje wszystkie wcześniejsze decyzje, więc uczeń nie musi ich
pamiętać. Na ekranie widać tylko urządzenia potrzebne w danym kroku (reszta wyszarzona).

### Kroki (jak pracuje sieciowiec)

| #   | Krok                 | Jedna decyzja ucznia                                    | Ćwiczenia, które tu trafiają   |
| --- | -------------------- | ------------------------------------------------------- | ------------------------------ |
| 0   | Zlecenie             | Czego firma potrzebuje? (ludzie, działy, pliki, goście) | –                              |
| 1   | Inwentarz            | Jakie urządzenia są w każdym dziale?                    | –                              |
| 2   | Strefy               | Które urządzenia razem, a które osobno (zaufanie)?      | –                              |
| 3   | Plan adresów         | Jaka podsieć i maska dla strefy?                        | M1–M3, L1–L3                   |
| 4   | Okablowanie          | Router na styku, switch w strefie, porty                | –                              |
| 5   | Adresy stałe i DHCP  | Kto ma stały adres, a kto z puli?                       | –                              |
| 6   | Usługi               | Brama, DNS, DHCP                                        | Lab 3, Windows Lab 1 / 4.5     |
| 7   | Reguły ruchu         | Kto z kim może rozmawiać? (np. goście tylko Internet)   | –                              |
| 8   | Test                 | Dlaczego ping działa albo nie?                          | A1–A4, B1–B2, M4, scenariusz 2 |
| 9   | Dokumentacja         | Mapa firmy jako jedno źródło prawdy                     | `topology.html`                |
| 10  | Firma ZS2 (transfer) | Ten sam proces, inne adresy (np. 10.80.0.0/24 jak CKE)  | arkusze CKE                    |

### Inwentarz (propozycja; reguła hostów: .1 router, .2 switch/AP, .10–.50 stałe, .100–.250 DHCP)

| Strefa         | VLAN | Podsieć         | Urządzenia                                                                               |
| -------------- | ---- | --------------- | ---------------------------------------------------------------------------------------- |
| Serwerownia    | 10   | 192.168.10.0/24 | WIN_SERVER .10 (AD, DNS, DHCP), LINUX_SERVER .20 (WWW), WIN_11 admin .30, Serwer NAS .40 |
| Biuro          | 20   | 192.168.20.0/24 | Drukarka .20, ok. 10 laptopów/PC z DHCP                                                  |
| Księgowość     | 30   | 192.168.30.0/24 | 3 PC z DHCP; drukuje na Drukarce z Biura (przez Router – osobna lekcja)                  |
| Goście (Wi-Fi) | 99   | 192.168.99.0/24 | Access Point .2, telefony gości z DHCP; tylko Internet                                   |
| Monitoring     | 40   | 192.168.40.0/26 | Rejestrator kamer .10, Kamery .11–.14 (stałe adresy, bez DHCP)                           |
| Łącze WAN      | –    | 200.0.0.0/30    | Router .1, operator .2                                                                   |
