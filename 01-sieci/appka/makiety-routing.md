# Makiety: aplikacja o routingu („ramka przechodzi przez Router”)

Status: do wyboru przez operatora (PYT-055c: najpierw makiety obu wariantów) · 2026-11-19

Decyzje wejściowe: PYT-053 (następna aplikacja to routing), PYT-056a (rozbudowa przykładowego biura
z Symulatora ARP i serii maski). To szkic, nie kod. Wysokości ekranów są szacunkiem, nie pomiarem.

## 1. Cel i świat

**Jedna myśl dla ucznia:** adres MAC mówi, kto odbierze ramkę na tym kablu, i zmienia się na
Routerze. Adres IP mówi, dokąd jadą dane, i zostaje bez zmian.

Seria maski kończy się pytaniem „Co Router zmienia w ramce, gdy przekazuje ją dalej?” – ta aplikacja
na nie odpowiada.

| Urządzenie       | Sieć          | Adres IP                | Brama      | Uwaga                                            |
| ---------------- | ------------- | ----------------------- | ---------- | ------------------------------------------------ |
| Laptop           | 10.10.10.0/24 | 10.10.10.105            | 10.10.10.1 | bez zmian względem ARP i maski                   |
| Switch (biuro)   | 10.10.10.0/24 | –                       | –          | bez zmian                                        |
| Router (Brama)   | obie          | 10.10.10.1 i 10.10.20.1 | –          | **nowe:** drugi port, z własnym adresem IP i MAC |
| Switch (serwery) | 10.10.20.0/24 | –                       | –          | **nowe:** drugi Switch                           |
| Serwer WWW       | 10.10.20.0/24 | 10.10.20.50             | 10.10.20.1 | **nowe urządzenie i nowa nazwa w słowniku**      |

Uproszczenia (do notatki dla nauczyciela, nie na ekran):

- Router zna już adres MAC Serwera WWW. Naprawdę najpierw pyta o niego przez ARP w drugiej sieci.
- Pomijamy licznik TTL, który Router zmniejsza o 1.
- Router ma tu tylko dwie sieci, więc wybór portu jest oczywisty. Tablica routingu to następny temat.

## 2. Wariant A – seria mikro-ćwiczeń R1–R4

Jedno pytanie, jedno nowe pojęcie i jeden element sterujący na ekran – jak M1–M4. Szablon ekranu
z `audyt.md`, rozdz. 5.0.

| Kod | Tytuł                      | Nowe pojęcie                                  | Element sterujący                |
| --- | -------------------------- | --------------------------------------------- | -------------------------------- |
| R1  | O czyj MAC zapytać?        | ARP pyta o bramę, nie o cel                   | przycisk „Dalej”                 |
| R2  | Dwa adresy na jednej ramce | MAC = najbliższy odbiorca, IP = cel końcowy   | przełącznik: adresy MAC / IP     |
| R3  | Co zmienia Router?         | Router wymienia adresy MAC, adresy IP zostają | przełącznik: przed / za Routerem |
| R4  | Droga powrotna             | odbiorca sam decyduje, według własnej bramy   | przycisk „Wyślij odpowiedź”      |

### R1 – O czyj MAC zapytać?

```text
+------------------------------------------------------------------------------+
| ROUTING · R1 z 4   [x][ ][ ][ ]                Przykładowe biuro (i)         |
| PYTANIE: Laptop wysyła dane do Serwera WWW 10.10.20.50. O czyj MAC zapyta?   |
+---------------------------------------------+--------------------------------+
|              [Router (Brama)]               | Krok 2 z 2                     |
|          10.10.10.1 | 10.10.20.1            | Laptop potrzebuje adresu MAC   |
|            ^        :                       | Routera, nie Serwera WWW.      |
|   ARP Reply|        :                       | Wysyła ARP Request: „Kto ma    |
|            |        :                       | 10.10.10.1?”. Router odpowiada.|
| [Laptop]==[Switch]  [Switch]..[Serwer WWW]  | (...)                          |
|   .105                          10.10.20.50 |                                |
| Tablica ARP Laptopa (przy karcie):          | [ Dalej: R2 -> ]               |
|  10.10.10.1 -> MAC Routera   (nowy wpis)    |                                |
|  druga sieć wyszarzona – nic tam nie płynie |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: tablica ARP Laptopa: 10.10.10.1 -> MAC Routera                       |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                                                       | Słowa | Pasek „Zmiana”                                |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------- |
| K1   | Laptop (10.10.10.105) chce otworzyć stronę z Serwera WWW (10.10.20.50). Liczy swoją maską /24: numer sieci 10.10.20 jest inny niż jego 10.10.10. To inna sieć, więc Laptop wyśle ramkę do bramy – Routera.  | 31    | decyzja Laptopa: inna sieć → do bramy         |
| K2   | Laptop potrzebuje adresu MAC Routera, nie Serwera WWW. Wysyła ARP Request: „Kto ma 10.10.10.1?”. Router odpowiada. ARP działa tylko w sieci Laptopa – o MAC urządzenia z innej sieci Laptop nigdy nie pyta. | 32    | tablica ARP Laptopa: 10.10.10.1 → MAC Routera |

Na następne ćwiczenie: „Ramka ma jechać do Routera, a dane do Serwera WWW. Jak to zapisać na jednej ramce?”

### R2 – Dwa adresy na jednej ramce

```text
+------------------------------------------------------------------------------+
| ROUTING · R2 z 4   [x][x][ ][ ]                Przykładowe biuro (i)         |
| PYTANIE: Ramka jedzie do Routera, a dane do Serwera WWW. Jakie adresy wpisać?|
+---------------------------------------------+--------------------------------+
|  RAMKA, którą wysyła Laptop                 | Adresy IP:                     |
|  +---------------------------------------+  | Adresy IP mówią, skąd i dokąd  |
|  | MAC nadawcy   Laptop                  |  | jadą dane. Laptop wpisuje: IP  |
|  | MAC odbiorcy  Router (Brama)          |  | nadawcy 10.10.10.105, IP       |
|  | +-----------------------------------+ |  | odbiorcy 10.10.20.50 – Serwer  |
|  | | PAKIET IP                         | |  | WWW, nie Router. (...)         |
|  | | IP nadawcy   10.10.10.105  <====  | |  |                                |
|  | | IP odbiorcy  10.10.20.50   <====  | |  | ( Adresy MAC | [Adresy IP] )   |
|  | | dane: „pokaż stronę”              | |  |                                |
|  | +-----------------------------------+ |  |                                |
|  +---------------------------------------+  |                                |
|  pod spodem mały diagram: Laptop–Switch–Router–Switch–Serwer WWW,            |
|  strzałka pokazuje, dokąd sięga podświetlona para adresów                    |
+---------------------------------------------+--------------------------------+
| ZMIANA: podświetlone pola IP: Laptop -> Serwer WWW                           |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                               | Słowa | Pasek „Zmiana”                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------- |
| K1   | Adresy MAC mówią, kto odbierze ramkę na tym kablu. Laptop wpisuje: MAC nadawcy – swój, MAC odbiorcy – Routera. Switch czyta tylko te dwa pola.                                      | 23    | podświetlone pola MAC: Laptop → Router    |
| K2   | Adresy IP mówią, skąd i dokąd jadą dane. Laptop wpisuje: IP nadawcy 10.10.10.105, IP odbiorcy 10.10.20.50 – Serwer WWW, nie Router. Adres IP Routera nie pojawia się w ramce wcale. | 29    | podświetlone pola IP: Laptop → Serwer WWW |

Na następne ćwiczenie: „Router odebrał ramkę zaadresowaną do siebie. Co z nią zrobi?”

### R3 – Co zmienia Router?

```text
+------------------------------------------------------------------------------+
| ROUTING · R3 z 4   [x][x][x][ ]                Przykładowe biuro (i)         |
| PYTANIE: Router przekazuje dane do sieci 10.10.20.0. Które adresy zmieni?    |
+---------------------------------------------+--------------------------------+
| [Laptop]--[Switch]--[Router]==[Switch]==>[Serwer WWW]                        |
|                                             | Za Routerem:                   |
|  RAMKA          przed Routerem  za Routerem | Za Routerem: nowa ramka. MAC   |
|  MAC nadawcy    Laptop          Router   *  | nadawcy – Router (drugi port), |
|  MAC odbiorcy   Router          Serwer WWW* | MAC odbiorcy – Serwer WWW.     |
|  IP nadawcy     10.10.10.105    10.10.10.105| Adresy IP zostały te same.     |
|  IP odbiorcy    10.10.20.50     10.10.20.50 | (...)                          |
|                                             |                                |
|  * = pole zmienione (kolor); kolumna        | ( Przed Routerem |             |
|  wybranej pozycji przełącznika jest jasna,  |   [Za Routerem] )              |
|  druga wyszarzona                           |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: oba pola MAC nowe, oba pola IP bez zmian                             |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                                                  | Słowa | Pasek „Zmiana”                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ---------------------------------------- |
| K1   | Przed Routerem: ramka z MAC Laptopa do MAC Routera. Router ją odbiera, bo MAC odbiorcy jest jego. Zdejmuje ramkę i czyta adres IP odbiorcy: 10.10.20.50.                                               | 25    | ramka na kablu Laptop – Router           |
| K2   | Za Routerem: nowa ramka. MAC nadawcy – Router (drugi port), MAC odbiorcy – Serwer WWW. Adresy IP zostały te same: 10.10.10.105 i 10.10.20.50. MAC zmienia się na każdym Routerze, IP jedzie bez zmian. | 31    | oba pola MAC nowe, oba pola IP bez zmian |

Na następne ćwiczenie: „Serwer WWW odpowiada Laptopowi. Którędy wróci odpowiedź?”

### R4 – Droga powrotna

```text
+------------------------------------------------------------------------------+
| ROUTING · R4 z 4   [x][x][x][x]                Przykładowe biuro (i)         |
| PYTANIE: Serwer WWW odpowiada Laptopowi 10.10.10.105. Do kogo wyśle ramkę?   |
+---------------------------------------------+--------------------------------+
|              [Router (Brama)]               | Krok 1 z 2                     |
|          10.10.10.1 | 10.10.20.1            | Serwer WWW liczy swoją maską   |
|                     ^                       | /24: 10.10.10 to inna sieć niż |
|                     | 2                     | jego 10.10.20. Wysyła więc     |
| [Laptop]--[Switch]  [Switch]<=1=[Serwer WWW]| ramkę do swojej bramy          |
|   .105                          10.10.20.50 | 10.10.20.1 (...)               |
| Myśl Serwera WWW (dymek przy karcie):       |                                |
| „10.10.10 – inna sieć -> do mojej bramy”    | [ Wyślij odpowiedź -> ]        |
+---------------------------------------------+--------------------------------+
| ZMIANA: decyzja Serwera WWW: inna sieć -> do swojej bramy                    |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                                      | Słowa | Pasek „Zmiana”                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------------------------------------------ |
| K1   | Serwer WWW liczy swoją maską /24: 10.10.10 to inna sieć niż jego 10.10.20. Wysyła więc ramkę do swojej bramy 10.10.20.1 – to drugi port tego samego Routera.                               | 26    | decyzja Serwera WWW: inna sieć → do swojej bramy |
| K2   | Odpowiedź wraca tą samą drogą w drugą stronę. Adresy IP zamieniły się miejscami, a MAC znów zmienił się na Routerze. Każde urządzenie decyduje samo, według własnej maski i własnej bramy. | 30    | odpowiedź dociera do Laptopa                     |

Na następne ćwiczenie: „Router ma dwa porty. Skąd wie, którym wysłać dane? (tablica routingu – w przygotowaniu)”

## 3. Wariant B – jeden scenariusz krok po kroku

Układ Symulatora ARP: diagram i tekst kroku u góry, pod spodem panele. Sterowanie: od początku,
wstecz, następny krok.

```text
+------------------------------------------------------------------------------+
| (o) Broadcast – ramka do wszystkich   (o) Unicast – ramka do jednego         |
+---------------------------------------------+--------------------------------+
|              [Router (Brama)]               | Krok 5 z 8   L3 – przekazanie  |
|          10.10.10.1 | 10.10.20.1            | Krok 5: Router buduje nową     |
|            ^        |                       | ramkę                          |
|            |        v                       | Router zdejmuje ramkę, czyta   |
| [Laptop]==[Switch]  [Switch]==>[Serwer WWW] | IP odbiorcy i wybiera drugi    |
|   .105                          10.10.20.50 | port. (...)                    |
|                                             | [<<] [< Wstecz] [Następny >]   |
+---------------------------------------------+--------------------------------+
| RAMKA W TYM KROKU      | TABLICE ARP             | TABLICE MAC               |
| Typ          Dane      | Laptop:                 | Switch (biuro):           |
| MAC nadawcy  Router    |  10.10.10.1 -> Router   |  Laptop -> Fa0/1          |
| MAC odbiorcy Serwer WWW| Router:                 |  Router -> Fa0/3          |
| IP nadawcy   .10.105   |  10.10.20.50 -> Serwer  | Switch (serwery):         |
| IP odbiorcy  .20.50    |                         |  Router -> Fa0/1          |
| Zawartość    „pokaż…”  |                         |  Serwer WWW -> Fa0/2      |
+------------------------------------------------------------------------------+
```

| #   | Tytuł                                     | Warstwa          | Tekst                                                                                                                                            | Słowa |
| --- | ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| 0   | Start                                     | Brak ruchu       | Laptop chce otworzyć stronę z Serwera WWW (10.10.20.50). Zna jego adres IP. Tablice ARP i MAC są puste.                                          | 18    |
| 1   | Krok 1: Inna sieć – przez bramę           | L3 – decyzja     | Laptop liczy maską /24: 10.10.20 to inna sieć niż 10.10.10. Wyśle ramkę do bramy 10.10.10.1. Potrzebuje adresu MAC Routera.                      | 19    |
| 2   | Krok 2: ARP Request o bramę               | L2 – Broadcast   | Laptop pyta wszystkich: „Kto ma 10.10.10.1?”. Switch zapisuje MAC Laptopa i rozsyła kopie. Pyta o Router, nie o Serwer WWW.                      | 20    |
| 3   | Krok 3: ARP Reply od Routera              | L2 – Unicast     | Router odpowiada tylko Laptopowi. Laptop zapisuje w tablicy ARP: 10.10.10.1 → MAC Routera.                                                       | 12    |
| 4   | Krok 4: Ramka do Routera                  | L3 + L2          | MAC odbiorcy – Router, IP odbiorcy – Serwer WWW. Switch czyta tylko MAC i wysyła ramkę na port Routera.                                          | 17    |
| 5   | Krok 5: Router buduje nową ramkę          | L3 – przekazanie | Router zdejmuje ramkę, czyta IP odbiorcy i wybiera drugi port. Nowa ramka: MAC nadawcy – Router, MAC odbiorcy – Serwer WWW. Adresy IP bez zmian. | 23    |
| 6   | Krok 6: Serwer WWW odbiera                | L2 – Unicast     | Drugi Switch wysyła ramkę na port Serwera WWW. Serwer WWW widzi IP nadawcy 10.10.10.105 – wie, komu odpowiedzieć.                                | 17    |
| 7   | Krok 7: Odpowiedź przez bramę Serwera WWW | L3 + L2          | Serwer WWW liczy swoją maską: Laptop jest w innej sieci. Wysyła ramkę do swojej bramy 10.10.20.1 – drugiego portu Routera.                       | 19    |
| 8   | Krok 8: Router oddaje odpowiedź Laptopowi | L3 – przekazanie | Router znów buduje nową ramkę: MAC nadawcy – Router, MAC odbiorcy – Laptop. Adresy IP tylko zamienione miejscami.                                | 16    |

## 4. Porównanie

| Kryterium (audyt.md, rozdz. 7)            | A: seria R1–R4                                           | B: jeden scenariusz                                 |
| ----------------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| Nowe pojęcia na ekran                     | 1                                                        | do 4 naraz (decyzja, ARP, pola ramki, tablice)      |
| Elementy sterujące                        | 1                                                        | 3 przyciski                                         |
| Mieści się w 1366×768 bez przewijania     | tak (szacunek: jak M1–M4)                                | scena tak; panele pod spodem raczej nie (4 tablice) |
| Porównanie „przed i za Routerem”          | obok siebie, jednym przełącznikiem (R3)                  | trzeba pamiętać ramkę z poprzedniego kroku          |
| Widać całą drogę naraz                    | dopiero w R4                                             | tak, krok po kroku                                  |
| Spójność z istniejącymi stronami          | jak seria maski                                          | jak Symulator ARP                                   |
| Nowy kod w `ui/`                          | 2 widoki: „ramka z polami”, „porównanie”                 | 1 panel: ramka z polami IP; tablice już są          |
| Zmiana w `model/` (obie wersje)           | druga sieć, drugi Switch, drugi port Routera, Serwer WWW | to samo                                             |
| Liczba ekranów do napisania i sprawdzenia | 8 kroków w 4 ćwiczeniach                                 | 9 kroków w 1 scenariuszu                            |

**Rekomendacja agenta:** A. Najczęstszy błąd, o który tu chodzi (pomylenie, co zmienia się na
Routerze), najlepiej widać w R3, gdzie obie ramki stoją obok siebie. Wariant B powtarza przeciążenie,
które audyt wytknął Symulatorowi ARP.

Możliwy wariant mieszany: seria A, a po R4 zakładka „Cała droga” z diagramem i przyciskiem „odtwórz”
(bez paneli) – jako podsumowanie, nie jako lekcja.

## 5. Do decyzji przed kodem

- Wybór wariantu (A, B albo mieszany).
- Nowa nazwa w Słowniku pojęć: „Serwer WWW”.
- Nazwy dwóch Switchy na ekranie, np. „Switch (biuro)” i „Switch (serwery)”.
- Czy pokazać pełne adresy MAC, czy nazwy właścicieli („MAC Routera”). W makietach są nazwy.
