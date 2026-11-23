# Arkusz krok po kroku, warstwa 3 „Skąd adres?” — scenariusz do akceptacji

Wersja 3 · 2026-11-23 · PYT-089a (warstwy, warstwa 3 jako pilot) · akceptacja: PYT-090a; zmiany wersji 3: PYT-092.

Zmiany względem wersji 2 – dopasowanie do rutera z pracowni (PYT-091b, `mapa-menu-urzadzen.md`): kartę
wybiera się z listy podłączonych urządzeń w panelu TP-Link, a nie przez przepisywanie MAC z `ipconfig /all`.
Kroki 11–14 przebudowane, scena ma 18 kroków; pułapka P1 zmieniona na „lista wpisuje obecny adres”.

Zmiany względem wersji 1 – po recenzji (prompt: `prompt-recenzent.md`, wszystkie 12 uwag przyjęte):
zakres wyjaśniony na przykładzie (krok 7), reguła „swój kolor” zastąpiona „siecią karty, na której
działa DHCP” (model, krok 5), DHCP nazwane w kroku 2, MAC przywołany z ARP (krok 10), podpowiedź
„karta z 10.10.0.7” w kroku 11, etykieta „Jesteś na:” w krokach 11–15, nowa zagadka o MAC, opis
schematu w ćwiczeniu, poprawione reakcje w ćwiczeniach 2 i 4, pięć nowych notatek dla nauczyciela.

**Cel warstwy:** uczeń wie, które karty mają adres wpisany ręcznie, a która dostaje go od DHCP.
Umie powiedzieć, po co jest rezerwacja i czego do niej potrzeba.

**Reguła warstwy (PYT-089a):** 1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki ·
1 nowa rzecz na schemacie.

**Model, który ma zostać w głowie (trzy zdania):**

1. Adres jest wpisany ręcznie albo przychodzi od DHCP.
2. DHCP rozdaje adresy tylko w sieci karty, na której działa.
3. Rezerwacja to „ten adres zawsze dla tej karty” – kartę poznaje się po MAC.

## Linijki z arkusza (styczeń 2025) – tylko te pięć

Reszta arkusza jest na tej zakładce ukryta.

| #   | Gdzie       | Linijka z arkusza (co do słowa)                                                    |
| --- | ----------- | ---------------------------------------------------------------------------------- |
| L1  | ruter       | serwer DHCP: włączony                                                              |
| L2  | ruter       | zakres adresów: 10.10.0.2 ÷ 10.10.0.20                                             |
| L3  | ruter       | zarezerwowany adres IP 10.10.0.20 dla interfejsu WAN serwera                       |
| L4  | serwer, WAN | adres IP oraz pozostałe parametry konfiguracji sieciowej: uzyskiwane automatycznie |
| L5  | serwer, WAN | odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze                 |

L1 łączy nagłówek „serwer DHCP:” i podpunkt „włączony” – w arkuszu to dwie linijki, w ustawieniach
jedna.

**Nowa rzecz na schemacie:** strzałka DHCP między interfejsem LAN rutera a kartą „WAN” serwera,
z napisem „adres z DHCP” (potem: „10.10.0.20 ↔ MAC karty WAN”). Pomocniczo, tylko w krokach 11–15:
etykieta „Jesteś na: serwer / ruter”.

**Pułapki (dwie):**

- **P1** – rezerwacja wiąże adres z MAC karty, a arkusz MAC-a nie podaje. W panelu TP-Link kartę
  wybiera się z listy podłączonych urządzeń, ale wybór wpisuje jej **obecny** adres (10.10.0.7) –
  trzeba go zmienić na 10.10.0.20 z arkusza.
- **P2** – po wpisaniu rezerwacji serwer ma dalej stary adres; trzeba go odświeżyć
  (`ipconfig /release`, potem `ipconfig /renew`) i sprawdzić, że wyszło 10.10.0.20.

Schemat: ten sam co w etapach 1–2, wszystkie sieci w kolorach, adresy z etapu 2 przy kartach.
Postacie: Ola i Kuba, na „ty”. Kwestia najwyżej 12 słów, ruch w osobnym kroku „akcja”.

## Scena

| #   | Kto       | Kwestia                                                             | Na schemacie                                                                                                                                          | Przycisk     |
| --- | --------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | Kuba      | Serwer, karta »WAN«: »uzyskiwane automatycznie«. Od kogo? 🤔        | Obok schematu pięć linijek (L1–L5). Podświetla się L4. Pulsuje karta „WAN” serwera.                                                                   | Dalej ▶      |
| 2   | Ola       | Te wpisaliśmy ręcznie. Tę dostaje się od DHCP – rozdawacza adresów. | Adresy z etapu 2 (wpisane ręcznie) przygasają. Przy karcie „WAN” serwera zostaje „?”.                                                                 | Dalej ▶      |
| 3   | Ola       | Na tym arkuszu adresy rozdaje ruter.                                | Podświetla się L1. Pulsuje interfejs LAN rutera.                                                                                                      | Dalej ▶      |
| 4   | Kuba      | Komu rozdaje? Stacji też?                                           | Pulsuje stacja.                                                                                                                                       | Dalej ▶      |
| 5   | Ola       | Nie. DHCP działa na karcie LAN rutera – tylko zielona sieć.         | Sieć zielona w kolorze, pozostałe przygaszone. Pulsuje interfejs LAN rutera.                                                                          | 📨 Poproś ▶  |
| 6   | _akcja_   | _Serwer prosi o adres, ruter odpowiada…_                            | Strzałka DHCP: od karty „WAN” do rutera i z powrotem. Przy karcie „WAN” pojawia się 10.10.0.7 (przykład).                                             | Dalej ▶      |
| 7   | Kuba      | Dostał 10.10.0.7 z zakresu. A arkusz chce 10.10.0.20!               | Podświetla się L2, pod nią pasek adresów od .2 do .20 z zaznaczonym .7. Potem podświetla się L3.                                                      | Dalej ▶      |
| 8   | Ola       | Dlatego jest rezerwacja: ten adres zawsze dla tej karty.            | Bez zmian.                                                                                                                                            | Dalej ▶      |
| 9   | Kuba      | Skąd ruter wie, która karta to ta?                                  | Pulsują obie karty serwera.                                                                                                                           | Dalej ▶      |
| 10  | Ola       | Po MAC – pamiętasz go z ARP? Każda karta ma swój.                   | Przy kartach serwera pojawiają się dwa różne MAC (przykładowe).                                                                                       | Dalej ▶      |
| 11  | Ola       | Panel rutera ma listę kart. Wybierz tę z 10.10.0.7.                 | „Jesteś na: ruter”. Okno rezerwacji z listą podłączonych urządzeń (jak w TP-Link: VIEW CONNECTED DEVICES); na liście karta „WAN” serwera z 10.10.0.7. | 📌 Wybierz ▶ |
| 12  | Kuba      | Wybrałem. Ale w polu adresu wpisało się 10.10.0.7 🤨                | Pułapka P1: pole „IP Address” w oknie rezerwacji pokazuje 10.10.0.7 i miga.                                                                           | Dalej ▶      |
| 13  | Ola       | Lista podaje obecny adres. Wpisz ten z arkusza.                     | Podświetla się L3. W polu „IP Address” 10.10.0.20.                                                                                                    | 💾 Zapisz ▶  |
| 14  | _akcja_   | _Ruter zapisuje rezerwację: MAC karty WAN → 10.10.0.20…_            | Napis na strzałce DHCP: „10.10.0.20 ↔ MAC karty WAN”. MAC-i przy kartach znikają.                                                                     | Dalej ▶      |
| 15  | Kuba      | Wpisałem rezerwację, a serwer dalej ma stary adres 😩               | „Jesteś na: serwer”. Przy karcie „WAN” nadal 10.10.0.7. Podświetla się L5.                                                                            | Dalej ▶      |
| 16  | Ola       | Serwer pamięta stary. Każ mu zapytać jeszcze raz.                   | Pułapka P2: przy serwerze „ipconfig /release” i „ipconfig /renew”.                                                                                    | 🔄 Odśwież ▶ |
| 17  | _akcja_   | _Serwer pyta jeszcze raz i dostaje swój adres…_                     | Strzałka DHCP jeszcze raz. Przy karcie „WAN” „10.10.0.20 ✓” (pogrubione, bez zmiany koloru – kolor znaczy sieć).                                      | Dalej ▶      |
| 18  | _zagadka_ | Po czym ruter pozna kartę serwera? A) Po nazwie »WAN«. B) Po MAC.   | Stan końcowy.                                                                                                                                         | Teraz Ty ▶   |

Reakcje na zagadkę:

- A: „Nazwę »WAN« zna tylko Windows. Ruter widzi MAC.”
- B: „Właśnie tak – MAC jest jak numer seryjny karty.”

## Ćwiczenie (uczeń sam)

Schemat w kolorach z adresami z etapu 2, **bez strzałki DHCP**; przy karcie „WAN” serwera „?”.
Obok pięć linijek L1–L5.

| #   | Polecenie                                          | Co robi uczeń                        | Dobra odpowiedź     | Reakcja na błąd                                                                   |
| --- | -------------------------------------------------- | ------------------------------------ | ------------------- | --------------------------------------------------------------------------------- |
| 1   | Kliknij kartę, która dostaje adres od DHCP.        | klika kartę                          | karta „WAN” serwera | „Ta karta ma adres wpisany ręcznie. Szukaj »automatycznie«.”                      |
| 2   | Kliknij linijki, które ustawiasz na ruterze.       | klika linijki L1–L5, potem „Sprawdź” | L1, L2, L3          | „Tę linijkę robisz na serwerze, nie na ruterze.”                                  |
| 3   | Do rezerwacji potrzebujesz MAC. Której karty?      | klika kartę serwera                  | karta „WAN”         | „LAN 1 jest niebieska. Rezerwacja dotyczy karty w sieci rutera.”                  |
| 4   | Serwer ma 10.10.0.7 zamiast 10.10.0.20. Co robisz? | wybiera A albo B                     | B                   | „Nie wpisuj ręcznie – arkusz każe »automatycznie«. Sprawdź rezerwację i odśwież.” |

Ćwiczenie 2 – reakcja, gdy uczeń zaznaczy tylko L1 i L2 (pominie L3, bo jest w niej słowo
„serwera”): „Brakuje jednej. Rezerwację też wpisujesz na ruterze.”

Ćwiczenie 2 – reakcja, gdy brakuje więcej niż jednej linijki rutera (dopisane przy kodzie, PYT-092a):
„Brakuje linijek. Wszystkie ustawienia DHCP wpisujesz na ruterze.”

Odpowiedzi do zadania 4: A) Wpisuję 10.10.0.20 ręcznie. B) Sprawdzam rezerwację i odświeżam adres.

## Dla dociekliwych (rozwijane pod sceną, PYT-095)

Na stronie: sekcja pod sceną, domyślnie zwinięta. Treść na stronie musi być taka jak tutaj (test).

### Warstwa 3

- **Co to jest DHCP?** Usługa, która rozdaje adresy kartom ustawionym na „automatycznie”. Na tym
  arkuszu działa na ruterze; w innych arkuszach bywa na serwerze.
- **Co jeszcze daje DHCP oprócz adresu?** Maskę, bramę (10.10.0.1) i DNS. Dlatego w tabeli z etapu 2
  karta WAN serwera ma „automatycznie” w każdej kolumnie.
- **Dlaczego najpierw /release, a potem /renew?** Samo /renew prosi o przedłużenie starego adresu
  (10.10.0.7) i część ruterów go przedłuży. /release oddaje stary adres, /renew prosi o nowy – wtedy
  przychodzi zarezerwowany.
- **Co, jeśli karty nie ma na liście w panelu?** MAC odczytasz na serwerze: ipconfig /all, karta
  z adresem 10.10.0.7, pole „Adres fizyczny”.
- **Dlaczego MAC z ipconfig ma myślniki, a panel czasem chce dwukropków?** To ten sam adres zapisany
  na dwa sposoby. Przy przepisywaniu zamień znaki.
- **Co znaczy adres 169.254.x.x?** DHCP nie odpowiedział – np. kabel jest w złym porcie. Sprawdzanie
  takich kłopotów to osobna warstwa.
- **Dlaczego 10.10.0.7 i MAC na schemacie są „przykładem”?** Arkusz ich nie podaje. Na egzaminie
  zobaczysz inne liczby – liczy się, skąd je wziąć.

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Nie pokazujemy czterech komunikatów DHCP (DORA) ani czasu dzierżawy – strzałka „prośba i
  odpowiedź” wystarcza do arkusza.
- Adres 10.10.0.7 i adresy MAC to przykłady, nie dane z arkusza – na ekranie oznaczone „przykład”.
- „Pozostałe parametry” w L4: DHCP daje też bramę (10.10.0.1) i DNS – stąd „automatycznie”
  w kolumnach Brama i DNS w tabeli z etapu 2. DNS omawia warstwa 4.
- Najpierw `/release`, potem `/renew`: samo `/renew` prosi o przedłużenie starego adresu
  (10.10.0.7) i część ruterów je przedłuży, zamiast dać zarezerwowany.
- `ipconfig` pokazuje MAC z myślnikami (`AA-BB-…`), część paneli rutera chce dwukropków
  (`AA:BB:…`) – przy przepisywaniu zamień znaki.
- Gdy karty nie ma na liście w panelu (np. inny ruter), MAC odczytuje się na serwerze:
  `ipconfig /all`, karta z adresem 10.10.0.7, pole „Adres fizyczny” (nie karta LAN 1).
- TP-Link: wpis rezerwacji ma przełącznik **Status** – wyłączony wpis nie działa; przycisk
  **SAVE** w oknie rezerwacji. Szczegóły i ścieżka menu: `mapa-menu-urzadzen.md`.
- Adres 169.254.x.x na karcie „WAN” znaczy, że DHCP nie odpowiedział (np. kabel w złym porcie) –
  temat na warstwę 6 („jak sprawdzić”).
- Czy rezerwacja musi leżeć w zakresie, czy poza nim, zależy od modelu rutera w pracowni.
  Tu leży w zakresie, bo tak każe arkusz.
- W innych arkuszach DHCP rozdaje serwer (np. styczeń 2026: serwer Linux). Pytanie „skąd adres?”
  i reguła „sieć karty, na której działa DHCP” zostają te same – zmienia się tylko odpowiedź.
- Linijka „serwer DNS: 10.10.0.20” z ustawień DHCP należy do warstwy 4 („Kto zna nazwy?”).

## Do decyzji przy akceptacji

- **Nowe elementy w kodzie:** strzałka DHCP z napisem (nowa rzecz na schemacie); pomocniczo:
  chwilowe napisy MAC przy kartach serwera (kroki 10–13), etykieta „Jesteś na:” (kroki 11–17),
  uproszczone okno rezerwacji z listą (kroki 11–13),
  pasek zakresu pod linijką L2 (krok 7); ćwiczenie 2 – klikanie kilku linijek wycinka i „Sprawdź”.
- **Strona:** trzecia zakładka „Skąd adres?” na stronie „Arkusz krok po kroku”.
- **MAC i 10.10.0.7 na schemacie:** przykładowe, oznaczone jako przykład.
