# Arkusz krok po kroku, warstwa 8 „Jak sprawdzić, że działa?” — scenariusz do akceptacji

Wersja 2 · 2026-11-25 · podział warstw: PYT-106a · napisany według `wzorce-scenariuszy.md` · akceptacja: PYT-117.
Źródła: arkusz styczeń 2025 (zadanie 8); zasady oceniania styczeń 2026 (kryteria 4.8–4.10: „urządzenie
odpowiada na polecenie, np. ping”) i czerwiec 2025 (kryteria 3.7–3.9: „Wykonany test potwierdzający
komunikację … np. ping”).

Zmiany względem wersji 1 – po recenzji (`prompt-recenzent.md`, wszystkie 12 uwag przyjęte): napis
o zaporze dopiero, gdy Ola ją nazywa (krok 9), w ćwiczeniu go nie ma; reguła „ping z arkusza zostaje
w jednej sieci” w kroku 17 i w modelu; „ten serwer” zamiast prawa ogólnego; powód zapory: Windows
z fabryki nie odpowiada na ping; P2 rodzi się z L1 („ze stacją oraz interfejsem rutera”, krok 13); bez
„warstwy 2” w kwestii; L4 w całości, przy egzaminatorze pingi i ipconfig; ćwiczenie 4 o karcie serwera;
zagadka o zgłoszeniu gotowości; poprawiony cytat z zasad oceniania; nowy krok o „żądaniu echa” (krok 3);
strzałka „ping” w kolorze neutralnym, obie ✓ widoczne od kroku 17; schemat jak na końcu warstwy 7.

**Cel warstwy:** uczeń wie, skąd i dokąd robi ping z zadania 8, co zrobić, gdy stacja nie odpowiada,
i którego „nie działa” nie trzeba naprawiać.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Działa = urządzenie odpowiada na ping z serwera.
2. Windows z fabryki nie odpowiada na ping – na stacji włącz regułę zapory.
3. Ping z arkusza zostaje w jednej sieci. Ze stacji do rutera nie przejdzie – to nie błąd.

## Linijki z arkusza (styczeń 2025) – tylko te cztery

Reszta arkusza jest na tej zakładce ukryta. Wszystkie cztery są z zadania 8.

| #   | Gdzie     | Linijka z arkusza (co do słowa)                                                                                                                                                                                                                                                                          |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | zadanie 8 | 8. Na serwerze za pomocą poleceń systemowych wykonaj test komunikacji serwera ze stacją roboczą oraz interfejsem LAN rutera.                                                                                                                                                                             |
| L2  | zadanie 8 | Wyświetl adres IP interfejsu WAN serwera.                                                                                                                                                                                                                                                                |
| L3  | zadanie 8 | W razie potrzeby na stacji roboczej zmień odpowiednio ustawienia zapory sieciowej.                                                                                                                                                                                                                       |
| L4  | zadanie 8 | UWAGA: Po wykonaniu testów połączenia zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do przeprowadzenia ponownego sprawdzenia komunikacji serwera z ruterem oraz stacją roboczą. Sprawdzenie wykonaj w obecności egzaminatora. Na ekranie serwera wyświetl automatycznie nadany adres IP |

**Nowa rzecz na schemacie:** strzałka „ping” – kropkowana, w kolorze neutralnym (nie w kolorze sieci) –
od karty, z której pingujemy, do celu; na końcu ✓ („odpowiedź”) albo ✕ („limit czasu”). Pomocniczo:
napis pod stacją „🛡 zapora: ping zablokowany / dozwolony” (zwykły napis pod kartą, jak „💾 zapisane”
w warstwie 6).

**Pułapki (dwie):**

- **P1** – Windows z fabryki nie odpowiada na ping. Serwer widzi „Request timed out.”, choć
  adres jest z arkusza. Naprawa: reguła zapory „żądanie echa ICMPv4” – linijka L3. Haczyk: L3 stoi
  w zadaniu „na serwerze”, a robi się ją na stacji.
- **P2** – L1 łatwo przeczytać jako „ze stacji do interfejsu rutera”. Ping ze stacji do rutera nie
  przechodzi – to nie błąd: ten serwer nie przekazuje ruchu dalej (✕ przy bramie, warstwa 2). Ping
  z arkusza zostaje w jednej sieci: z serwera do rutera zieloną kartą, do stacji niebieską.

**Odsunięte:** zadanie 9 (strona www.egzamin.local w maszynie wirtualnej – DNS z warstwy 4 i tryb
mostkowany karty maszyny) – do warstwy 9 i do notatki.

Schemat: jak na końcu warstwy 7 – w kolorach, kable z nazwami portów, port WAN rutera pusty; adresy
z arkusza przy kartach przygaszone (jak w warstwach 5–6); pod kartą „WAN” serwera „10.10.0.20”
(z rezerwacji, warstwa 3). Postacie: Ola i Kuba. Kwestia najwyżej 12 słów.

## Scena

| #   | Kto       | Kwestia                                                                           | Na schemacie                                                                                                                                                            | Kuba (pod) | Przycisk    |
| --- | --------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 1   | Kuba      | Wszystko ustawione i zapisane. Jak sprawdzić, że działa? 🤔                       | Schemat jak na końcu warstwy 7, adresy przygaszone. Podświetla się L1.                                                                                                  | —          | Dalej ▶     |
| 2   | Ola       | Test komunikacji to ping. Z serwera: do stacji i do rutera.                       | Pulsują interfejs LAN rutera i karta „LAN 2” stacji.                                                                                                                    | —          | Dalej ▶     |
| 3   | Ola       | Ping wysyła »żądanie echa«. Odpowiedź znaczy: działa.                             | Bez zmian.                                                                                                                                                              | —          | Dalej ▶     |
| 4   | Kuba      | Siadam do serwera. Najpierw ruter: ping 10.10.0.1.                                | Bez zmian.                                                                                                                                                              | serwer     | 📶 Ping ▶   |
| 5   | _akcja_   | _Kuba wpisuje ping do rutera…_                                                    | Strzałka „ping” od karty „WAN” serwera do interfejsu LAN rutera, na końcu ✓. Przy serwerze „ping 10.10.0.1 → Reply from 10.10.0.1 ✓”.                                   | serwer     | Dalej ▶     |
| 6   | Kuba      | Ruter odpowiada! Teraz stacja: ping 192.168.1.3.                                  | Bez zmian.                                                                                                                                                              | serwer     | 📶 Ping ▶   |
| 7   | _akcja_   | _Kuba wpisuje ping do stacji…_                                                    | Druga strzałka „ping” od karty „LAN 1” serwera do karty „LAN 2” stacji, na końcu ✕. Przy serwerze „ping 192.168.1.3 → Request timed out. ✕”.                            | serwer     | Dalej ▶     |
| 8   | Kuba      | Stacja milczy 😩 Może zły adres? Zmienię go.                                      | Bez zmian.                                                                                                                                                              | serwer     | Dalej ▶     |
| 9   | Ola       | Stop. Adres jest z arkusza. Windows z fabryki nie odpowiada na ping.              | Pułapka P1: pod stacją pojawia się i miga „🛡 zapora: ping zablokowany”.                                                                                                | serwer     | Dalej ▶     |
| 10  | Ola       | Arkusz to przewidział – linijka o zaporze. Idź do stacji.                         | Podświetla się L3.                                                                                                                                                      | serwer     | 🛡 Zapora ▶ |
| 11  | _akcja_   | _Kuba włącza w zaporze stacji regułę »żądanie echa ICMPv4«…_                      | Pod stacją „🛡 zapora: ping dozwolony” (dobrze). Strzałka ✕ do stacji znika; strzałka ✓ do rutera zostaje.                                                              | stacja     | Dalej ▶     |
| 12  | _akcja_   | _Kuba wraca do serwera i jeszcze raz pinguje stację…_                             | Strzałka „ping” do stacji, na końcu ✓. Przy serwerze „ping 192.168.1.3 → Reply from 192.168.1.3 ✓”.                                                                     | serwer     | Dalej ▶     |
| 13  | Kuba      | »Ze stacją oraz interfejsem rutera« – ping ze stacji do rutera? Idę!              | Podświetla się L1.                                                                                                                                                      | serwer     | 📶 Ping ▶   |
| 14  | _akcja_   | _Kuba wpisuje na stacji ping do rutera…_                                          | Strzałki z serwera znikają. Strzałka „ping” od stacji do interfejsu LAN rutera, urywa się ✕ na serwerze. Przy stacji „ping 10.10.0.1 → Upłynął limit czasu żądania. ✕”. | stacja     | Dalej ▶     |
| 15  | Kuba      | Znowu limit czasu! Coś zepsułem? 😩                                               | Bez zmian.                                                                                                                                                              | stacja     | Dalej ▶     |
| 16  | Ola       | Nie. Ten serwer nie przekazuje ruchu dalej. Pamiętasz ✕ przy bramie?              | Pułapka P2: miga ✕ na serwerze.                                                                                                                                         | stacja     | Dalej ▶     |
| 17  | Ola       | Z serwera: do rutera zieloną kartą, do stacji niebieską.                          | Strzałka ze stacji znika. Obie strzałki „ping” z serwera, na końcach ✓. Pulsują obie karty serwera.                                                                     | stacja     | Dalej ▶     |
| 18  | _akcja_   | _Kuba wraca do serwera i wyświetla adres WAN: ipconfig…_                          | Przy serwerze „ipconfig → WAN: 10.10.0.20”. Pulsuje adres pod kartą „WAN” serwera. Podświetla się L2.                                                                   | serwer     | Dalej ▶     |
| 19  | Ola       | Zgłoś gotowość. Przy egzaminatorze powtórzysz pingi i ipconfig.                   | Podświetla się L4.                                                                                                                                                      | serwer     | Dalej ▶     |
| 20  | _zagadka_ | Ping do stacji: limit czasu. Zgłaszasz gotowość? A) Tak. B) Nie, najpierw zapora. | Stan z kroku 19 bez poleceń przy serwerze.                                                                                                                              | —          | Teraz Ty ▶  |

**Kuba (pod):** sylwetka pod urządzeniem, przy którym Kuba pracuje w tym kroku (PYT-102a, PYT-104a);
„—” – czyta arkusz, sylwetki nie ma. Ping wpisuje się w wierszu poleceń tego komputera, z którego się
pinguje – dlatego sylwetka stoi pod serwerem, a w kroku 11 i w krokach 14–17 pod stacją.

Reakcje na zagadkę:

- A: „Punkt jest za odpowiedź, nie za wpisanie pingu.”
- B: „Właśnie tak – najpierw stacja musi odpowiedzieć.”

## Ćwiczenie (uczeń sam)

Schemat jak w kroku 1: bez napisu o zaporze, bez strzałek „ping” i bez poleceń przy serwerze.

| #   | Polecenie                                                    | Co robi uczeń                        | Dobra odpowiedź     | Reakcja na błąd                                                      |
| --- | ------------------------------------------------------------ | ------------------------------------ | ------------------- | -------------------------------------------------------------------- |
| 1   | Kliknij linijki, które wykonasz poleceniami na serwerze.     | klika linijki L1–L4, potem „Sprawdź” | L1, L2              | „Zaporę zmieniasz na stacji – choć linijka stoi w zadaniu 8.”        |
| 2   | Serwer: ruter odpowiada, stacja – limit czasu. Co zmieniasz? | wybiera A albo B                     | A                   | „Adres wpisałeś z arkusza. Windows z fabryki nie odpowiada na ping.” |
| 3   | Ping ze stacji do rutera nie przechodzi. Co robisz?          | wybiera A albo B                     | B                   | „To nie błąd. Ten serwer nie przekazuje ruchu dalej.”                |
| 4   | Kliknij kartę, którą serwer pinguje ruter.                   | klika kartę serwera                  | karta „WAN” serwera | „Ruter jest w zielonej sieci. Ping idzie zieloną kartą.”             |

Odpowiedzi do zadania 2: A) Regułę zapory na stacji. B) Adres IP stacji.

Odpowiedzi do zadania 3: A) Szukam błędu w bramie stacji. B) Nic – tak ma być.

Ćwiczenie 1 – reakcja, gdy uczeń kliknie L4: „To zgłoszenie ręką. Polecenia powtórzysz przy egzaminatorze.”

Ćwiczenie 1 – reakcja, gdy uczeń pominie tylko L2: „Brakuje adresu WAN – wyświetlasz go na serwerze.”

Ćwiczenie 1 – reakcja, gdy brakuje więcej niż jednej linijki: „Przy serwerze robisz dwie rzeczy: ping i ipconfig.”

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 8

- **Co to jest ping?** Wysyła „żądanie echa” – wiadomość ICMP – i czeka na odpowiedź. Na serwerze
  (po angielsku): „Reply from …” – działa, „Request timed out.” – odpowiedź nie przyszła. Na stacji
  (po polsku): „Odpowiedź z …” i „Upłynął limit czasu żądania.”
- **Za co są punkty?** Styczeń 2026: „urządzenie odpowiada na polecenie, np. ping”. Czerwiec 2025:
  „test potwierdzający komunikację”. Liczy się odpowiedź, nie samo wpisanie polecenia.
- **Dlaczego zapora blokuje ping?** Zapora Windows z fabryki nie odpowiada na „żądanie echa”. Reguła
  „żądanie echa ICMPv4” to wyjątek tylko dla pingu. Reguł o tej nazwie bywa kilka (dla różnych profili
  sieci) – włącz wszystkie.
- **Czemu nie wyłączyć całej zapory?** Arkusz mówi „zmień odpowiednio”. Wyłączona zapora otwiera
  wszystko, reguła – tylko ping.
- **Jak sprawdzić, że to nie adres?** Na stacji ipconfig; z serwera ping 192.168.1.2 – przełącznik
  odpowiada, więc niebieska sieć działa.
- **ipconfig pokazuje inny adres niż 10.10.0.20?** Sprawdź rezerwację i odśwież adres (warstwa 3).
- **A zadanie 9?** Strona www.egzamin.local w maszynie wirtualnej sprawdza DNS z warstwy 4 i kartę
  maszyny w trybie mostkowanym. Wraca w warstwie 9.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Pracownia (PYT-120): serwer – Windows Server 2022 po angielsku, stacja – Windows 11 po polsku. Wyniki
  pingu i ipconfig na serwerze są po angielsku, reguła zapory i wyniki na stacji – po polsku.
- Nazwa reguły (Zapora Windows Defender z zabezpieczeniami zaawansowanymi → Reguły przychodzące),
  sprawdzone w internecie (PYT-118): po angielsku „File and Printer Sharing (Echo Request - ICMPv4-In)”;
  po polsku zaczyna się od „Udostępnianie plików i drukarek (żądanie echa” – końcówka różni się między
  źródłami („ICMPv4 przychodzące” / „ruch przychodzący ICMPv4”). Szukaj po słowach „żądanie echa”
  i „ICMPv4”. Scena mówi krótko „żądanie echa ICMPv4”.
- Reguła jest osobno dla profili sieci (prywatna, publiczna, domena); stacja bez bramy do internetu
  ląduje zwykle w profilu publicznym.
- Czy egzaminator uznaje wyłączenie całej zapory – nie wiemy; notatka zaleca regułę.
- Zapora serwera nie przeszkadza: ping wychodzi z serwera, a odpowiedź na własne żądanie zapora
  przepuszcza. Ruter i przełącznik odpowiadają na ping z fabryki.
- ping w Windows wysyła 4 żądania; scena pokazuje jedną linijkę wyniku.
- Zasady oceniania z innych sesji każą też pingować przełącznik albo WAN rutera; arkusz ze stycznia
  2025 – tylko stację i LAN rutera.
- ipconfig pokazuje obie karty serwera; scena pokazuje tylko WAN.

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** strzałka „ping” z ✓ / ✕ (neutralny kolor); polecenia także przy stacji;
  reszta (strzałka urwana na serwerze, polecenia przy serwerze, napisy pod kartą, kable i porty
  z warstwy 7, sylwetka, linijki z „Sprawdź”, kliknięcie karty) już jest.
- **Zakładka:** „8 Sprawdzam” (PYT-112a).
- **Zadanie 9 poza tą warstwą** (brief wymieniał je w materiale) – trzecia pułapka (tryb mostkowany)
  złamałaby regułę warstwy.
