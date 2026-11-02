# Historia zmian

Decyzje i plany zmian w materiałach. Najnowsze na górze. Szczegóły techniczne są w historii gita.

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
