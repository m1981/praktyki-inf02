# Arkusz krok po kroku, warstwa 5 „Jak wejść na urządzenie?” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · warstwy: PYT-089a · napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-100.
Dane urządzeń: `mapa-menu-urzadzen.md` (TP-Link Archer C6 v4 – model w pracowni niepotwierdzony,
na ekranie adres rutera z dopiskiem „przykład”; Cisco CBS350).

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, wszystkie 12 uwag przyjęte): na ruter
wchodzimy z serwera (karta WAN na „automatycznie”, kabel jest na schemacie) – bez kabla „na chwilę”
i bez sprzecznego stanu stacji; nowa rzecz na schemacie to ciągła strzałka „przeglądarka”; login
cisco/cisco w scenie; „wróć /25” dopiero, gdy przełącznik ma 192.168.1.2; „kabel to za mało” zamiast
dwóch znaczeń słowa „sieć”; zagadka o masce; ćwiczenie z linijkami (wzorzec 2); zasady hasła
rozłożone na przykładzie »cisco123«; adres przełącznika dopiero przy przełączniku; odsunięcia do
warstwy 6 nazwane wprost; CBS350 ma DHCP, tylko wyłączony.

**Cel warstwy:** uczeń wie, jak otworzyć panel rutera i przełącznika, które są „na ustawieniach
fabrycznych”: pod jakim adresem, z którego komputera i co zrobić ze stacją na chwilę i potem.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Panel urządzenia otwierasz w przeglądarce, pod adresem z dokumentacji.
2. Kabel to za mało: komputer musi mieć adres z sieci urządzenia.
3. Ruter da adres karcie na „automatycznie”; przy przełączniku wpisujesz adres sam.

## Linijki z arkusza (styczeń 2025) – tylko te pięć

Reszta arkusza jest na tej zakładce ukryta. Przy linijce widać, czyja jest.

| #   | Gdzie         | Linijka z arkusza (co do słowa)                                                                                                                               |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | ruter         | Ruter pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze RUTER na nośniku opisanym DOKUMENTACJA/PROGRAMY.             |
| L2  | ruter         | Jeżeli ruter wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.                                                                                     |
| L3  | przełącznik   | Przełącznik pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze PRZEŁĄCZNIK na nośniku opisanym DOKUMENTACJA/PROGRAMY. |
| L4  | przełącznik   | Jeżeli przełącznik wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.                                                                               |
| L5  | stacja, LAN 2 | adres IP: 192.168.1.3/25                                                                                                                                      |

**Nowa rzecz na schemacie:** strzałka „przeglądarka” (ciągła, szara – kolor zostaje dla sieci) od
komputera, przy którym siedzimy, do urządzenia; przy niej adres, który wpisujemy. Pomocniczo:
plakietka „Przeglądarka na: serwer / stacja” (jak „Jesteś na:” w warstwie 3), dymek z wynikiem
(jak w warstwie 4) i adresy fabryczne pod urządzeniami.

**Pułapki (dwie):**

- **P1** – fabryczny adres przełącznika 192.168.1.254 wygląda na „naszą” sieć, ale stacja z adresem
  z arkusza ma maskę /25, która kończy sieć na .127. Kabel jest, a panel się nie otworzy, dopóki
  stacja na chwilę nie dostanie maski /24. Maskę /25 wracasz, gdy przełącznik ma już 192.168.1.2.
- **P2** – przy pierwszym wejściu urządzenie każe ustawić nowe hasło (Cisco: także nowego
  użytkownika, nie „cisco”). Proste hasło zostanie odrzucone – „zgodnie z wymogami urządzenia”.

**Odsunięte do warstwy 6 („kolejność i sprawdzenie”):** adres i brama przełącznika (kreator, VLAN 1),
zapis konfiguracji na Cisco (Save), nowy adres panelu rutera po zmianie LAN (10.10.0.1) i odświeżenie
adresu na serwerze.

Schemat: ten sam co w warstwach 1–4, sieci w kolorach, adresy z etapu 2 przygaszone. Ruter
i przełącznik pokazują adresy fabryczne dopiero w krokach, w których o nich mowa.
Postacie: Ola i Kuba, na „ty”. Kwestia najwyżej 12 słów, ruch w osobnym kroku „akcja”.

## Scena

| #   | Kto       | Kwestia                                                                                             | Na schemacie                                                                                                                                      | Kuba (pod) | Przycisk    |
| --- | --------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 1   | Kuba      | Ruter i przełącznik są fabryczne. Jak do nich wejść? 🤔                                             | Obok schematu pięć linijek. Podświetlają się L1 i L3. Pulsują ruter i przełącznik.                                                                | —          | Dalej ▶     |
| 2   | Ola       | Przez przeglądarkę – pod adresem z dokumentacji.                                                    | Bez zmian.                                                                                                                                        | —          | Dalej ▶     |
| 3   | Ola       | Ruter fabrycznie: 192.168.0.1.                                                                      | Pod interfejsem LAN rutera „192.168.0.1/24”, „(fabrycznie, przykład)”.                                                                            | —          | Dalej ▶     |
| 4   | Kuba      | Z którego komputera? Stacja nie ma kabla do rutera.                                                 | Pulsuje kabel ruter–serwer.                                                                                                                       | —          | Dalej ▶     |
| 5   | Ola       | Z serwera. Jego karta WAN jest na »automatycznie«.                                                  | Plakietka „Przeglądarka na: serwer”. Pulsuje karta „WAN” serwera.                                                                                 | serwer     | 🌐 Otwórz ▶ |
| 6   | _akcja_   | _Ruter daje serwerowi adres z DHCP. Panel się otwiera…_                                             | Pod kartą „WAN”: „192.168.0.100”, „(od DHCP, przykład)”. Strzałka „przeglądarka” od karty „WAN” do rutera: „192.168.0.1”. Dymek: „192.168.0.1 ✓”. | serwer     | Dalej ▶     |
| 7   | Kuba      | Wszedłem! Ruter każe utworzyć hasło.                                                                | Podświetla się L2.                                                                                                                                | serwer     | Dalej ▶     |
| 8   | Ola       | Ustaw takie, jakiego chce. I zapisz je sobie.                                                       | Bez zmian.                                                                                                                                        | serwer     | Dalej ▶     |
| 9   | Kuba      | Przełącznik: 192.168.1.254. Wpiszę stacji 192.168.1.3/25 z arkusza!                                 | Plakietka „Przeglądarka na: stacja”. Pod przełącznikiem „192.168.1.254/24”, „(fabrycznie)”. Podświetla się L5. Pulsuje kabel stacja–przełącznik.  | stacja     | 🌐 Otwórz ▶ |
| 10  | _akcja_   | _Stacja z 192.168.1.3/25 otwiera 192.168.1.254…_                                                    | Strzałka „przeglądarka” od stacji do przełącznika: „192.168.1.254”. Dymek: „192.168.1.254 ✕ brak odpowiedzi”.                                     | stacja     | Dalej ▶     |
| 11  | Kuba      | Nie wchodzi?! Kabel jest, sieć ta sama 😩                                                           | Pulsuje „/25” pod stacją.                                                                                                                         | stacja     | Dalej ▶     |
| 12  | Ola       | Kabel jest. Ale dla maski /25 adres .254 jest za płotem.                                            | Bez zmian.                                                                                                                                        | stacja     | Dalej ▶     |
| 13  | Ola       | Ustaw stacji na chwilę maskę /24.                                                                   | Bez zmian.                                                                                                                                        | stacja     | ⚙️ Zmień ▶  |
| 14  | _akcja_   | _Stacja ma maskę /24 – panel przełącznika się otwiera…_                                             | Pod stacją „192.168.1.3/24”, „(na chwilę)”. Dymek: „192.168.1.254 ✓”.                                                                             | stacja     | Dalej ▶     |
| 15  | Ola       | Login i hasło fabryczne są w dokumentacji: cisco i cisco.                                           | Podświetla się L3.                                                                                                                                | stacja     | Dalej ▶     |
| 16  | Kuba      | Każe założyć nowego użytkownika – nie »cisco«. Hasło »cisco123« odrzucił 😩                         | Podświetla się L4.                                                                                                                                | stacja     | Dalej ▶     |
| 17  | Ola       | Twoje ma trzy błędy: »cisco«, ciąg »123«, mało rodzajów znaków.                                     | Bez zmian.                                                                                                                                        | stacja     | Dalej ▶     |
| 18  | Ola       | Gdy przełącznik ma już 192.168.1.2, wróć stacji /25.                                                | Pod przełącznikiem „192.168.1.2/25”, „(po konfiguracji)”. Pod stacją znów „192.168.1.3/25”. Podświetla się L5.                                    | stacja     | Dalej ▶     |
| 19  | _zagadka_ | Stacja 192.168.1.3/25 nie otwiera 192.168.1.254. Czemu? A) Zły kabel. B) .254 jest za płotem maski. | Stan z kroku 10.                                                                                                                                  | —          | Teraz Ty ▶  |

**Kuba (pod):** sylwetka pod urządzeniem, przy którym Kuba pracuje w tym kroku (PYT-102a, PYT-104a); „—” – czyta arkusz, sylwetki nie ma.

Reakcje na zagadkę:

- A: „Kabel jest dobry. Maska /25 kończy sieć na .127.”
- B: „Właśnie tak – na chwilę potrzebna jest maska /24.”

## Ćwiczenie (uczeń sam)

Schemat w kolorach, adresy z etapu 2 przygaszone. Pod ruterem „192.168.0.1/24”, pod przełącznikiem
„192.168.1.254/24”, oba z dopiskiem „(fabrycznie)”. Bez strzałki „przeglądarka” i bez dymka.

| #   | Polecenie                                                   | Co robi uczeń                        | Dobra odpowiedź     | Reakcja na błąd                                              |
| --- | ----------------------------------------------------------- | ------------------------------------ | ------------------- | ------------------------------------------------------------ |
| 1   | Kliknij kartę, z której wejdziesz na fabryczny ruter.       | klika kartę                          | karta „WAN” serwera | „Szukaj karty z kablem do rutera i adresem »automatycznie«.” |
| 2   | Kliknij linijkę, która mówi, skąd wziąć adres przełącznika. | klika linijki L1–L5, potem „Sprawdź” | L3                  | „Ta linijka nie mówi o adresie przełącznika.”                |
| 3   | Które hasło przyjmie przełącznik Cisco?                     | wybiera A, B albo C                  | B                   | (osobno przy odpowiedzi – niżej)                             |
| 4   | Przełącznik ma już 192.168.1.2. Co robisz ze stacją?        | wybiera A albo B                     | B                   | „Arkusz każe /25. Maska /24 była tylko kluczem do panelu.”   |

Ćwiczenie 2 – reakcja, gdy uczeń zaznaczy L5 (jedyna linijka z adresem): „To adres stacji. Adres
przełącznika podaje dokumentacja – patrz L3.”

Ćwiczenie 2 – reakcja, gdy uczeń nie zaznaczy L3: „Szukaj linijki o dokumentacji przełącznika.”

Odpowiedzi do zadania 3: A) cisco2025 – reakcja: „Hasło nie może zawierać »cisco«.” · B) Pracownia#47Kz ·
C) Haslo123 – reakcja: „Ciąg »123« jest zabroniony.”

Odpowiedzi do zadania 4: A) Zostawiam /24. B) Przywracam 192.168.1.3/25 z arkusza.

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 5

- **Skąd wziąć adres i hasło fabryczne?** Z dokumentacji w folderach RUTER i PRZEŁĄCZNIK. Adresy
  w tej lekcji są z emulatorów producentów (TP-Link Archer C6, Cisco CBS350) – Twój model może mieć inne.
- **Czy mogę wejść na ruter ze stacji?** Tak – kablem na chwilę do rutera, z kartą ustawioną na
  „automatycznie”. Z serwera jest prościej: kabel do rutera i tak jest na schemacie.
- **Czy przełącznik może rozdawać adresy?** Ten model ma serwer DHCP, ale z fabryki wyłączony. Sam
  pyta o adres, a gdy nikt nie odpowie, bierze 192.168.1.254.
- **Jakie hasło przyjmie Cisco?** Co najmniej 8 znaków i 3 z 4 rodzajów: wielka litera, mała litera,
  cyfra, znak specjalny. Bez »cisco«, »cbs«, nazwy użytkownika i ciągów typu »abc« albo »123«.
- **Co, gdy po zmianie adresu panel przestaje odpowiadać?** Urządzenie ma już nowy adres – wejdź pod
  nowy. Ćwiczysz to w warstwie 6.
- **Dlaczego na Cisco trzeba kliknąć Save?** Apply zmienia tylko bieżącą konfigurację, Save zapisuje
  ją na stałe – bez tego restart kasuje zmiany. Ćwiczysz to w warstwie 6.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Adresy fabryczne zależą od modelu: tu TP-Link Archer C6 v4 (192.168.0.1, panel także pod
  tplinkwifi.net, przy pierwszym wejściu „utwórz hasło”) i Cisco CBS350 (192.168.1.254/24, cisco/cisco).
  Model TP-Link w pracowni do potwierdzenia (PYT-091).
- 192.168.0.100 (adres serwera od fabrycznego DHCP rutera) to przykład; sieć fabryczna rutera nie ma
  koloru na schemacie – to jeszcze nie sieć z arkusza.
- Stan startowy stacji: przed zadaniem 6 stacja nie ma adresu z arkusza; Kuba wpisuje go w kroku 9,
  bo zadanie 6 jest w arkuszu – to jego wpadka.
- Zamiast maski /24 można dać stacji adres z drugiej połowy (np. 192.168.1.200/25) – /24 jest prostsze
  i łączy się z „Płotami maski”.
- Cisco kończy sesję po 10 minutach bezczynności – trzeba się zalogować ponownie.

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** strzałka „przeglądarka” (ciągła, szara, z adresem); plakietka
  i dymek już są; dwa wiersze napisu pod kartą (adres + dopisek „fabrycznie / przykład / na chwilę”).
- **Strona:** piąta zakładka „Jak wejść na urządzenie?” na stronie „Arkusz krok po kroku”.
