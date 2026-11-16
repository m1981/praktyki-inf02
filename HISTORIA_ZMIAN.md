# Historia zmian

Decyzje i plany zmian w materiałach. Najnowsze na górze. Szczegóły techniczne są w historii gita.

## 2026-11-17 — Jedna metafora maski, układ maski, kontrakt 1.2

- **Metafora maski (PYT-003a):** w całym Filarze 1 „płot i działka”: płot = granica podsieci,
  działka = podsieć. Zmienione: analogia w `01-sieci/index.html` (Krok 5; było „kod pocztowy
  dzielnicy”), dwa wnioski w Lab 1 (było „wioska”). Wniosek Fazy 1 nie mówi już, że maska decyduje,
  „kto z kim może rozmawiać” (sugerowało ścianę) – maska decyduje, czy nadawca wysyła bezpośrednio,
  czy przez bramę. Nowy wiersz w Słowniku pojęć (wpis 2026-11-02 „Panel ekspertów”, sekcja „Decyzje”).
- **Układ maski (PYT-007a):** lekcja w prawej kolumnie nad decyzją nadawcy, legenda i „Tryb swobodny”
  pod diagramem, diagram 340 px. Przykłady, diagram i lekcja mieszczą się w 1366×768 i 1280×720
  (dół na 662 px). Naprawione: prawa kolumna wystawała poza stronę.
- **Kontrakt pracy (PYT-006a):** `01-sieci/appka/kontrakt.md` w wersji 1.2, dopasowany do pracy nad
  materiałami; rejestr decyzji: `01-sieci/appka/rejestr-pytan.md`.

## 2026-11-17 — Audyt dydaktyczny symulatorów i szybkie wygrane

- **Audyt** (ekspert od komunikacji wizualnej, sub-agent): oba ćwiczenia uczą kilku tematów naraz
  (ARP: 19 pojęć, maska: 18) i nie mieszczą się na ekranie. Raport z makietami serii mikro-ćwiczeń:
  `01-sieci/appka/audyt.md`. Decyzje: `01-sieci/appka/rejestr-pytan.md` (PYT-001, 002, 004, 005).
- **Szybkie wygrane (PYT-005):** krótki nagłówek, ramka „Inny świat” jako rozwijana linia; ARP: tekst
  kroku i przyciski obok diagramu – każdy krok mieści się w 1366×768 i 1280×720 bez przewijania;
  opisy kroków i lekcji ≤ 40 słów (test w `pnpm build`); dawny Krok 4 ARP rozdzielony na dwa
  (ARP Reply → Switch, Switch → Laptop), więc ARP ma teraz Kroki 1–6 – odsyłacz w Lab 1 Fazie 1
  wskazuje Krok 6; maska: sterowanie w „Trybie swobodnym” (4 widoczne elementy zamiast 11);
  pomarańczowy tylko dla Broadcastu; animacja ramki: 2 cykle i stop.
- **Usunięte z ekranu:** zdanie o tablicy ARP Serwera NAS (tablicy nie było widać) i zdanie o reakcji
  Windows/Linux na bramę spoza sieci (lekcja maski 3).

## 2026-11-17 — Wizualizacja maski podsieci (Filar 1)

- **Nowa strona `01-sieci/symulator-maska.html`:** suwak maski /24–/30, wybór celu (Serwer NAS,
  Drukarka, Kamera), kierunek „Tam / Z powrotem”, pułapka „różne maski”. Trzy widoki: diagram (droga
  ramki: bezpośrednio albo objazd przez Router), ulica adresów z płotami co rozmiar bloku, bity
  ostatniego oktetu. 4 gotowe lekcje: /24 jedna sieć, /25 płot na .128, /26 brama za płotem,
  pułapka (ruch asymetryczny). Link z teorii: Filar 1, Krok 5 (Subnetting).
- **Decyzja merytoryczna:** strona wprost mówi, że maska **nie** stawia fizycznej ściany – Broadcast
  dociera do wszystkich w Switchu. Maska to reguła nadawcy (bezpośrednio czy przez bramę), a
  przejście między sieciami zapewnia Router. Uproszczenie: Router ma adres w każdej podsieci (jak
  Router-on-a-Stick); brama Laptopa jest stała (10.10.10.1), żeby pokazać błąd „brama za płotem”.
- **Kod:** wspólny silnik diagramu w `appka/src/sim/` (ARP i maska), testy logiki (Vitest) w
  `pnpm build`. Etykieta roli urządzenia przeniesiona do rogu karty – nie zasłania już strzałek.

## 2026-11-15 — Konspekt tylko z plików w gicie

- **`scripts/konspekt.mjs`** bierze listę stron z `git ls-files` (pliki zacommitowane i dodane przez
  `git add`), a nie z dysku. Robocze, niezacommitowane pliki HTML nie trafiają już do `KONSPEKT.md`
  jako martwe linki (tak trafił `01-sieci/infografiki/siec.html` – wpis usunięty).

## 2026-11-13 — Symulator ARP i Unicast (Filar 1)

- **Nowa strona `01-sieci/symulator-arp.html`:** interaktywny diagram biura (Laptop, Switch,
  Router, Serwer NAS, sieć `10.10.10.0/24`). Uczeń klika „Następny krok” i widzi: decyzję L3, ARP
  Request (Broadcast), rozesłanie ramki przez Switch, ARP Reply (Unicast), wysłanie danych. Obok:
  pola ramki oraz tablica ARP Laptopa i tablica MAC Switcha, które zapełniają się krok po kroku. Na
  końcu 2 pytania „Sprawdź się”. Link z teorii: Filar 1, Krok 4 (Protokół ARP).
- **Technologia:** źródła w `01-sieci/appka/` (React + TypeScript + React Flow, Vite). `pnpm build`
  tworzy **jeden plik HTML** z wbudowanym JS – działa z dysku i na GitHub Pages, bez serwera. Plik
  wynikowy jest commitowany i nie wolno go edytować ręcznie (ostrzeżenie w 2. linii pliku).
- **Hooki:** wynikowy plik jest w `.prettierignore` (Prettier nie formatuje zminifikowanego kodu);
  `scripts/konspekt.mjs` pomija katalog `appka`.
- **Inny świat:** strona ma ramkę „Inny świat” – adresy symulatora nie dotyczą `topology.html`.

## 2026-11-06 — Karty LAN1/LAN2, forwarder DNS z kontrolą, schemat Fazy 2

- **Karty LAN1 i LAN2 (Windows Lab 1, Krok 0B):** przed utworzeniem zespołu `LAN12` uczeń
  zmienia nazwy `Ethernet 2` (Karta 2) ➔ `LAN1` i `Ethernet 3` (Karta 3) ➔ `LAN2`. Powód: arkusz
  INF.02 z czerwca 2025 (zad. 6) i jego zasady oceniania punktują nazwy LAN1/LAN2 w tym samym
  kryterium co zespół. Lab 5b sprawdza teraz także te nazwy. Zrzut
  `img/server-setup-02-nic-teaming.jpg` pokazuje jeszcze „Ethernet 2/3” – do podmiany (pozycja 14
  w `ZRZUTY_EKRANU.md`).
- **Forwarder DNS (Windows Lab 1, Kroki 0D i 2b):** na hoście z Windowsem NAT VirtualBoxa podaje
  gościowi DNS hosta (zaobserwowane: `192.168.1.1`), a nie `10.0.2.3`. Nie mamy pewności, że
  `10.0.2.3` odpowie na każdym laptopie. Dlatego: forwarder `10.0.2.3` + kontrola w kolumnie
  _Validated_; przy błędzie uczeń wpisuje adres DNS Karty 1 zapisany w Kroku 0D. Sprawdzenie:
  `nslookup google.com`. Integracja Lab 1 nie podaje już adresu forwardera.
- **`topology.html`, Faza 2:** schemat połączeń po Windows Lab 1 (SVG): osobny NAT każdej maszyny,
  zespół LAN12 z LAN1/LAN2, Kabel wypięty na WIN_11, przełącznik INF02-LAN.
- **Do sprawdzenia:** czy `10.0.2.3` przechodzi walidację na typowym laptopie ucznia. Jeśli tak
  na wszystkich – zostawić; jeśli nie – rozważyć `VBoxManage modifyvm WIN_SERVER --natdnsproxy1 on`
  w Dniu 0.

## 2026-11-03 — Nowe nazwy maszyn i słownik w labach (punkt 8)

### Decyzja: nazwy maszyn

| Było         | Jest           | Nazwa hosta (bez zmian)                  |
| ------------ | -------------- | ---------------------------------------- |
| INF02-SERWER | `WIN_SERVER`   | `SERWER-01`                              |
| INF02-KLIENT | `WIN_11`       | `KLIENT-01`                              |
| INF02-LINUX  | `LINUX_SERVER` | `serwer-linux` ➔ `STACJAX` (Linux Lab 4) |

- Nowe nazwy obowiązują wszędzie: nazwy maszyn w VirtualBox, tekst labów, `topology.html`,
  `setup.html`, README, prompty zrzutów. Stare nazwy zamienione w całym repo (288 wystąpień).
- **Nazwy hostów zostają bez zmian:** znak `_` jest niedozwolony w nazwach hostów DNS i Active
  Directory, a egzamin wymaga konkretnych nazw.
- `INF02-LAN` (nazwa sieci wewnętrznej) bez zmian.

### Punkt 8 – słownik w labach ✅ wykonane

- 76 zdań, w których nazwa systemu oznaczała konkretną maszynę: 72 zamienione, 4 zostawione
  (treść strony „Witaj z Linuxa!”, sytuacja egzaminacyjna „stacja robocza”, nazwa przedmiotu).
- Poprawki ręczne: IIS w Linux Lab 10 ➔ `WIN_SERVER` (nie `WIN_11`); „kopiuj-wklej z Windowsa” w
  setupie Ubuntu ➔ „z Twojego laptopa”; gramatyka („z WIN_11”, „WIN_11 pobrał”).
- Bez zmian: cytaty CKE (`exam-reference`), strony z teorią (`index.html`), nazwy produktów
  („Zapora Windows”).
- **Sprawdzenie:** `python3 -I scripts/slownik-kandydaci.py` ➔ „Razem kandydatów: 0”. Skrypt ma listę
  `KEEP` świadomie zostawionych zdań.

## 2026-11-03 — Netplan w Integracji, zasady dla autorów, plan punktów 8–10

### Wykonane

- **Integracja Lab 1 i 2:** zamiast „wejdź w ustawienia karty sieciowej” – pełny plik Netplan do
  wpisania, komenda sprawdzająca i oczekiwany wynik. Dwie nowe linijki:
  - `use-dns: no` na `enp0s3` – Linux pyta o nazwy tylko WIN_SERVER (usuwa ryzyko, że DNS
    VirtualBoxa `10.0.2.3` odpowie „nie ma takiej nazwy” dla `www.egzamin.local`);
  - `optional: true` na `enp0s3` – start Ubuntu nie czeka 2 minuty, gdy kabel Karty 1 jest wypięty.
- **README:** sekcja „Zasady dla autorów” (sieć tylko w `topology.html`, ramka „Faza N”, bloki
  komend jako `<pre>`, słownik, zapis decyzji) + gotowe szablony ramki fazy i bloku komend.

### Plan (do akceptacji)

Kolejność: **10 ➔ 9 ➔ 8** (od najmniejszego). Każdy punkt to osobny commit.

#### Punkt 10 – usunięcie nieużywanego obrazu ✅ wykonane

1. Sprawdź: `grep -r vbox-client-nic1-internal --include=*.html .` zwraca 0 wyników.
2. `git rm img/vbox-client-nic1-internal.jpg`.
3. Odhacz pozycję w `ZRZUTY_EKRANU.md` („Po dodaniu plików”).

**Gotowe, gdy:** plik nie istnieje, a żadna strona nie pokazuje pustego obrazka.

#### Punkt 9 – nazwa hosta `KLIENT-01` ✅ wykonane

1. **Windows Lab 1, Krok 3:** w jednym oknie _System Properties ➔ Change_ ustaw jednocześnie
   _Computer name_: `KLIENT-01` i _Domain_: `zs1.local` (jeden restart zamiast dwóch).
2. **Ramka weryfikacji egzaminacyjnej** w Lab 1: oczekiwana pełna nazwa `KLIENT-01.zs1.local`.
3. **`topology.html`:** tabela „Stałe elementy” – nazwa hosta WIN*11 = `KLIENT-01` (Windows
   Lab 1); Faza 2 ➔ \_Zmiany w trakcie fazy* ➔ Windows Lab 1.
4. Sprawdź, czy żaden lab nie odwołuje się do starej, losowej nazwy (`DESKTOP-`).

**Gotowe, gdy:** każda z 3 maszyn ma nazwę hosta zapisaną w `topology.html`.

#### Punkt 8 – słownik pojęć w labach ✅ wykonane (wpis wyżej)

Pomiar 2026-11-03 (bez cytatów CKE): „Linux” 170×, „serwer” 93×, „Ubuntu” 47×, „Windows Server”
40×, „Windows 11” 21×, „stacja robocza” 17×, „Adapter N” 15×. **Automatyczna zamiana jest
niedopuszczalna** – większość wystąpień to nazwa systemu w teorii („w Linuxie komenda …”).

**Reguła zamiany:**

| Zamieniamy (konkretna maszyna w naszym labie)                      | Nie zamieniamy                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| „Przejdź na Windowsa”, „na Ubuntu wpisz”, „stacja robocza”         | system w teorii: „w Linuxie”, „Windows Server ma rolę” |
| „Windows Server” jako maszyna, na której coś klikasz               | cytaty CKE (`exam-reference`) i omówienia arkuszy      |
| „Adapter 2” w tekście (zostaje tylko jako ścieżka menu VirtualBox) | nazwy produktów przy pobieraniu i instalacji (Dzień 0) |

Forma: pierwsze wystąpienie w labie `WIN_11`, kolejne `WIN_11`.

1. **Skrypt kandydatów:** lista zdań, w których nazwa systemu stoi przy czasowniku polecenia
   („przejdź”, „otwórz”, „wpisz”, „na …:”) lub fraza „stacja robocza” – poza `exam-reference`.
   Wynik: tabela _plik | linia | zdanie | proponowana zamiana_ (szacunkowo 60–90 wierszy).
2. **Przegląd tabeli** – akceptacja lub odrzucenie każdego wiersza.
3. **Wdrożenie dział po dziale:** Linux ➔ Windows ➔ Integracja (3 commity).

**Gotowe, gdy:** skrypt kandydatów zwraca 0 niezaakceptowanych wierszy, a „stacja robocza”
występuje tylko w cytatach CKE.

## 2026-11-02 — Jedna topologia dla wszystkich labów

Analiza administratora sieci laboratoryjnej: laby zakładały różne topologie (7 połączeń nie
działało, 6 działało warunkowo).

### Zasada

- **`topology.html` jest jedynym źródłem prawdy.** Okablowanie w VirtualBox jest stałe od Dnia 0.
  Konfiguracja rośnie w 4 fazach. Każda faza ma: listę labów, włączone maszyny, _Stan na start_ i
  _Zmiany w trakcie fazy_ (lab po labie).
- **Każdy lab ma na początku ramkę „Faza N”**: link do fazy, „Włącz”, „Wyłącz”, „Wymagane
  wcześniej”. Stare ramki „Pre-flight” z własnymi opisami kart usunięte.
- **„Maszyna wyłączona”** (maszyna nie działa) i **„Kabel wypięty”** (Karta 1 odłączona w
  _Devices ➔ Network_) to dwa różne stany – zawsze nazywane tymi słowami.

### Decyzje

| Faza            | Laby                          | Włączone maszyny                       |
| --------------- | ----------------------------- | -------------------------------------- |
| 1 – Linux       | Linux Lab 0–11                | LINUX_SERVER (+ WIN_11 od Linux Lab 5) |
| 2 – AD          | Windows Lab 1–4, Sprzęt Lab 2 | WIN_SERVER, WIN_11                     |
| 3 – DHCP i RRAS | Windows Lab 4.5–5             | WIN_SERVER, WIN_11                     |
| 4 – Integracja  | Integracja Lab 1–6            | WIN_SERVER, LINUX_SERVER               |

- **Faza 1:** WIN_11 ma stały adres `192.168.10.30/24` (kabel Karty 1 wypięty). Służy do
  testów „z Windowsa” w Linux Lab 5, 9, 10, 11.
- **Faza 4:** rolę „Windowsa” pełni WIN_SERVER (ma wbudowany klient SSH). Zawsze 2 maszyny – mieści
  się w 8 GB RAM.
- **SSH na LINUX_SERVER od Linux Lab 5 = port 2222** we wszystkich późniejszych labach (`ssh -p 2222`,
  `scp -P 2222`, `Test-NetConnection -Port 2222`, Fail2ban `port = 2222`, przekierowanie portu
  _Guest Port_ = 2222).

### Poprawione połączenia

| Lab              | Było                                                     | Jest                                                          |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Linux Lab 5      | test „z Windowsa 10 lub Servera” (brak adresu w LAN)     | test z WIN*11 `.30`; krok: \_Guest Port* 22 ➔ 2222            |
| Linux Lab 9      | Fail2ban pilnował portu 22; unban `.10` lub `.30`        | `jail.local`: `port = 2222`; atak i unban z `.30`             |
| Linux Lab 10, 11 | „maszyna Windows 11”; `ufw allow 8080` dla Dockera       | WIN_11; wyjaśnienie, że Docker omija UFW                      |
| Windows Lab 1    | klient ustawiał adres od zera                            | adres z Fazy 1, dopisuje tylko DNS `.10`                      |
| Windows Lab 4.5  | „wpisz IP Twojego routera”; brak przełączenia klienta    | router i DNS `192.168.10.10`; klient ➔ _Obtain automatically_ |
| Windows Lab 5a   | „dodaj drugą kartę NAT”                                  | sprawdź WAN `Ethernet` i LAN `LAN12` (nic nie dodajesz)       |
| Windows Lab 5b   | drugi zespół `LAN_Zespol` z zajętych kart                | weryfikacja `LAN12` z Windows Lab 1                           |
| Integracja Lab 1 | instalacja ról od nowa; test w Firefoksie                | role już są; test `curl`                                      |
| Integracja Lab 2 | RRAS od nowa; DNS `8.8.8.8`; kabel NAT Linuxa podłączony | RRAS z Windows Lab 5; brama i DNS `.10`; kabel wypięty        |
| Integracja Lab 4 | `ssh`/`scp` na porcie 22 z „Windows 11 / Server”         | `-p 2222` / `-P 2222` z WIN_SERVER                            |
| Integracja Lab 6 | `-Port 22`; `nc -vzu` jako pewny test DNS                | `-Port 2222`; pułapka UDP + `nslookup`; ostrzeżenie Fail2ban  |

Ramki „Inny świat” dodane w `01-sieci/index.html` (Packet Tracer), `06-integracja/index.html` i
`scenariusze-win-lin.html` (egzamin, karta Bridged).

### Sklejone komendy (naprawione)

Prettier (hook pre-commit) łączył linijki w `<div class="cli-block">` – komenda po skopiowaniu nie
działała (np. `sudo apt update sudo apt install nginx -y`, `interface … encapsulation … ip address …`).

- Wszystkie 76 bloków komend to teraz `<pre class="cli-block">` – Prettier nie zmienia zawartości
  `<pre>`. Wygląd bez zmian (`.cli-block` ma `white-space: pre`).
- Przywrócony podział linii w 10 sklejonych miejscach: `01-sieci/lab2-vlany`, `01-sieci/lab3-routing`,
  Linux Lab 8, 10, 11, Integracja Lab 4, 5. Linux Lab 0–3, Sprzęt Lab 2 i Poligon odtworzone z
  poprzedniego commita przed formatowaniem.
- **Zasada na przyszłość:** nowe bloki komend pisz jako `<pre class="cli-block">`, nigdy jako `<div>`.

### Do zrobienia później

- ✅ Nazwa hosta WIN_11 = `KLIENT-01` (Windows Lab 1, 2026-11-03).

## 2026-11-02 — Panel ekspertów: `setup.html` (Dzień 0)

Przegląd instrukcji przez 6 ról: Uczeń-tester, Dydaktyk, Redaktor techniczny, Inżynier QA
(VirtualBox/Windows), Projektant informacji (UX), Helpdesk pierwszej linii. Konflikty rozstrzygane
wg kolejności: jednoznaczność > poprawność > zwięzłość > styl.

### Decyzje

- **VirtualBox po angielsku.** Uczeń w Etapie 2 przełącza interfejs na English. Wszystkie ścieżki
  GUI w VirtualBoxie podajemy po angielsku, polski odpowiednik w nawiasie przy pierwszym
  wystąpieniu. Spójne z instalacją systemów po angielsku i ze zrzutami ekranu.
- **Słownik pojęć** (obowiązuje w całym repo):

  | Używać                                       | Nie używać zamiennie                         |
  | -------------------------------------------- | -------------------------------------------- |
  | Karta 1 / 2 / 3 (VirtualBox: Adapter 1/2/3)  | adapter, NIC                                 |
  | INF02-LAN                                    | sieć wewnętrzna, Internal, piaskownica       |
  | WIN_SERVER / WIN_11 / LINUX_SERVER           | serwer, Windows 11, Ubuntu, stacja robocza   |
  | laptop (komputer ucznia)                     | host, fizyczny Windows                       |
  | maszyna                                      | VM, maszyna wirtualna (poza 1. wystąpieniem) |
  | migawka (VirtualBox: Snapshot)               | snapshot, punkt przywracania                 |
  | Dodatki gościa (VirtualBox: Guest Additions) | –                                            |
  | płot (granica podsieci), działka (podsieć)   | wioska, dzielnica, kod pocztowy (o masce)    |

### Plan i status

| #   | Miejsce                | Zmiana                                                                                                          | Status                                       |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | Etap 2, zrzuty         | Nowe zrzuty z VirtualBox 7.2.22 (obecne: ten sam MAC na 2 kartach, wyszarzone Port Forwarding, tytuł „(SLAVE)”) | ⏳ do wykonania – lista w `ZRZUTY_EKRANU.md` |
| 2   | Cała strona + laby     | VirtualBox po angielsku: nowy krok „Language: English”, ścieżki GUI po angielsku                                | ✅ wdrożone                                  |
| 3   | Etap 1                 | Bezpośredni link do instalatora VirtualBox 7.2.22 zamiast strony z najnowszą wersją                             | ✅ wdrożone                                  |
| 4   | Etap 3, Windows 11     | Kroki według nowego instalatora 24H2/25H2 i OOBE Enterprise (_Sign-in options ➔ Domain join instead_)           | ✅ wdrożone, ⚠️ do weryfikacji na ISO        |
| 5   | Etap 0, Hyper-V        | Punkt jako decyzja: „Sprawdź ➔ Jeśli… ➔ zrób A i B, w przeciwnym razie pomiń”                                   | ✅ wdrożone                                  |
| 6   | Etap 2, Nowa maszyna   | Podkroki w kolejności sekcji kreatora (Name and OS ➔ Hardware ➔ Hard Disk)                                      | ✅ wdrożone                                  |
| 7   | Etap 4, `ipconfig`     | Adres 169.254.x.x na kartach INF02-LAN opisany jako prawidłowy                                                  | ✅ wdrożone                                  |
| 8   | Etap 4, Windows        | Wprost: testy na każdej z 2 maszyn Windows                                                                      | ✅ wdrożone                                  |
| 9   | Nowa sekcja            | Tabela „Objaw ➔ Przyczyna ➔ Naprawa”                                                                            | ✅ wdrożone                                  |
| 10  | Etap 3, Dodatki gościa | Napęd „VirtualBox Guest Additions” zamiast sztywnego `D:\`                                                      | ✅ wdrożone                                  |
| 11  | Etap 3, Pułapka nr 3   | Konkretnie: _Remove ➔ Delete all files_ i utwórz maszynę ponownie                                               | ✅ wdrożone                                  |
| 12  | Etap 2, tabela         | RAM w dwóch wierszach (laptop 16 GB / 8 GB), konta przeniesione do Etapu 3                                      | ✅ wdrożone                                  |
| 13  | Etap 2, Ekran          | Krok usunięty (domyślne ustawienia), ratunek w tabeli problemów                                                 | ✅ wdrożone, ⚠️ do weryfikacji w VB 7.2.22   |
| 14  | Ramki                  | 4 typy: Cel, Pułapka nr X, Rada, Sekret (zwinięty)                                                              | ✅ wdrożone                                  |
| 15  | Odznaki czasu          | Tylko czas; łączny czas i podział na 2 wieczory w nagłówku                                                      | ✅ wdrożone                                  |
| 16  | Koniec etapów          | Linijka „✅ Gotowe, gdy: …”                                                                                     | ✅ wdrożone                                  |

### Do zrobienia później

- Słownik pojęć w pozostałych labach ➔ plan z 2026-11-03, punkt 8.
- ✅ Ramki „Egzamin (Bridged) vs nasze laboratorium” – zrobione 2026-11-02.
- ✅ Usunięty nieużywany `img/vbox-client-nic1-internal.jpg` (2026-11-03).

## 2026-11-02 — Dzień 0 dla trzech maszyn

- `setup.html` przepisany: Etapy 0–5 dla WIN_SERVER (Windows Server 2022), WIN_11
  (Windows 11 Enterprise Evaluation) i LINUX_SERVER (Ubuntu Server 26.04). Każda maszyna: Karta 1
  NAT, Karta 2 INF02-LAN.
- `03-linux/setup-ubuntu.html`: usunięte błędy (karta mostkowana, niewykonalny ping z laptopa),
  SSH przez przekierowanie portu 2222, powiększenie `ubuntu-lv`.
- `topology.html`: Linux od początku 192.168.10.20, serwer jako zespół LAN12, klient Windows 11.
- Lab 1 (domena): karta NAT nie rejestruje się w DNS, DNS tylko na 192.168.10.10 z forwarderem
  10.0.2.3.

## 2026-11-02 — Konspekt repo

- `KONSPEKT.md` generowany automatycznie (`scripts/konspekt.mjs`, hook pre-commit), link w README.
