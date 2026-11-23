# Mapa nauki sieci a egzamin INF.02

Status: propozycja do decyzji operatora · 2026-11-20

**Wniosek:** Materiały dobrze tłumaczą, JAK działa sieć (ARP, maska, VLAN, routing), ale prawie nie ćwiczą tego, co uczeń robi na egzaminie: bierze schemat i listę adresów, konfiguruje prawdziwy ruter i przełącznik przez przeglądarkę, ustawia karty sieciowe i doprowadza do działającego pinga. Największe braki to: serwer z dwiema kartami między dwiema sieciami, VLAN-y „z tagowaniem i bez”, DHCP z rezerwacją oraz diagnoza „dlaczego ping nie działa”.

## Skąd dane

- Egzamin: treść 11 arkuszy części praktycznej z katalogu `egzaminy/` (czerwiec 2021 – czerwiec 2026). Liczby „ile arkuszy z 11” to moje zliczenie z tekstu zadań.
- Nie mam arkuszy części pisemnej (test), więc nie oceniam, czy teoria (np. model OSI, ARP) wystarcza na test.
- Filar 1: przeczytałem teorię (`01-sieci/index.html`) i znam aplikacje z tej sesji. Laby Packet Tracer oraz filary 2, 3, 4 i 6 sprawdziłem tylko po nagłówkach i wyszukiwaniem słów – kolumna „gdzie u nas” przy nich oznacza „temat tam występuje”, nie „jest dobrze nauczony”.

## Co jest dziś w Filarze 1

Siedem kroków teorii, pięć aplikacji interaktywnych i trzy laby w Packet Tracer.

| Krok teorii                  | Czego uczy                | Aplikacja interaktywna                              | Lab (Packet Tracer)                   |
| ---------------------------- | ------------------------- | --------------------------------------------------- | ------------------------------------- |
| 1. Fundamenty (OSI i TCP/IP) | warstwy L1–L7, TCP a UDP  | –                                                   | –                                     |
| 2. Warstwa 2                 | adres MAC, Switch         | Symulator ARP (tablica MAC Switcha)                 | Lab 1: płaska sieć                    |
| 3. Warstwa 3                 | adres IP, Router          | –                                                   | Lab 1: router, dwie sieci             |
| 4. ARP                       | IP → MAC w sieci lokalnej | Symulator ARP (6 kroków)                            | Lab 1                                 |
| 5. Subnetting                | maska dzieli sieć         | Maska: M1–M4 i Tryb swobodny; Laboratorium podsieci | –                                     |
| 6. VLAN-y                    | jeden switch, kilka sieci | Laboratorium VLAN (4 kłopoty)                       | Lab 2: VLAN, trunk, Router-on-a-Stick |
| 7. Routing                   | statyczny a dynamiczny    | Routing „List za płot” (2 sceny)                    | Lab 3: routing                        |
| brak kroku                   | DHCP, DNS, NAT            | –                                                   | Lab 3: DHCP, DNS, NAT                 |

## Co jest na egzaminie (część praktyczna, sieci)

Posortowane od najczęstszych. Zadanie zawsze ma ten sam kształt: schemat, lista ustawień, test pingiem.

| Obszar na egzaminie                                                | Ile arkuszy z 11 | Przykład z arkusza                                                           |
| ------------------------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------- |
| Połączenie urządzeń według schematu                                | 11               | każdy arkusz ma „Schemat połączenia urządzeń”                                |
| Karta sieciowa: adres IP, maska, brama, DNS, nazwa połączenia      | 11               | 06.2026: „LAN2, 192.168.0.33/24, brama i DNS: adres interfejsu LANW serwera” |
| Test komunikacji poleceniami (ping), pokazanie adresu              | 11               | 01.2026: serwer → stacja, przełącznik, interfejs WAN rutera                  |
| Ruter: adres LAN                                                   | 11               | 06.2026: 192.168.16.1/24                                                     |
| Ruter: WAN ze stałym adresem, bramą i DNS                          | 10               | 01.2026: 90.90.0.1/29, brama 90.90.0.2                                       |
| Maska inna niż /24 (od /8 do /30)                                  | 10               | 01.2025: sieć LAN 192.168.1.0/25; 06.2022: WAN /30                           |
| Przełącznik: adres IP do zarządzania i brama                       | 10               | 01.2026: 10.80.0.3/24, brama 10.80.0.2                                       |
| Okablowanie: T568A/B, wtyk 8P8C, panel krosowy, Keystone, tester   | 9                | 01.2025: panel krosowy + gniazdo naścienne, T568B                            |
| Adres „uzyskiwany automatycznie” i jego odświeżenie                | 7                | 06.2026: LANZ serwera z DHCP rutera, „odśwież adres IP”                      |
| Ruter: DHCP z zakresem i rezerwacją adresu                         | 6                | 06.2026: zakres .12–.20, rezerwacja .12 dla LANZ serwera                     |
| Ruter: DHCP wyłączony                                              | 5                | 06.2025, 01.2026                                                             |
| Serwer z dwiema kartami w dwóch sieciach („brama: brak” na jednej) | 5                | 06.2022, 01.2024, 01.2025, 01.2026, 06.2026                                  |
| Przełącznik: VLAN 802.1Q, porty „bez tagowania”                    | 4                | 06.2023, 06.2024, 06.2025, 06.2026 – każda sesja czerwcowa od 2023           |
| Zapora na stacji blokuje ping („w razie potrzeby zmień”)           | 4                | wszystkie arkusze 2025–2026                                                  |
| Usługa DNS na serwerze (strefa, rekord hosta)                      | 3                | 01.2024, 06.2024, 01.2025                                                    |
| Drukarka sieciowa po adresie IP                                    | 2                | 01.2023, 06.2026 (port TCP/IP, RAW)                                          |
| Trunk („z tagowaniem”) i routing między VLAN-ami na ruterze        | 1                | 06.2024                                                                      |
| Serwer jako router z NAT                                           | 1                | 01.2024 (Windows)                                                            |
| Serwer DHCP na Linuksie                                            | 1                | 01.2026 (podsieć, zakres, brama, DNS, czas dzierżawy)                        |
| „Pierwszy / ostatni adres hosta w podsieci”                        | 1                | 01.2024: podsieć 72.16.31.0/26                                               |
| Zespół kart sieciowych (NIC Teaming)                               | 1                | 06.2025                                                                      |
| Przekierowanie portu na ruterze                                    | 1                | 06.2022                                                                      |
| Sieć Wi-Fi: SSID, WPA2, kanał                                      | 1                | 06.2021                                                                      |
| Karta maszyny wirtualnej w trybie mostka                           | 1                | 01.2025                                                                      |

## Trzy układy sieci, które wracają w arkuszach

Każdy arkusz to jeden z tych układów albo ich połączenie.

| Układ                                                     | Arkusze                                     | Co uczeń musi rozumieć                                                                                     |
| --------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A. Jedna sieć: ruter – przełącznik – serwer i stacja      | 06.2021, 01.2022, 01.2023, 06.2023, 06.2025 | Wszyscy w jednej sieci; bramą jest ruter; część adresów z DHCP rutera (z rezerwacją).                      |
| B. Serwer w środku: ruter – serwer – przełącznik – stacja | 06.2022, 01.2024, 01.2025, 01.2026, 06.2026 | Dwie sieci; serwer ma kartę w każdej; bramą stacji jest serwer, bramą serwera – ruter.                     |
| C. VLAN-y na jednym przełączniku                          | 06.2023, 06.2024, 06.2025, 06.2026          | Port należy do VLAN-u; zwykle „bez tagowania”; w 06.2024 także trunk i routing między VLAN-ami na ruterze. |

## Zestawienie: egzamin a nasze materiały

„Brak” znaczy: w Filarze 1 nie ma ani kroku teorii, ani aplikacji na ten temat.

| Obszar egzaminu                                                | Gdzie jest u nas                                         | Ocena                               | Czego brakuje                                                                                            |
| -------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Czytanie schematu: które urządzenie w której sieci             | Lab 1 (schemat w Packet Tracer)                          | brak                                | Ćwiczenia „ze schematu do tabeli adresów”: uczeń sam ustala sieć, bramę i DNS każdej karty.              |
| Serwer z dwiema kartami (5 z 11, w tym 4 z 5 ostatnich)        | Filar 2, Lab 5a (RRAS i NAT)                             | brak w Filarze 1                    | Zrozumienie: dwie karty = dwie sieci; bramą stacji jest serwer; dlaczego na jednej karcie „brama: brak”. |
| Ruter i przełącznik przez przeglądarkę, z ustawień fabrycznych | laby w Packet Tracer (wiersz poleceń Cisco)              | brak                                | Procedura „jak wejść na urządzenie” i słownik pojęć z arkusza: WAN, LAN, zakres, rezerwacja, brama.      |
| VLAN „bez tagowania” i „z tagowaniem”                          | Laboratorium VLAN (po co), Lab 2 (Cisco)                 | częściowo                           | Język arkusza (802.1Q, tagowanie, tryb dostępu, trunk) i skutek: port w złym VLAN-ie = brak pinga.       |
| Maski /25–/30, pierwszy i ostatni host                         | Maska M1–M4, Laboratorium podsieci                       | częściowo                           | Krótkie zadania liczone ręcznie: adres sieci, Broadcast, pierwszy i ostatni host (planowane L1–L3).      |
| DHCP: zakres, rezerwacja, „uzyskaj automatycznie”              | Lab 3; Filar 2, Lab 4.5                                  | brak teorii i aplikacji w Filarze 1 | Krok teorii i scena: skąd komputer bierze adres, po co rezerwacja, co zrobić, gdy adres nie przyszedł.   |
| DNS jako ustawienie karty (adres serwera, localhost, brak)     | Lab 3; Filar 2, Lab 4                                    | brak teorii w Filarze 1             | Krok teorii: po co DNS na karcie i co wpisać w każdym z trzech przypadków z arkuszy.                     |
| Ping nie działa: co sprawdzić (w tym zapora)                   | Filar 6: Lab 3 (zapora), Lab 6 (rozwiązywanie problemów) | częściowo                           | Jedna lista kontrolna od kabla w górę i scena „zapora blokuje ping” w Filarze 1.                         |
| Okablowanie T568A/B, panel, Keystone                           | Filar 4 (wzmianka)                                       | poza zakresem aplikacji             | To praca rąk; pomoże ściąga kolorów i kolejność czynności. Do decyzji, czy to Filar 1, czy 4.            |
| Mechanizmy: ARP, ramka a pakiet, co robi Router                | Symulator ARP, Routing „List za płot”                    | jest                                | Droga powrotna odpowiedzi i tablica routingu (następne sceny).                                           |
| NAT, przekierowanie portu, Wi-Fi, NIC Teaming                  | Lab 3; Filar 2 (Lab 5a, 5b)                              | rzadkie na egzaminie                | Po jednym arkuszu; na później.                                                                           |

## Pierwsza propozycja planu (zastąpiona przez „Ścieżkę przyjętą”)

Kolejność według częstości w arkuszach i tego, co już mamy. Do Twojej decyzji.

| Etap    | Co powstaje                                                              | Dlaczego w tej kolejności                                                       |
| ------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 1       | Scena „Serwer z dwiema kartami” (układ B) w stylu „List za płot”         | Najczęstszy nowy układ ostatnich lat; wprost korzysta z gotowej sceny o bramie. |
| 2       | Ćwiczenie „Ze schematu do tabeli adresów” na układach A i B              | To pierwszy krok każdego zadania; bez niego reszta to przepisywanie liczb.      |
| 3       | Scena i krok teorii „DHCP: zakres i rezerwacja”                          | 7 z 11 arkuszy wymaga adresu z DHCP; teoria nie ma dziś takiego kroku.          |
| 4       | Scena „Port w VLAN-ie: z tagowaniem i bez” (układ C)                     | Cztery sesje czerwcowe z rzędu; Laboratorium VLAN daje już „po co”.             |
| 5       | Scena „Ping nie działa”: lista kontrolna, w tym zapora                   | Zbiera poprzednie etapy w jedną procedurę na egzamin.                           |
| 6       | Krótkie zadania z masek: adres sieci, Broadcast, pierwszy i ostatni host | Maski spoza /24 są w 10 z 11 arkuszy, ale zwykle wystarczy je przepisać.        |
| później | Droga powrotna i tablica routingu; DNS; NAT; ściąga okablowania; Wi-Fi   | Rzadsze na egzaminie albo należą do innych filarów.                             |

## Czego nie wiem

- Nie wiem, z czym konkretnie chłopaki mają kłopot – plan wynika z arkuszy, nie z obserwacji lekcji. Jeśli wiesz, na którym kroku zadania się zatrzymują, kolejność etapów może się zmienić.
- Nie znam modeli rutera i przełącznika w Waszej pracowni; procedura „jak wejść na urządzenie” od nich zależy.
- Zliczenia robiłem z tekstu wyciągniętego z PDF; schematy są obrazkami, więc układ A, B albo C przypisałem na podstawie opisów kart sieciowych w zadaniach.
- Sprawa schematów z arkuszy była odłożona jako PYT-065 – ta mapa jest jej rozwinięciem.

## Ścieżka przyjęta (PYT-073, 2026-11-20)

Głos uczniów, przekazany przez operatora: mają kłopot z „suchym tekstem” arkusza, „nie widzą tego
jeszcze w głowach i robią na czuja”. Operator zaproponował podział na trzy pytania: jak to działa,
w jakiej kolejności się konfiguruje, jak odczytać arkusz i przełożyć go na kroki. Zasady oceniania
(styczeń 2026) potwierdzają ten kierunek: kryteria są zero-jedynkowe („adres IP … na interfejsie …”),
a każdy oceniany ping zostaje w jednej sieci.

### Zasady

1. **Jeden schemat przez całą drogę.** Układ z arkuszy (ruter – serwer z dwiema kartami –
   przełącznik – stacja) rośnie etap po etapie.
2. **Od tekstu do obrazka.** Ćwiczenie pokazuje prawdziwą linijkę z arkusza i każe znaleźć ją na
   schemacie albo wpisać we właściwe miejsce.
3. **Najpierw scena, potem ćwiczenie.** Scena w stylu „rozmowa” daje obraz; ćwiczenie sprawdza, czy
   uczeń umie go użyć sam.
4. **Jedna rzecz na etap.**

### Etapy

| #   | Etap                            | Po etapie uczeń umie                                                                               | Pytanie operatora      | Obszary z listy uczniów                         |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------- |
| 1   | Koloruję sieci na schemacie     | policzyć sieci i pokazać, która karta jest w której                                                | jak to działa          | czytanie schematu                               |
| 2   | Z arkusza do tabeli adresów     | z linijek arkusza wypełnić tabelę: karta, adres, brama, DNS – w tym „brama: brak” na serwerze      | jak odczytać arkusz    | czytanie schematu, serwer z dwiema kartami, DNS |
| 3   | Kto rozdaje adresy              | wskazać, kto daje adres której karcie; wyjaśnić zakres i rezerwację                                | jak odczytać arkusz    | DHCP                                            |
| 4   | W jakiej kolejności konfiguruję | ułożyć kroki: ruter, przełącznik, kable, serwer, stacja – i wejść na urządzenie przez przeglądarkę | kolejność konfiguracji | ruter i przełącznik                             |
| 5   | Ping nie działa                 | przejść listę kontrolną od kabla do zapory                                                         | wszystkie trzy         | ping nie działa                                 |
| 6   | To samo z VLAN-ami              | pokolorować porty według VLAN-ów i powtórzyć etapy 2–5 na takim arkuszu                            | wszystkie trzy         | VLAN                                            |

Zadania z masek (adres sieci, Broadcast, pierwszy i ostatni host) idą obok jako krótka „siłownia”.

Model minimalny, który ma zostać w głowie: (1) sieć to wszystko, co łączy kabel i przełącznik,
i kończy się na karcie rutera albo serwera; (2) bez bramy ping działa tylko w jednej sieci;
(3) brama to jedyne wyjście poza swoją sieć.

### Warstwy zamiast etapów 3–6 (PYT-089a, 2026-11-23)

Pełny widok arkusza z adnotacjami przytłaczał (PYT-088). Każde pytanie administratora dostaje
własną zakładkę strony „Arkusz krok po kroku”, na tym samym schemacie. Reguła warstwy: 1 pytanie,
najwyżej 5 linijek arkusza, najwyżej 2 pułapki, 1 nowa rzecz na schemacie.

| #   | Warstwa                              | Stan                                                                              |
| --- | ------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | Ile jest sieci?                      | gotowe (`symulator-arkusz.html`, PYT-074a)                                        |
| 2   | Którędy wychodzi się z sieci?        | gotowe (jw.)                                                                      |
| 3   | Skąd adres? (DHCP, rezerwacja, MAC)  | gotowe na dysku (zakładka 3, PYT-092a); pilot – lekcja z uczniami przed warstwą 4 |
| 4   | Kto zna nazwy? (DNS)                 | po lekcji z warstwą 3                                                             |
| 5   | Jak wejść na urządzenie?             | po lekcji; zależy od modeli rutera i przełącznika                                 |
| 6   | W jakiej kolejności i jak sprawdzić? | po lekcji                                                                         |
| 7   | Cały arkusz (uczeń sam oznacza ①–⑤)  | makieta z PYT-088 jako ostatnia faza                                              |

VLAN-y (dawny etap 6) wracają po warstwie 7, na arkuszach z czerwca 2023–2026.

Każda warstwa: scenariusz według `wzorce-scenariuszy.md` → recenzja sub-agenta
(`prompt-recenzent.md`) → akceptacja operatora → kod.

### Do ustalenia

- Etap 4 zależy od modeli rutera i przełącznika w pracowni (panele w przeglądarce).
- Zasady oceniania przeczytałem tylko dla sesji styczeń 2026.
