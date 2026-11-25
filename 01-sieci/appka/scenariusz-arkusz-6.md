# Arkusz krok po kroku, warstwa 6 „Co ustawić na przełączniku i jak tego nie zgubić?” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · podział warstw: PYT-106a · napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-107.
Dane przełącznika: `mapa-menu-urzadzen.md`, `mapa-menu-cbs350-basic.md` (Cisco CBS350; kreator: zrzut
operatora, PYT-094a).

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, wszystkie 12 uwag przyjęte): Apply jest
na końcu kreatora (po Next), restart z panelu (Reboot) zamiast „przepinania zasilania” – kable i zadanie 4
zostają dla warstwy 7; ściąga masek na okienku kreatora; maska i brama w osobnych krokach (brama to
serwer); „Wróć stacji /25” w scenie; odpowiedzi w ćwiczeniach w różnej kolejności; prostsze brzmienia
(kroki 4, 5, 14, 15, 16); VLAN 1 jako „grupa portów”. **Warunek:** PYT-108 – czy Apply w kreatorze
zapisuje konfigurację na stałe (od tego zależy pułapka P2).

**Cel warstwy:** uczeń ustawia przełącznikowi adres i bramę z arkusza tak, żeby działały z każdego
portu i przetrwały restart – i wie, kiedy zgłosić gotowość do oceny.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Adres przełącznika ustawiasz na VLAN 1 – w nim są wszystkie porty.
2. Apply zmienia przełącznik od razu, ale tylko do restartu.
3. Zostaje dopiero to, co zapiszesz przyciskiem Save.

## Linijki z arkusza (styczeń 2025) – tylko te trzy

Reszta arkusza jest na tej zakładce ukryta. Przy linijce widać, czyja jest.

| #   | Gdzie       | Linijka z arkusza (co do słowa)                                                                                                 |
| --- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| L1  | przełącznik | adres IP: 192.168.1.2/25                                                                                                        |
| L2  | przełącznik | brama domyślna: 192.168.1.1                                                                                                     |
| L3  | przełącznik | UWAGA: Po wykonaniu konfiguracji zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do oceny ustawień przełącznika. |

**Nowa rzecz na schemacie:** okienko kreatora przełącznika (jak okno rezerwacji w warstwie 3):
Getting Started Wizard → IP Settings, z polami Interface (Port GE1 / VLAN 1), IP Address, Network Mask,
Administrative Default Gateway i ściągą pod spodem: „/24 = 255.255.255.0 · /25 = 255.255.255.128”.
Pomocniczo: pod przełącznikiem napis „💾 niezapisane / zapisane”.

**Pułapki (dwie):**

- **P1** – kreator ma domyślnie zaznaczony **Port GE1**. Adres na jednym gnieździe działa tylko tam.
  Trzeba wybrać **VLAN 1**.
- **P2** – Apply nie zapisuje na stałe (warunek: PYT-108). Po restarcie przełącznik wraca do ustawień
  fabrycznych, jeśli nie kliknięto **Save**.

**Podpórka (nie pułapka):** maska w okienku w pełnej postaci – ściąga na okienku kreatora.

Schemat: ten sam co w warstwach 1–5. Stacja ma na chwilę maskę /24 (z warstwy 5), przełącznik na
początku fabryczny (192.168.1.254/24). Postacie: Ola i Kuba. Kwestia najwyżej 12 słów.

## Scena

| #   | Kto       | Kwestia                                                              | Na schemacie                                                                                                                                                                                     | Kuba (pod) | Przycisk            |
| --- | --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| 1   | Kuba      | Jestem w panelu przełącznika. Co teraz ustawić? 🤔                   | Strzałka „przeglądarka” od stacji do przełącznika: „192.168.1.254”. Pod przełącznikiem „192.168.1.254/24”, „(fabrycznie)”; pod stacją „192.168.1.3/24”, „(na chwilę)”. Podświetlają się L1 i L2. | stacja     | Dalej ▶             |
| 2   | Ola       | Adres i bramę z arkusza. Najprościej w kreatorze.                    | Bez zmian.                                                                                                                                                                                       | stacja     | 🧭 Otwórz kreator ▶ |
| 3   | _akcja_   | _Kuba otwiera Getting Started Wizard → IP Settings…_                 | Okienko kreatora: Interface – zaznaczony „Port GE1”; pola puste; pod spodem ściąga masek.                                                                                                        | stacja     | Dalej ▶             |
| 4   | Kuba      | Wpisuję adres. Interfejs zostawiam, jak był.                         | W okienku: IP Address „192.168.1.2”; „Port GE1” nadal zaznaczony.                                                                                                                                | stacja     | Dalej ▶             |
| 5   | Ola       | Stop! Port GE1 to jedno gniazdo. Adres działałby tylko tam.          | Pułapka P1: „Port GE1” miga.                                                                                                                                                                     | stacja     | Dalej ▶             |
| 6   | Ola       | Wybierz VLAN 1 – w nim są wszystkie porty.                           | W okienku zaznaczony „VLAN 1”.                                                                                                                                                                   | stacja     | Dalej ▶             |
| 7   | Kuba      | A maska /25? Tu jest pole »Network Mask«.                            | Pole Network Mask puste, miga; podświetla się ściąga masek.                                                                                                                                      | stacja     | Dalej ▶             |
| 8   | Ola       | Maskę wpisz pełną: 255.255.255.128.                                  | W okienku: Network Mask „255.255.255.128”.                                                                                                                                                       | stacja     | Dalej ▶             |
| 9   | Ola       | Brama to serwer: pole »Administrative Default Gateway«.              | W okienku: Administrative Default Gateway „192.168.1.1”. Pulsuje karta „LAN 1” serwera. Podświetla się L2.                                                                                       | stacja     | ▶ Next… Apply ▶     |
| 10  | _akcja_   | _Kuba klika Next aż do podsumowania, potem Apply…_                   | Okienko znika. Strzałka „przeglądarka”: „192.168.1.2”. Pod przełącznikiem „192.168.1.2/25”, „💾 niezapisane”. Dymek: „192.168.1.2 ✓”.                                                            | stacja     | Dalej ▶             |
| 11  | Kuba      | Działa! To już koniec?                                               | Bez zmian.                                                                                                                                                                                       | stacja     | Dalej ▶             |
| 12  | Ola       | Sprawdźmy, czy przetrwa restart. Kliknij Reboot.                     | Bez zmian.                                                                                                                                                                                       | stacja     | 🔄 Reboot ▶         |
| 13  | _akcja_   | _Przełącznik się restartuje…_                                        | Strzałka „przeglądarka” znika. Pod przełącznikiem „192.168.1.254/24”, „(fabrycznie)”.                                                                                                            | stacja     | Dalej ▶             |
| 14  | Kuba      | Pod .2 cisza. Pod .254 fabryczny panel. Wszystko zniknęło 😩         | Strzałka „przeglądarka”: „192.168.1.254”. Dymek: „192.168.1.2 ✕ → 192.168.1.254 ✓”.                                                                                                              | stacja     | Dalej ▶             |
| 15  | Ola       | Apply działa tylko do restartu. Na stałe zapisuje Save.              | Bez zmian.                                                                                                                                                                                       | stacja     | 💾 Ustaw i zapisz ▶ |
| 16  | _akcja_   | _Kuba loguje się od nowa, ustawia adres i klika Save…_               | Strzałka „przeglądarka”: „192.168.1.2”. Pod przełącznikiem „192.168.1.2/25”, „💾 zapisane”. Dymek: „192.168.1.2 ✓”.                                                                              | stacja     | Dalej ▶             |
| 17  | Ola       | Zapisane. Wróć stacji /25 i podnieś rękę.                            | Pod stacją „192.168.1.3/25”. Podświetla się L3.                                                                                                                                                  | stacja     | Dalej ▶             |
| 18  | _zagadka_ | Kiedy podnosisz rękę do oceny przełącznika? A) Po Apply. B) Po Save. | Stan z kroku 17.                                                                                                                                                                                 | —          | Teraz Ty ▶          |

**Kuba (pod):** sylwetka pod urządzeniem, przy którym Kuba pracuje w tym kroku (PYT-102a, PYT-104a);
„—” – czyta arkusz, sylwetki nie ma. Cała scena przy stacji – przełącznik konfiguruje się przeglądarką.

Reakcje na zagadkę:

- A: „Po Apply zmiana żyje tylko do restartu. Najpierw Save.”
- B: „Właśnie tak – po Save ustawienia przetrwają restart.”

## Ćwiczenie (uczeń sam)

Schemat w kolorach, pod przełącznikiem „192.168.1.254/24 (fabrycznie)”. Bez okienka kreatora, bez
strzałki „przeglądarka” i bez dymka.

| #   | Polecenie                                                 | Co robi uczeń                        | Dobra odpowiedź | Reakcja na błąd                                                  |
| --- | --------------------------------------------------------- | ------------------------------------ | --------------- | ---------------------------------------------------------------- |
| 1   | Kreator pyta o interfejs. Co wybierzesz?                  | wybiera A albo B                     | A               | „Adres na porcie działa tylko na tym gnieździe. Wybierz VLAN 1.” |
| 2   | Kliknij linijki, które wpiszesz w kreatorze.              | klika linijki L1–L3, potem „Sprawdź” | L1, L2          | „Gotowość zgłaszasz ręką, nie w kreatorze.”                      |
| 3   | Jak wpiszesz maskę /25 w polu »Network Mask«?             | wybiera A albo B                     | B               | „255.255.255.0 to /24. Maska /25 to 255.255.255.128.”            |
| 4   | Kliknąłeś tylko Apply. Po restarcie przełącznik ma adres: | wybiera A albo B                     | A               | „Bez Save zmiana żyje tylko do restartu.”                        |

Odpowiedzi do zadania 1: A) VLAN 1. B) Port GE1.

Odpowiedzi do zadania 3: A) 255.255.255.0. B) 255.255.255.128.

Odpowiedzi do zadania 4: A) 192.168.1.254. B) 192.168.1.2.

Ćwiczenie 2 – reakcja, gdy uczeń pominie tylko L2: „Brakuje bramy – to pole »Administrative Default Gateway«.”

Ćwiczenie 2 – reakcja, gdy brakuje więcej niż jednej linijki: „Do kreatora idą dwie linijki: adres i brama.”

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 6

- **Co to jest VLAN 1?** Grupa portów przełącznika – z fabryki są w niej wszystkie porty. Adres
  ustawiony na VLAN 1 odpowiada z każdego portu.
- **Gdzie jest przycisk Save?** Na górnym pasku panelu – pojawia się, gdy są niezapisane zmiany. Drugi
  sposób: File Operations, kopia Running Configuration do Startup Configuration.
- **Dlaczego maska jako 255.255.255.128?** Pole „Network Mask” chce pełnej postaci. /25 to 25 jedynek:
  255.255.255.128.
- **Czy da się bez kreatora?** Tak: adres na VLAN 1 w IPv4 Interface, a bramę jako trasę 0.0.0.0/0
  w IPv4 Static Routes. Kreator robi to na jednej stronie.
- **Kiedy przełącznik się restartuje?** Po Reboot, po zaniku prądu albo po przepięciu zasilania –
  na przykład przy kablach (warstwa 7). Zapisana konfiguracja przetrwa każdy z nich.
- **Dlaczego po restarcie jest 192.168.1.254, a nie adres z DHCP?** W niebieskiej sieci nikt nie
  rozdaje adresów – DHCP rutera działa tylko w zielonej. Przełącznik bierze więc adres fabryczny.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Kreator ma zakładki IP Settings → User Account → Time Settings → Summary; Apply jest na końcu.
  Zakładki User Account i Time Settings w scenie pomijamy („Next aż do podsumowania”).
- Czy Apply na końcu kreatora zapisuje konfigurację także do Startup Configuration – **do sprawdzenia
  w emulatorze (PYT-108)**. Jeśli zapisuje, P2 trzeba pokazać na zmianie poza kreatorem (np. IPv4
  Interface → Apply).
- Czy użytkownik z pierwszego logowania (Change Default User) przetrwa restart bez Save – nie
  sprawdzono; krok 16 mówi tylko „loguje się od nowa”.
- P1 pokazana bez skutku (Ola zatrzymuje Kubę przed Apply): co dokładnie dzieje się w CBS350 z adresem
  na porcie, zależy od trybu portu – dla ucznia wystarcza „wybierz VLAN 1”.
- Pole DNS Server w kreatorze emulator wypełnia sam – arkusz go nie wymaga.
- Cisco kończy sesję po 10 minutach bezczynności.

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** okienko kreatora ze ściągą masek (jak okno rezerwacji), napis
  „💾 niezapisane / zapisane” pod przełącznikiem; reszta (strzałka „przeglądarka”, dymek, sylwetka,
  linijki z „Sprawdź”) już jest.
- **Strona:** szósta zakładka na stronie „Arkusz krok po kroku”.
