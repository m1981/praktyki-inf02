# Arkusz krok po kroku, warstwa 9 „Cały arkusz” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · kształt: PYT-121a (zakreślacz w kolejności pracy), PYT-122a (strona arkusza
zamiast schematu, mały schemat pod spodem), PYT-123a (makieta), PYT-124a (oznaczenia = zakładki 1–8) ·
napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-125.

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, 11 uwag przyjętych, 1 częściowo): P9 rodzi
się ze sceny (Kuba zostawia tryb karty, strona się nie otwiera, dopiero wtedy Ola); karta mostkowana „do
LAN 2” i notatka o wyborze karty; poprawiona notatka o NAT (adres 192.168.1.4 nie wystarczy); zagadka
o P9; ćwiczenie 2 o nowym skoku (zadanie 6 przed 3); ćwiczenie 3 z „Sieć NAT”; fragment może mieć dwie
zakładki (F5, F8, F9 – także 2); zakładka 1 w filtrze pokazuje schemat; zakreślone wszystkie UWAGI
o zgłoszeniu (zadania 2, 3, 8, 9); „wróć /25” po Save; „Wracam” i „Idę do stacji” zamiast teleportu;
dokładny opis wyjątku od reguły; ramka „maszyna” przy stacji na małym schemacie; F3 (WAN rutera)
dopisany, bo Ola o nim mówi; F7 z pułapką „adres zmień na .20”; nowa notatka „A zadanie 1?”.
Częściowo (uwaga 5): reakcja na złą zakładkę nazywa haczyk; bez drugiego kliknięcia – ćwiczenie 1
i tak jest na granicy czasu.

**Cel warstwy:** uczeń czyta cały arkusz tak, jak administrator: w kolejności pracy, przy każdej
linijce wie, którą zakładkę ona przypomina i jaka pułapka przy niej czeka – i jedną rzecz dokłada:
tryb mostkowany karty maszyny wirtualnej (zadanie 6 i 9).

**Reguła warstwy – wyjątek:** to warstwa zbiorcza. Linijek jest więcej niż 5, bo uczeń przechodzi cały
arkusz; to przegląd, nie nowy materiał. Nowe są: F14 (tryb karty maszyny wirtualnej) i F15 (strona
w maszynie wirtualnej – cel znany z warstwy 4), pułapka P9 i na ekranie strona arkusza z zakreślaczem
oraz ramka „maszyna” przy stacji na małym schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Arkusz czytam w kolejności pracy, nie w kolejności zadań.
2. Przy każdej linijce pytam: której zakładki to dotyczy i jaka tu jest pułapka?
3. Karcie maszyny wirtualnej ustaw tryb mostkowany – wtedy jest w sieci stacji.

## Strona arkusza

Na ekranie: zadania 2–9 z arkusza ze stycznia 2025, co do słowa, krojem Arial, w układzie z PDF
(numeracja, myślniki, wcięcia, pochylone UWAGI, oryginalny schemat w zadaniu 4). Zadanie 5 wyszarzone
(nie dotyczy sieci). W zadaniu 7 część o IIS i 7-Zip skrócona do „…” (Filar 2). Stopka „arkusze.pl”
pominięta (dopisek serwisu, nie CKE). Strona przewija się sama do zakreślonego fragmentu.

## Zakreślane fragmenty (co do słowa) – zakładka i pułapka

Plakietki na marginesie strony: zakładka (albo dwie), która fragment wyjaśnia, i pułapka – po jednej na
linijkę, z warstw 1–8. U2, U3, U8, U9 – UWAGI o zgłoszeniu pod zadaniami 2, 3, 8, 9: zakreślane bez
plakietki.

| #   | Zadanie | Fragment (co do słowa)                                                                                                                                                                                     | Zakładka                         | Pułapka                                           |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------- |
| F1  | 4       | 4. Za pomocą kabli połączeniowych znajdujących się na stanowisku egzaminacyjnym połącz urządzenia zgodnie ze schematem, a następnie podłącz je do sieci zasilającej.                                       | 7 Kolejność                      | ⚠ serwer do PORT LAN, nie do WAN rutera           |
| F2  | 2       | Ruter pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze RUTER na nośniku opisanym DOKUMENTACJA/PROGRAMY.                                                          | 5 Jak wejść?                     | ⚠ wchodzisz z serwera – karta WAN „automatycznie” |
| F3  | 2       | adres IP interfejsu WAN: 90.0.0.3/28, brama domyślna: 90.0.0.2                                                                                                                                             | 2 Tabela adresów                 | ⚠ brama WAN jest u dostawcy, poza schematem       |
| F4  | 2       | serwer DNS dla interfejsu WAN: 4.4.4.4 oraz drugi serwer DNS: 4.4.5.5, jeśli jest wymagany                                                                                                                 | 4 Kto zna nazwy?                 | ⚠ DNS rutera, nie stacji                          |
| F5  | 2       | adres IP interfejsu LAN: 10.10.0.1/24                                                                                                                                                                      | 7 Kolejność · 2 Tabela adresów   | ⚠ panel „ucieka”                                  |
| F6  | 7       | odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze                                                                                                                                         | 7 Kolejność                      | ⚠ potrzebna już przy zadaniu 2                    |
| F7  | 2       | zarezerwowany adres IP 10.10.0.20 dla interfejsu WAN serwera                                                                                                                                               | 3 Skąd adres?                    | ⚠ karta WAN; adres zmień na .20                   |
| F8  | 6       | adres IP: 192.168.1.3/25                                                                                                                                                                                   | 5 Jak wejść? · 2 Tabela adresów  | ⚠ do panelu przełącznika /24 na chwilę            |
| F9  | 3       | adres IP: 192.168.1.2/25                                                                                                                                                                                   | 6 Przełącznik · 2 Tabela adresów | ⚠ VLAN 1, potem Save                              |
| F10 | 7       | brama domyślna: brak                                                                                                                                                                                       | 2 Tabela adresów                 | ⚠ „brak” = puste pole                             |
| F11 | 7       | ustaw w strefie egzamin.local nowy rekord hosta o nazwie www, powiązany z adresem IP interfejsu sieciowego LAN 1                                                                                           | 4 Kto zna nazwy?                 | ⚠ adres karty LAN 1, nie WAN                      |
| F12 | 8       | Na serwerze za pomocą poleceń systemowych wykonaj test komunikacji serwera ze stacją roboczą oraz interfejsem LAN rutera.                                                                                  | 8 Sprawdzam                      | ⚠ z serwera, nie ze stacji                        |
| F13 | 8       | W razie potrzeby na stacji roboczej zmień odpowiednio ustawienia zapory sieciowej.                                                                                                                         | 8 Sprawdzam                      | ⚠ reguła na stacji, nie na serwerze               |
| F14 | 6       | ustaw tryb pracy karty sieciowej maszyny wirtualnej, który umożliwi realizację połączenia z fizyczną siecią lokalną                                                                                        | 9 Cały arkusz                    | ⚠ nowe: karta mostkowana, nie NAT                 |
| F15 | 9       | Na stacji roboczej w systemie Windows, w utworzonej maszynie wirtualnej Linux uruchom przeglądarkę internetową i wyświetl za pomocą adresu www.egzamin.local stronę internetową, udostępnioną przez serwer | 4 Kto zna nazwy?                 | ⚠ DNS maszyny: 192.168.1.1                        |

**Mały schemat pod stroną:** ten sam układ co w warstwach 1–8, w kolorach, bez adresów; świeci
urządzenie albo kabel, którego dotyczy fragment; pod nim wiersz z sylwetką Kuby (kolumna „Kuba (pod)”).
Od kroku 15 przy stacji mała ramka „maszyna”: szara i przerywana (NAT), niebieska po zmianie na
mostkowaną (krok 18).

**Pułapki:** z warstw 1–8 – po jednej na linijkę, na plakietkach. Nowa jedna:

- **P9** – nowa maszyna wirtualna ma domyślnie kartę w trybie NAT: jest w osobnej, wirtualnej sieci
  programu i nawet z adresem 192.168.1.4 nie dosięgnie serwera. Arkusz mówi to opisowo („połączenia
  z fizyczną siecią lokalną”) – trzeba wybrać kartę mostkowaną, do karty LAN 2 stacji.

## Scena

| #   | Kto       | Kwestia                                                                       | Na stronie i schemacie                                                                                        | Kuba (pod) | Przycisk   |
| --- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| 1   | Kuba      | Cały arkusz naraz! Od czego zacząć? 🤔                                        | Strona od zadania 2, nic nie zakreślone.                                                                      | —          | Dalej ▶    |
| 2   | Ola       | Od kabli – zadanie 4. Serwer wpinasz w PORT LAN.                              | Zakreśla się F1; strona zjeżdża do zadania 4. Świecą kable.                                                   | —          | Dalej ▶    |
| 3   | Kuba      | Siadam do serwera. Ruter fabryczny – adres z dokumentacji.                    | Zakreśla się F2; strona wraca do zadania 2. Świecą interfejs LAN rutera i karta „WAN” serwera.                | serwer     | Dalej ▶    |
| 4   | Ola       | Najpierw adres WAN i DNS. Ten DNS jest dla rutera.                            | Zakreślają się F3 i F4. Świeci karta „WAN” rutera.                                                            | serwer     | Dalej ▶    |
| 5   | Kuba      | Zmieniam adres LAN na 10.10.0.1… panel zniknął!                               | Zakreśla się F5. Świeci interfejs LAN rutera.                                                                 | serwer     | Dalej ▶    |
| 6   | Ola       | Odśwież adres serwera. Ta linijka stoi w zadaniu 7.                           | Zakreśla się F6; strona zjeżdża do zadania 7. Świeci karta „WAN” serwera.                                     | serwer     | Dalej ▶    |
| 7   | Ola       | Teraz DHCP i rezerwacja – dla karty WAN serwera.                              | Zakreśla się F7; strona wraca do zadania 2. Świeci karta „WAN” serwera.                                       | serwer     | Dalej ▶    |
| 8   | Kuba      | Odświeżam drugi raz: 10.10.0.20. Ruter gotowy, ręka!                          | Zakreśla się U2.                                                                                              | serwer     | Dalej ▶    |
| 9   | Kuba      | Teraz przełącznik. Siadam do stacji – maska /24 na chwilę.                    | Zakreśla się F8; strona zjeżdża do zadania 6. Świeci karta „LAN 2” stacji.                                    | stacja     | Dalej ▶    |
| 10  | Ola       | Adres na VLAN 1, Save. Stacji wróć /25 i ręka.                                | Zakreślają się F9 i U3; strona wraca do zadania 3. Świeci przełącznik.                                        | stacja     | Dalej ▶    |
| 11  | Kuba      | Wracam do serwera. Karta LAN 1, brama – brak.                                 | Zakreśla się F10; strona zjeżdża do zadania 7. Świeci karta „LAN 1” serwera.                                  | serwer     | Dalej ▶    |
| 12  | Ola       | Rekord www to adres karty LAN 1, nie WAN.                                     | Zakreśla się F11. Świeci karta „LAN 1” serwera.                                                               | serwer     | Dalej ▶    |
| 13  | Kuba      | Ping z serwera: stacja milczy. Idę do stacji – zapora!                        | Zakreślają się F12 i F13; strona zjeżdża do zadania 8. Świecą obie karty serwera i karta „LAN 2” stacji.      | serwer     | Dalej ▶    |
| 14  | Kuba      | Reguła włączona. Wracam: ping z serwera przechodzi. Ręka!                     | Zakreśla się U8.                                                                                              | serwer     | Dalej ▶    |
| 15  | Kuba      | Na stacji maszyna wirtualna: adres 192.168.1.4 wpisany. Tryb karty zostawiam. | Zakreśla się F14 – bez plakietki; strona wraca do zadania 6. Przy stacji ramka „maszyna” – szara, przerywana. | stacja     | Dalej ▶    |
| 16  | Kuba      | Strona www.egzamin.local się nie otwiera 😩 A DNS dobry!                      | Zakreśla się F15; strona zjeżdża do zadania 9. Ramka „maszyna” miga.                                          | stacja     | Dalej ▶    |
| 17  | Ola       | NAT chowa maszynę za stacją. Ustaw mostkowaną, do LAN 2.                      | Pułapka P9: strona wraca do F14, pojawia się i miga jej plakietka „⚠ nowe: karta mostkowana, nie NAT”.        | stacja     | Dalej ▶    |
| 18  | Kuba      | Mostkowana… strona działa! Ręka – koniec arkusza.                             | Ramka „maszyna” niebieska. Zakreśla się U9; strona zjeżdża do zadania 9.                                      | stacja     | Dalej ▶    |
| 19  | _zagadka_ | Maszyna ma 192.168.1.4, karta w NAT. Serwer ją widzi? A) Tak. B) Nie.         | Wszystkie zakreślenia blade; ramka „maszyna” szara, przerywana.                                               | —          | Teraz Ty ▶ |

**Kuba (pod):** sylwetka w wierszu pod małym schematem, pod urządzeniem, przy którym Kuba pracuje
(PYT-102a, PYT-104a); „—” – czyta arkusz albo rozmawia. Ruter ustawia przeglądarką z serwera (kroki
3–8), przełącznik ze stacji (kroki 9–10); maszyna wirtualna działa na stacji (kroki 15–18).

Reakcje na zagadkę:

- A: „Adres to nie wszystko. NAT chowa maszynę za stacją.”
- B: „Właśnie tak – dopiero mostkowana wpina ją do niebieskiej sieci.”

## Ćwiczenie (uczeń sam)

Strona arkusza bez zakreśleń i bez plakietek; mały schemat bez sylwetki i bez ramki „maszyna”.

| #   | Polecenie                                                         | Co robi uczeń                                                          | Dobra odpowiedź              | Reakcja na błąd                                             |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| 1   | Kliknij obramowaną linijkę i wybierz zakładkę, która ją wyjaśnia. | klika jedną z linijek F1, F7, F9, F10, F11, F13 i wybiera zakładkę 1–8 | zakładka z tabeli fragmentów | „Haczyk: {pułapka}. Wyjaśnia to zakładka »{zakładka}«.”     |
| 2   | Co robisz wcześniej?                                              | wybiera A albo B                                                       | B                            | „Bez adresu stacji nie otworzysz panelu przełącznika.”      |
| 3   | Jaki tryb karty ustawisz maszynie wirtualnej?                     | wybiera A albo B                                                       | B                            | „»Sieć NAT« to też NAT – maszyna dalej schowana za stacją.” |
| 4   | Wybierz zakładkę – zobacz jej linijki w całym arkuszu.            | klika zakładkę 1–9 (bez oceny)                                         | –                            | –                                                           |

Odpowiedzi do zadania 2: A) Adres przełącznika (zadanie 3). B) Adres stacji – maska /24 na chwilę (zadanie 6).

Odpowiedzi do zadania 3: A) Sieć NAT. B) Mostkowana karta sieciowa (bridged).

Ćwiczenie 1 – koniec, gdy wszystkie sześć linijek ma dobrą zakładkę: „✓ Wszystkie linijki rozpoznane.”
Przy F9 dobre są obie zakładki (6 i 2).

Ćwiczenie 4 („jedno pytanie naraz”, PYT-088): po wyborze zakładki zakreślają się wszystkie fragmenty
F1–F15 z tą zakładką, strona zjeżdża do pierwszego; reszta strony przygaszona. Zakładka 1 obramowuje
schemat w zadaniu 4, z dopiskiem: „Ta zakładka czyta schemat, nie linijki.”

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 9

- **Dlaczego zakreślacz skacze po stronie?** Bo idzie w kolejności pracy, a arkusz jest ułożony
  w kolejności oceniania (warstwa 7).
- **A zadanie 1?** To gniazdo i panel krosowy, sprawdzane testerem – dlatego strona zaczyna się od
  zadania 2.
- **Co robi karta mostkowana?** Podłącza maszynę wirtualną do tej samej sieci, w której jest karta LAN 2
  stacji. Maszyna ma wtedy własny adres z niebieskiej sieci: 192.168.1.4.
- **A NAT?** Przy NAT maszyna jest w osobnej, wirtualnej sieci programu. Nawet z adresem 192.168.1.4
  nie dosięgnie serwera. Tryb karty to jej kabel: mostkowana = kabel do przełącznika.
- **Którą kartę wybrać przy mostkowanej?** Program pokazuje kartę stacji pod nazwą sprzętu (np.
  „Intel(R) Ethernet…”), nie „LAN 2”. Nazwę sprzętu karty LAN 2 zobaczysz w Połączeniach sieciowych.
- **Dlaczego DNS maszyny to 192.168.1.1?** To serwer – on zna nazwę www.egzamin.local (warstwa 4).
- **Czemu zadanie 5 jest szare?** Identyfikacja podzespołów w Linuksie nie dotyczy sieci.
- **Skąd tekst arkusza?** Arkusz CKE ze stycznia 2025, co do słowa. Pominięte fragmenty spoza sieci są
  oznaczone „…”.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Nazwy trybów w polskim VirtualBox („NAT”, „Sieć NAT”, „Mostkowana karta sieciowa (bridged)”) –
  z wiedzy agenta, niesprawdzone na Windows 11 PL w pracowni.
- Wybór karty przy trybie mostkowanym jest pułapką tylko wtedy, gdy stacja ma więcej niż jedną kartę
  (np. Wi-Fi) – nie wiemy, czy w pracowni ma; dlatego jest w kwestii i w notatce, bez osobnego kroku.
- Fragment może pasować do dwóch zakładek; F5, F8 i F9 mają dwie, ćwiczenie 1 przyjmuje obie.
- Kolejność w scenie: konfiguracja serwera (LAN 1, DNS) po przełączniku – tak jak w „Cała kolejność
  pracy” (warstwa 7). Część o IIS i 7-Zip pominięta (Filar 2).
- Arkusz nie podaje MAC; rezerwacja z listy podłączonych urządzeń (warstwa 3).
- Zasad oceniania dla stycznia 2025 nie ma w repozytorium; arkusze z czerwca 2025 i stycznia 2026 (te,
  których zasady mamy) nie mają maszyny wirtualnej – P9 opiera się na treści arkusza i wiedzy
  inżynierskiej.

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** strona arkusza (tekst w danych, nie obraz), zakreślacz z przewijaniem,
  plakietki, mały schemat z wierszem Kuby i ramką „maszyna”, ćwiczenie „linijka → zakładka”, filtr
  „jedno pytanie naraz”.
- **Ramka „maszyna” przy stacji** – dodatek względem makiety (recenzent: jedyna nowość bez obrazka).
- **Zakładka:** „9 Cały arkusz” (PYT-112a).
- **Wysokość:** strona arkusza ok. 330 px + mały schemat z wierszem Kuby ok. 95 px w scenie 470 px.
