# Historia zmian

Decyzje i plany zmian w materiałach. Najnowsze na górze. Szczegóły techniczne są w historii gita.

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

| Faza            | Laby                          | Włączone maszyny                            |
| --------------- | ----------------------------- | ------------------------------------------- |
| 1 – Linux       | Linux Lab 0–11                | INF02-LINUX (+ INF02-KLIENT od Linux Lab 5) |
| 2 – AD          | Windows Lab 1–4, Sprzęt Lab 2 | INF02-SERWER, INF02-KLIENT                  |
| 3 – DHCP i RRAS | Windows Lab 4.5–5             | INF02-SERWER, INF02-KLIENT                  |
| 4 – Integracja  | Integracja Lab 1–6            | INF02-SERWER, INF02-LINUX                   |

- **Faza 1:** INF02-KLIENT ma stały adres `192.168.10.30/24` (kabel Karty 1 wypięty). Służy do
  testów „z Windowsa” w Linux Lab 5, 9, 10, 11.
- **Faza 4:** rolę „Windowsa” pełni INF02-SERWER (ma wbudowany klient SSH). Zawsze 2 maszyny – mieści
  się w 8 GB RAM.
- **SSH na INF02-LINUX od Linux Lab 5 = port 2222** we wszystkich późniejszych labach (`ssh -p 2222`,
  `scp -P 2222`, `Test-NetConnection -Port 2222`, Fail2ban `port = 2222`, przekierowanie portu
  _Guest Port_ = 2222).

### Poprawione połączenia

| Lab              | Było                                                     | Jest                                                          |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Linux Lab 5      | test „z Windowsa 10 lub Servera” (brak adresu w LAN)     | test z INF02-KLIENT `.30`; krok: _Guest Port_ 22 ➔ 2222       |
| Linux Lab 9      | Fail2ban pilnował portu 22; unban `.10` lub `.30`        | `jail.local`: `port = 2222`; atak i unban z `.30`             |
| Linux Lab 10, 11 | „maszyna Windows 11”; `ufw allow 8080` dla Dockera       | INF02-KLIENT; wyjaśnienie, że Docker omija UFW                |
| Windows Lab 1    | klient ustawiał adres od zera                            | adres z Fazy 1, dopisuje tylko DNS `.10`                      |
| Windows Lab 4.5  | „wpisz IP Twojego routera”; brak przełączenia klienta    | router i DNS `192.168.10.10`; klient ➔ _Obtain automatically_ |
| Windows Lab 5a   | „dodaj drugą kartę NAT”                                  | sprawdź WAN `Ethernet` i LAN `LAN12` (nic nie dodajesz)       |
| Windows Lab 5b   | drugi zespół `LAN_Zespol` z zajętych kart                | weryfikacja `LAN12` z Windows Lab 1                           |
| Integracja Lab 1 | instalacja ról od nowa; test w Firefoksie                | role już są; test `curl`                                      |
| Integracja Lab 2 | RRAS od nowa; DNS `8.8.8.8`; kabel NAT Linuxa podłączony | RRAS z Windows Lab 5; brama i DNS `.10`; kabel wypięty        |
| Integracja Lab 4 | `ssh`/`scp` na porcie 22 z „Windows 11 / Server”         | `-p 2222` / `-P 2222` z INF02-SERWER                          |
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

- Nazwa hosta INF02-KLIENT nie jest nigdzie ustawiana (zostaje nazwa z instalatora).

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
  | INF02-SERWER / INF02-KLIENT / INF02-LINUX    | serwer, Windows 11, Ubuntu, stacja robocza   |
  | laptop (komputer ucznia)                     | host, fizyczny Windows                       |
  | maszyna                                      | VM, maszyna wirtualna (poza 1. wystąpieniem) |
  | migawka (VirtualBox: Snapshot)               | snapshot, punkt przywracania                 |
  | Dodatki gościa (VirtualBox: Guest Additions) | –                                            |

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

- Słownik pojęć w pozostałych labach („stacja robocza”, „Windows 11” ➔ INF02-KLIENT itd.).
- `06-integracja/index.html` i `scenariusze-win-lin.html`: ramka „Egzamin (Bridged) vs nasze
  laboratorium (INF02-LAN)”.
- Usunąć nieużywany `img/vbox-client-nic1-internal.jpg` po wymianie zrzutów.

## 2026-11-02 — Dzień 0 dla trzech maszyn

- `setup.html` przepisany: Etapy 0–5 dla INF02-SERWER (Windows Server 2022), INF02-KLIENT
  (Windows 11 Enterprise Evaluation) i INF02-LINUX (Ubuntu Server 26.04). Każda maszyna: Karta 1
  NAT, Karta 2 INF02-LAN.
- `03-linux/setup-ubuntu.html`: usunięte błędy (karta mostkowana, niewykonalny ping z laptopa),
  SSH przez przekierowanie portu 2222, powiększenie `ubuntu-lv`.
- `topology.html`: Linux od początku 192.168.10.20, serwer jako zespół LAN12, klient Windows 11.
- Lab 1 (domena): karta NAT nie rejestruje się w DNS, DNS tylko na 192.168.10.10 z forwarderem
  10.0.2.3.

## 2026-11-02 — Konspekt repo

- `KONSPEKT.md` generowany automatycznie (`scripts/konspekt.mjs`, hook pre-commit), link w README.
