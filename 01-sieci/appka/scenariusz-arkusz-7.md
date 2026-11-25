# Arkusz krok po kroku, warstwa 7 „W jakiej kolejności to robię?” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · podział warstw: PYT-106a · pułapka P2: PYT-111a · nazwa zakładki: PYT-112a
(„7 Kolejność”) · napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-113.
Dane rutera: `mapa-menu-urzadzen.md` (TP-Link Archer C6 v4 – przykład, model w pracowni niepotwierdzony;
zmiana LAN: okno „Save and log in again?” i przekierowanie).

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, 11 uwag przyjętych, 1 częściowo): haczyk
P2 pada w scenie („Karta serwera to WAN – więc port WAN!”, krok 5; „Nazwa karty to nie nazwa portu”,
krok 11); na ruterze i przełączniku tylko „port”, „karta” tylko na komputerach; krok 1 zaczyna od
„Zadanie 1 zrobione” (zadanie 1 to gniazdo i panel krosowy, nie łączenie urządzeń); akcja z krokiem 14
zmienia tylko adres LAN (WAN i DNS w uproszczeniach); L5 wprowadzona jako „polecenie z zadania 7 – tylko
wcześniej”; zagadka bez strzałki „przeglądarka”; bez numerków przy linijkach – jedyna nowa rzecz na
schemacie to kable z nazwami portów; „ręka” nazwana wprost; pełna kolejność pracy zgodna z warstwami
5–6; nowa notatka o 169.254.x.x. Częściowo (uwaga o kolorach): kolory zostają jak w warstwach 5–6
(kolor = sieć z planu arkusza, także przy ustawieniach fabrycznych); kabel w złym porcie jest szary
i przerywany, a obraz „dwóch sieci” w kroku 16 dają dwa migające adresy obok siebie.

**Cel warstwy:** uczeń wie, że kolejność pracy to nie kolejność zadań w arkuszu: najpierw kable
według schematu, potem ruter, potem przełącznik – i umie wrócić do panelu rutera po zmianie jego
adresu LAN.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Bez kabla nie wejdziesz na żadne urządzenie – kable według schematu są pierwsze.
2. Serwer wpinasz w port LAN rutera; port WAN zostaje pusty.
3. Gdy ruter zmieni adres, serwer musi odświeżyć swój.

## Linijki z arkusza (styczeń 2025) – tylko te pięć

Reszta arkusza jest na tej zakładce ukryta. Przy linijce widać, z którego zadania jest.

| #   | Gdzie     | Linijka z arkusza (co do słowa)                                                                                                                                      |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | zadanie 2 | 2. Skonfiguruj ruter zgodnie z następującymi zaleceniami:                                                                                                            |
| L2  | zadanie 2 | adres IP interfejsu LAN: 10.10.0.1/24                                                                                                                                |
| L3  | zadanie 3 | 3. Skonfiguruj przełącznik zgodnie z następującymi zaleceniami:                                                                                                      |
| L4  | zadanie 4 | 4. Za pomocą kabli połączeniowych znajdujących się na stanowisku egzaminacyjnym połącz urządzenia zgodnie ze schematem, a następnie podłącz je do sieci zasilającej. |
| L5  | zadanie 7 | odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze                                                                                                   |

**Nowa rzecz na schemacie:** kable pojawiają się dopiero, gdy Kuba je wepnie; przy końcach kabli nazwy
portów: „PORT LAN” (ruter), „PORT1”, „PORT3” (przełącznik). Kabel wpięty w zły port jest szary
i przerywany (łuk nad ruterem do portu „WAN”). Kabla do świata w tej warstwie nie ma – na egzaminie
port WAN rutera zostaje pusty.

**Pułapki (dwie):**

- **P1** – zmiana adresu LAN rutera (192.168.0.1 → 10.10.0.1) „ucina” panel: serwer został w starej
  sieci. Trzeba odświeżyć adres serwera (linijka L5 – z zadania 7, ale potrzebna już przy zadaniu 2)
  i wejść pod nowy adres.
- **P2** – kabel serwera w porcie WAN (Internet) rutera zamiast w PORT LAN. Haczyk: karta serwera
  nazywa się „WAN”. Serwer nie dostaje adresu, panel się nie otwiera.

**Odsunięte:** reszta zadania 2 (WAN, DNS – warstwy 2 i 4; DHCP i rezerwacja – warstwa 3), zadanie 3
w szczegółach (warstwa 6), adresy serwera i stacji (warstwy 2–4), sprawdzenie pingiem i zapora
(warstwa 8).

Schemat: ten sam co w warstwach 1–6, w kolorach, ale na początku bez kabli. Ruter i przełącznik
fabryczne (z warstwy 5): pod ruterem (port LAN) „192.168.0.1/24”, „(fabrycznie)”. Postacie: Ola i Kuba.
Kwestia najwyżej 12 słów.

## Scena

| #   | Kto       | Kwestia                                                                       | Na schemacie                                                                                                       | Kuba (pod)  | Przycisk      |
| --- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------- | ------------- |
| 1   | Kuba      | Zadanie 1 zrobione. Teraz po kolei: zadanie 2, ruter!                         | Schemat bez kabli. Pod ruterem (port LAN) „192.168.0.1/24”, „(fabrycznie)”. Podświetla się L1.                     | —           | Dalej ▶       |
| 2   | Ola       | Czym wejdziesz na ruter? Nie ma jeszcze żadnego kabla.                        | Pulsuje puste miejsce między ruterem a serwerem.                                                                   | —           | Dalej ▶       |
| 3   | Kuba      | Kable są dopiero w zadaniu 4. Mam je zrobić pierwsze?                         | Podświetla się L4.                                                                                                 | —           | Dalej ▶       |
| 4   | Ola       | Tak. Kolejność zadań w arkuszu to nie kolejność pracy.                        | Bez zmian.                                                                                                         | —           | 🔌 Do szafy ▶ |
| 5   | Kuba      | Jestem przy szafie. Karta serwera to WAN – więc port WAN!                     | Pulsuje karta „WAN” serwera i port „WAN” rutera.                                                                   | ruter       | Dalej ▶       |
| 6   | _akcja_   | _Kuba wpina kabel serwera w port WAN rutera…_                                 | Szary, przerywany kabel od karty „WAN” serwera łukiem nad ruterem do portu „WAN”. Przy końcu „WAN”.                | ruter       | Dalej ▶       |
| 7   | _akcja_   | _…potem serwer i stację do przełącznika i włącza zasilanie._                  | Kable: karta „LAN 1” serwera – „PORT1”, „PORT3” – stacja. Pod przełącznikiem „192.168.1.254/24”, „(fabrycznie)”.   | przełącznik | Dalej ▶       |
| 8   | Kuba      | Wszystko wpięte. Siadam do serwera, otwieram 192.168.0.1.                     | Strzałka „przeglądarka” od karty „WAN” serwera: „192.168.0.1” – kończy się ✕.                                      | serwer      | Dalej ▶       |
| 9   | Kuba      | Nie wchodzi! Serwer nawet nie dostał adresu 😩                                | Pod kartą „WAN” serwera „brak adresu” (ostrzeżenie).                                                               | serwer      | Dalej ▶       |
| 10  | Ola       | Port WAN patrzy w internet. Tam ruter adresów nie rozdaje.                    | Pułapka P2: miga koniec kabla „WAN” przy ruterze.                                                                  | serwer      | Dalej ▶       |
| 11  | Ola       | Nazwa karty to nie nazwa portu. Serwer idzie do PORT LAN.                     | Pulsuje port „LAN” rutera. Podświetla się L4.                                                                      | serwer      | 🔌 Przepnij ▶ |
| 12  | _akcja_   | _Kuba idzie do szafy i przepina kabel do PORT LAN…_                           | Łuk znika; kabel od karty „WAN” serwera do portu „LAN” rutera, przy końcu „PORT LAN”.                              | ruter       | Dalej ▶       |
| 13  | Kuba      | Wróciłem do serwera. Jest adres i panel się otwiera!                          | Pod kartą „WAN” serwera „192.168.0.100” (przykład). Strzałka „przeglądarka”: „192.168.0.1” ✓.                      | serwer      | Dalej ▶       |
| 14  | _akcja_   | _Kuba zmienia adres LAN rutera na 10.10.0.1 i klika SAVE…_                    | Podświetla się L2. Pod ruterem (port LAN) „10.10.0.1/24”. Strzałka „przeglądarka”: „192.168.0.1” – kończy się ✕.   | serwer      | Dalej ▶       |
| 15  | Kuba      | Panel zniknął! Pod 192.168.0.1 cisza 😩                                       | Bez zmian.                                                                                                         | serwer      | Dalej ▶       |
| 16  | Ola       | Ruter ma już nowy adres. Serwer został w starej sieci.                        | Pułapka P1: migają obok siebie „10.10.0.1/24” pod ruterem i „192.168.0.100” pod kartą „WAN” serwera.               | serwer      | Dalej ▶       |
| 17  | Ola       | Odśwież adres serwera. To polecenie z zadania 7 – tylko wcześniej.            | Podświetla się L5.                                                                                                 | serwer      | ⌨ Odśwież ▶   |
| 18  | _akcja_   | _Kuba wpisuje ipconfig /release i ipconfig /renew…_                           | Polecenia przy serwerze. Pod kartą „WAN” serwera „10.10.0.100” (przykład). Strzałka „przeglądarka”: „10.10.0.1” ✓. | serwer      | Dalej ▶       |
| 19  | Ola       | Potem DHCP, rezerwacja, zgłoszenie ręką. Dopiero wtedy przełącznik.           | Podświetlają się L1 i L3.                                                                                          | serwer      | Dalej ▶       |
| 20  | _zagadka_ | Arkusz: ruter w zadaniu 2, kable w 4. Co robisz najpierw? A) Ruter. B) Kable. | Stan z kroku 19 bez strzałki „przeglądarka”.                                                                       | —           | Teraz Ty ▶    |

**Kuba (pod):** sylwetka pod urządzeniem, przy którym Kuba pracuje w tym kroku (PYT-102a, PYT-104a);
„—” – czyta arkusz, sylwetki nie ma. Pierwszy raz Kuba stoi przy szafie (kroki 5–7 i 12): wpina kable,
więc sylwetka jest pod ruterem albo przełącznikiem. Panel rutera – przy serwerze.

Reakcje na zagadkę:

- A: „Na ruter wchodzisz kablem. Najpierw kable według schematu.”
- B: „Właśnie tak – bez kabli nie wejdziesz na żadne urządzenie.”

## Ćwiczenie (uczeń sam)

Schemat w kolorach, bez kabli, ruter i przełącznik fabryczne. Bez strzałki „przeglądarka”. W ćwiczeniu
2 kable stoją jak po kroku 7, ale bez kabla serwer–ruter.

| #   | Polecenie                                                   | Co robi uczeń                        | Dobra odpowiedź   | Reakcja na błąd                                                      |
| --- | ----------------------------------------------------------- | ------------------------------------ | ----------------- | -------------------------------------------------------------------- |
| 1   | Kliknij linijkę, od której zaczniesz pracę przy stanowisku. | klika linijki L1–L5, potem „Sprawdź” | L4                | „Bez kabli nie wejdziesz na żadne urządzenie. Zacznij od zadania 4.” |
| 2   | Kliknij port rutera, do którego wepniesz kabel serwera.     | klika port rutera                    | port „LAN” rutera | „Karta serwera nazywa się WAN, ale wpinasz ją w PORT LAN rutera.”    |
| 3   | Zmieniłeś adres LAN rutera i panel zniknął. Co robisz?      | wybiera A albo B                     | B                 | „Reset skasuje twoją pracę. Odśwież adres serwera.”                  |
| 4   | Kiedy pierwszy raz odświeżysz adres serwera?                | wybiera A albo B                     | A                 | „Bez odświeżenia nie wejdziesz pod nowy adres rutera.”               |

Odpowiedzi do zadania 3: A) Resetuję ruter do ustawień fabrycznych. B) Odświeżam adres serwera i wchodzę na 10.10.0.1.

Odpowiedzi do zadania 4: A) Zaraz po zmianie adresu LAN rutera. B) Dopiero w zadaniu 7.

Ćwiczenie 1 – reakcja, gdy uczeń kliknie L5: „Odświeżasz, gdy już jest kabel. Zacznij od zadania 4.”

Ćwiczenie 1 – reakcja, gdy uczeń nic nie zaznaczy: „Zaznacz jedną linijkę – tę, od której zaczniesz.”

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 7

- **Dlaczego kable są dopiero w zadaniu 4?** Arkusz nie mówi, w jakiej kolejności pracować. Ruter
  i przełącznik ustawia się przeglądarką z serwera albo ze stacji, a do tego potrzebny jest kabel. Dlatego kable
  idą pierwsze – a zasilanie po kablach, jak w arkuszu.
- **A zadanie 1?** To gniazdo i panel krosowy, sprawdzane testerem. Nie łączy urządzeń ze schematu.
- **Czemu w tej warstwie nie ma kabla do świata?** Na egzaminie port WAN rutera zostaje pusty. Arkusz
  każe tylko wpisać jego adres (warstwa 2).
- **Jak odróżnić port WAN od portów LAN?** Port WAN jest zwykle jeden, ma inny kolor i podpis
  „Internet” albo „WAN”. Porty LAN są ponumerowane. Sprawdź na obudowie i w dokumentacji rutera.
- **Dlaczego w porcie WAN serwer nie dostał adresu?** Serwer DHCP rutera rozdaje adresy tylko od strony
  LAN. ipconfig pokaże wtedy 169.254.x.x – „DHCP nie odpowiedział” (warstwa 3).
- **Czy przełącznikowi jest wszystko jedno, który port?** Działać będzie każdy – wszystkie są w VLAN 1
  (warstwa 6). Ale arkusz każe łączyć zgodnie ze schematem: serwer do PORT1, stacja do PORT3.
- **Cała kolejność pracy:** kable → ruter z serwera (WAN, DNS, LAN, odśwież, DHCP, rezerwacja,
  odśwież) → przełącznik ze stacji (maska /24 na chwilę) → serwer (LAN 1) → stacja (wróć /25, maszyna
  wirtualna) → sprawdzenie (warstwa 8).

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Po zmianie LAN TP-Link pokazuje okno „Save and log in again?” i ok. 40 s przekierowania
  (`mapa-menu-urzadzen.md`). Scena skraca to do „panel zniknął”.
- Pula DHCP po zmianie LAN: scena zakłada, że przesuwa się sama do nowej sieci (adres 10.10.0.100 to
  przykład – domyślna pula .100–.249 w sieci 10.10.0.x). Sprawdzone w internecie (PYT-115): na forum
  TP-Link pula „idzie za” adresem LAN (inny model), a obsługa TP-Link pisze o Archer C6, że pula nie
  może leżeć w innej podsieci niż LAN; przewodnik Archer A20 każe po zmianie podsieci LAN ustawić
  rezerwacje od nowa. Oficjalnego zdania dla C6 brak. Jeśli pula się nie przesunie, serwer po `/renew`
  nie dostanie adresu – wtedy na chwilę ręczny adres z sieci 10.10.0.0/24.
- Kolejność w ruterze: WAN i DNS przed LAN, bo po zmianie LAN trzeba się logować od nowa. DHCP po LAN,
  bo zakres musi być w sieci LAN (komunikat TP-Link w `mapa-menu-urzadzen.md`). Scena pokazuje tylko
  zmianę LAN.
- Krok 12: Windows prosi o nowy adres sam, gdy kabel zostanie podłączony – dlatego po przepięciu
  serwer ma adres bez `/renew`.
- Krok 7 łączy w jednej akcji dwa kable i zasilanie wszystkich urządzeń.
- Że urządzenia stoją na początku niepołączone i wyłączone, wynika z zadania 4 („połącz urządzenia…,
  a następnie podłącz je do sieci zasilającej”); w pracowni może być inaczej.
- Przykładowy adres 192.168.0.100 – jak w warstwie 5 (`SHEET_FACTORY.routerLease`).

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** kable widoczne tylko po wpięciu (lista kabli w kroku), kabel w złym
  porcie (szary łuk do portu „WAN” rutera), nazwy portów przy końcach kabli; reszta (strzałka
  „przeglądarka”, polecenia przy serwerze, sylwetka, linijki z „Sprawdź”) już jest.
- **Zakładki (PYT-112a):** krótkie nazwy wszystkich zakładek, ta jako „7 Kolejność”; pełne pytanie
  w podpowiedzi po najechaniu.
- **Spójność z warstwami 5–6 (PYT-114):** odwołania „ćwiczysz to w warstwie 6” i „przy kablach
  (warstwa 7)” w notatkach wdrożonych warstw.
