# Arkusz krok po kroku, warstwa 4 „Kto zna nazwy?” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · warstwy: PYT-089a · napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-098.

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, wszystkie 12 uwag przyjęte): stacja nie
dosięga 4.4.4.4 (✕ na serwerze, jak w warstwie 2), P2 to „arkusz podaje kartę, adres bierzesz z tabeli”
zamiast powodu z IIS, zagadka z konkretnymi adresami, Kuba nie widzi L1 przed wpadką, kroki 12–14
skrócone do dwóch, stan schematu w ćwiczeniu, „strefa” i „rekord” na schemacie, maszyna wirtualna
w notatce, polecenie i reakcje ćwiczenia 2, „kontakty w telefonie”, dymek bez koloru.

**Cel warstwy:** uczeń wie, kogo każda karta pyta o nazwy (DNS) i dlaczego na tym arkuszu prawie
wszyscy pytają serwer. Umie wskazać, gdzie powstaje wpis „www → adres” i dlaczego wskazuje kartę LAN 1.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. DNS zamienia nazwę na adres – jak kontakty w telefonie.
2. Wpis „DNS” na karcie mówi, kogo ta karta pyta o nazwy.
3. Nazwy z egzamin.local zna tylko serwer – więc stacja pyta kartę LAN 1 serwera.

**Po co (cel z arkusza):** zadanie 9 każe w maszynie wirtualnej „wyświetlić za pomocą adresu
www.egzamin.local stronę internetową, udostępnioną przez serwer”. To działa tylko wtedy, gdy DNS jest
ustawiony dobrze.

## Linijki z arkusza (styczeń 2025) – tylko te pięć

Reszta arkusza jest na tej zakładce ukryta. Przy linijce widać, czyja jest (L1 i L2 mają ten sam tekst).

| #   | Gdzie         | Linijka z arkusza (co do słowa)                                                                                  |
| --- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| L1  | stacja, LAN 2 | DNS: 192.168.1.1                                                                                                 |
| L2  | serwer, LAN 1 | DNS: 192.168.1.1                                                                                                 |
| L3  | serwer        | ustaw w strefie egzamin.local nowy rekord hosta o nazwie www, powiązany z adresem IP interfejsu sieciowego LAN 1 |
| L4  | ruter, DHCP   | serwer DNS: 10.10.0.20                                                                                           |
| L5  | ruter, WAN    | serwer DNS dla interfejsu WAN: 4.4.4.4 oraz drugi serwer DNS: 4.4.5.5, jeśli jest wymagany                       |

**Nowa rzecz na schemacie:** strzałka „pytanie o nazwę” (przerywana, ciemna – kolor zostaje dla sieci)
od karty, która pyta, do tego, kogo pyta; przy grocie pytanie albo odpowiedź. Pomocniczo: dymek nad
stacją („www.egzamin.local = ?”, bez koloru, z ✕ albo ✓) i spis serwera jako napis pod kartą LAN 1:
„strefa egzamin.local · rekord: www → 192.168.1.1”.

**Pułapki (dwie):**

- **P1** – w arkuszu jest też DNS 4.4.4.4 (ustawienie rutera). Wpisany na stacji nie zadziała: stacja
  do niego nie dojdzie (serwer nie przekazuje ruchu – jak w warstwie 2), a 4.4.4.4 i tak nie zna
  egzamin.local. Stacja pyta kartę LAN 1 serwera (192.168.1.1).
- **P2** – linijka rekordu www podaje **kartę** („adresem IP interfejsu sieciowego LAN 1”), a nie adres.
  Adres karty LAN 1 bierzesz z tabeli z etapu 2: 192.168.1.1, nie 10.10.0.20 (to karta WAN).

Schemat: ten sam co w warstwach 1–3, sieci w kolorach, adresy z etapu 2 przy kartach (przygaszone),
przy karcie WAN serwera 10.10.0.20 (z warstwy 3).
Postacie: Ola i Kuba, na „ty”. Kwestia najwyżej 12 słów, ruch w osobnym kroku „akcja”.

## Scena

| #   | Kto       | Kwestia                                                      | Na schemacie                                                                                                                             | Przycisk     |
| --- | --------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | Kuba      | Stacja ma otworzyć www.egzamin.local. Skąd wie, gdzie to? 🤔 | Obok schematu pięć linijek (L1–L5). Pulsuje stacja. Nad stacją dymek „www.egzamin.local = ?”.                                            | Dalej ▶      |
| 2   | Ola       | Ludzie pamiętają nazwy, a sieć używa adresów.                | Bez zmian.                                                                                                                               | Dalej ▶      |
| 3   | Ola       | DNS zamienia nazwę na adres. Jak kontakty w telefonie.       | Pulsuje karta „LAN 2” stacji. (L1 jeszcze nie świeci – Kuba ma się pomylić naturalnie.)                                                  | Dalej ▶      |
| 4   | Kuba      | DNS? Wpiszę 4.4.4.4 – jak na ruterze!                        | Podświetla się L5.                                                                                                                       | 🔎 Zapytaj ▶ |
| 5   | _akcja_   | _Stacja pyta 4.4.4.4 o www.egzamin.local…_                   | Strzałka pytania od stacji w stronę świata kończy się ✕ na serwerze (jak w warstwie 2). Przy ✕: „brak odpowiedzi”.                       | Dalej ▶      |
| 6   | Kuba      | Nie działa! Strona się nie otwiera 😩                        | Dymek nad stacją: „www.egzamin.local = ? ✕”.                                                                                             | Dalej ▶      |
| 7   | Ola       | Tam nie dojdziesz. A 4.4.4.4 i tak nie zna egzamin.local.    | Bez zmian.                                                                                                                               | Dalej ▶      |
| 8   | Ola       | egzamin.local zna tylko serwer. Ma ją w swoim spisie.        | Pod kartą „LAN 1”: „strefa egzamin.local · rekord: www → 192.168.1.1”. Podświetla się L3.                                                | 🔎 Zapytaj ▶ |
| 9   | _akcja_   | _Stacja pyta serwer, serwer odpowiada adresem…_              | Podświetla się L1. Strzałka pytania od stacji do karty „LAN 1”: „www?”, potem „192.168.1.1”. Dymek: „www.egzamin.local = 192.168.1.1 ✓”. | Dalej ▶      |
| 10  | Kuba      | W rekordzie wpiszę 10.10.0.20? To przecież też serwer.       | Pulsuje karta „WAN” serwera (10.10.0.20).                                                                                                | Dalej ▶      |
| 11  | Ola       | Arkusz mówi »LAN 1«. Jej adres masz w tabeli: 192.168.1.1.   | Pułapka P2: podświetla się L3, w niej słowa „LAN 1”; pulsuje karta „LAN 1”.                                                              | Dalej ▶      |
| 12  | Kuba      | A serwer? Ma DNS 192.168.1.1, a od DHCP 10.10.0.20.          | Podświetlają się L2 i L4.                                                                                                                | Dalej ▶      |
| 13  | Ola       | Oba to jego własne adresy. Pyta sam siebie.                  | Strzałki pytania od obu kart serwera do nich samych (małe pętle).                                                                        | Dalej ▶      |
| 14  | Kuba      | To po co 4.4.4.4?                                            | Podświetla się L5.                                                                                                                       | Dalej ▶      |
| 15  | Ola       | Dla samego rutera. Na stacji go nie wpisujesz.               | Strzałka pytania od karty „WAN” rutera w stronę świata.                                                                                  | Dalej ▶      |
| 16  | _zagadka_ | Co stacja wpisze jako DNS? A) 4.4.4.4. B) 192.168.1.1.       | Stan końcowy: strzałki pytań stacja → serwer i ruter → świat.                                                                            | Teraz Ty ▶   |

Reakcje na zagadkę:

- A: „4.4.4.4 nie zna egzamin.local. Stacja pyta serwer.”
- B: „Właśnie tak – karta LAN 1 serwera, w kolorze stacji.”

## Ćwiczenie (uczeń sam)

Schemat w kolorach z adresami z etapu 2, przy karcie WAN serwera 10.10.0.20. **Bez strzałek pytań,
bez spisu serwera i bez napisu „DNS → serwer” przy stacji.** Obok pięć linijek L1–L5 z napisem,
czyje są.

| #   | Polecenie                                            | Co robi uczeń                        | Dobra odpowiedź       | Reakcja na błąd                                                     |
| --- | ---------------------------------------------------- | ------------------------------------ | --------------------- | ------------------------------------------------------------------- |
| 1   | Kliknij kartę, którą stacja pyta o nazwy.            | klika kartę                          | karta „LAN 1” serwera | „Ta karta nie zna egzamin.local. Szukaj adresu z wpisu DNS stacji.” |
| 2   | Kliknij linijki, w których adres DNS to nasz serwer. | klika linijki L1–L5, potem „Sprawdź” | L1, L2, L4            | „»Serwer DNS« to nazwa pola. 4.4.4.4 to nie nasz serwer.”           |
| 3   | Rekord www: który adres wpiszesz?                    | wybiera A albo B                     | B                     | „Arkusz każe kartę LAN 1. Jej adres to 192.168.1.1.”                |
| 4   | Kliknij kartę, której DNS to 4.4.4.4.                | klika kartę                          | karta „WAN” rutera    | „Ta karta pyta nasz serwer. 4.4.4.4 jest w ustawieniach rutera.”    |

Odpowiedzi do zadania 3: A) 10.10.0.20. B) 192.168.1.1.

Ćwiczenie 2 – reakcja, gdy uczeń zaznaczy L3 (rekord, nie adres DNS): „To rekord w strefie serwera,
nie adres DNS karty.”

Ćwiczenie 2 – reakcja, gdy uczeń pominie tylko L4 (haczyk: inny adres, ten sam serwer): „Brakuje
jednej. 10.10.0.20 to też serwer – jego karta WAN.”

Ćwiczenie 2 – reakcja, gdy brakuje więcej niż jednej linijki: „Brakuje linijek. Szukaj adresów
serwera: 192.168.1.1 i 10.10.0.20.”

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 4

- **Gdzie arkusz sprawdza DNS?** W zadaniu 9: maszyna wirtualna otwiera www.egzamin.local. Ustaw DNS
  192.168.1.1 także w niej – to ją ocenia egzaminator.
- **Co to jest strefa wyszukiwania do przodu?** Spis „nazwa → adres” dla jednej domeny, tu
  egzamin.local. Spis odwrotny („adres → nazwa”) to strefa wsteczna – arkusz jej nie wymaga.
- **Czym sprawdzić DNS?** Na stacji: nslookup www.egzamin.local. Odpowiedź powinna podać 192.168.1.1.
- **Skąd serwer zna nazwy spoza egzamin.local?** Usługa DNS na Windows Server sama pyta serwery
  główne Internetu – przez kartę WAN i ruter. Arkusz tego nie ocenia.
- **Dlaczego „drugi serwer DNS, jeśli jest wymagany”?** Niektóre panele rutera nie zapiszą ustawień
  bez drugiego DNS. Gdy panel nie protestuje, drugie pole możesz zostawić puste.
- **Co ma do tego IIS?** Witryna jest powiązana z kartą LAN 1 i nazwą www.egzamin.local. Rekord www
  ze złym adresem poprowadzi przeglądarkę tam, gdzie strony nie ma. Instalację IIS ćwiczysz
  w Filarze 2.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Stacja nie dosięga 4.4.4.4, bo serwer nie przekazuje ruchu między kartami bez usługi routingu
  (warstwa 2). `nslookup` pokaże wtedy upłynięcie limitu czasu, nie „nie znam” – na lekcji warto to
  pokazać.
- Rekord hosta w Menedżerze DNS: w polu „Nazwa” wpisuje się samo `www`. Wpisanie
  `www.egzamin.local` da `www.egzamin.local.egzamin.local` – częsta wpadka.
- Nie pokazujemy portu 53, UDP ani pamięci podręcznej DNS; `ipconfig /flushdns` przyda się, gdy ktoś
  poprawił DNS, a stacja pamięta złą odpowiedź.
- Maszyna wirtualna (LAN 3) nie jest na schemacie (reguła warstwy: 5 linijek) – jest w notatce
  „Dla dociekliwych” i w zadaniu 9.
- Że DHCP daje też DNS, było w notatce warstwy 3; tu Kuba czyta to wprost z L4.

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** strzałka „pytanie o nazwę” (od karty do karty, do świata, pętla na
  karcie, zakończenie ✕ na serwerze), dymek nad stacją, przy linijkach napis „czyja”, w ćwiczeniu 2
  osobne reakcje dla L3 i L5.
- **Strona:** czwarta zakładka „Kto zna nazwy?” na stronie „Arkusz krok po kroku”.
