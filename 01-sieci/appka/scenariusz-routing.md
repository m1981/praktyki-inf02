# Routing: „List za płot” — scenariusz do akceptacji

Wersja 1 · 2026-11-19 · PYT-061a (forma jak Laboratorium VLAN: najpierw scenariusz, potem kod).
Zastępuje odrzucone makiety z `makiety-routing.md`.

**Jedna myśl dla ucznia:** na każdej bramie koperta jest nowa, a list ten sam. Po sieciowemu: Router
wymienia adresy MAC, adresy IP zostają.

Postacie: Ola (administratorka sieci) i Kierownik IT, na „ty” — te same co w Laboratorium VLAN.

Styl jak w `laby-vlan/scenariusze/`: jedna myśl na oddech, części zdania łączy myślnik „–”, emoji
tam, gdzie postać coś czuje. W każdym kroku na schemacie zmienia się jedna rzecz i kwestia mówi
właśnie o niej. Ruch ma własny krok „akcja”, bez mówienia.

Metafory ze słownika Filaru 1: maska = płot i działka, Router = brama, „dom za płotem dostaje list
przez bramę” (teoria, Krok 5). Nowe w tym scenariuszu: **list** (to, co jedzie do celu) i
**koperta** (to, co mówi, kto odbierze przesyłkę teraz).

Dwie sceny, druga jest lustrem pierwszej:

| Scena              | Co pokazuje                         | Terminy sieciowe                        |
| ------------------ | ----------------------------------- | --------------------------------------- |
| 1. List za płot    | sam mechanizm: list, koperta, brama | żadnych poza „Router” i „serwer”        |
| 2. To samo w sieci | ta sama droga nazwana po sieciowemu | pakiet, adres IP, ramka, adres MAC, ARP |

## Schemat (ten sam w obu scenach)

```text
   działka Laptopa            płot            działka serwera
                               ┊
 [Laptop]──[Switch]────────[ Router ]────────[Switch]──[Serwer WWW]
                            (brama)
                               ┊
```

W scenie 1 na kartach są tylko nazwy. Adresy pojawiają się dopiero w scenie 2: Laptop 10.10.10.105,
Router 10.10.10.1 po stronie Laptopa, Serwer WWW 10.10.20.50 (PYT-056a).

## Scena 1: „List za płot”

| #   | Kto          | Kwestia                                              | Na schemacie                                                                                                                                    | Przycisk                 |
| --- | ------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1   | Ola          | Dwie sieci – dwie działki. Między nimi płot.         | Ujęcie wprowadzające: dwie działki w dwóch kolorach, przerywany płot, Router szary.                                                             | Dalej ▶                  |
| 2   | Kierownik IT | Mój laptop nie otwiera strony z serwera 😩           | Laptop miga. Czerwona przerywana linia od Laptopa kończy się ✕ na płocie; za płotem biegnie dalej szara. Serwer WWW miga na niebiesko – to cel. | Dalej ▶                  |
| 3   | Ola          | Bo serwer stoi za płotem. Tam Laptop nikogo nie zna. | Linia znika. Działka serwera szarzeje.                                                                                                          | Dalej ▶                  |
| 4   | Ola          | Ale w płocie jest brama – Router.                    | Złota ramka wokół Routera.                                                                                                                      | Dalej ▶                  |
| 5   | Ola          | Laptop pisze list do serwera.                        | Przy Laptopie pojawia się list: „Do: Serwer WWW”.                                                                                               | Dalej ▶                  |
| 6   | Ola          | I wkłada go do koperty – dla bramy.                  | List chowa się w kopercie z napisem „Dla: Router”.                                                                                              | ✉️ Wyślij ▶              |
| 7   | _akcja_      | _Koperta jedzie do Routera…_                         | Koperta jedzie Laptop → Switch → Router i zatrzymuje się przy Routerze.                                                                         | Dalej ▶                  |
| 8   | Kierownik IT | Do Routera? Przecież list jest do serwera 🤨         | Pulsuje napis „Dla: Router” na kopercie.                                                                                                        | Dalej ▶                  |
| 9   | Ola          | Koperta mówi tylko, kto odbierze ją teraz.           | Bez zmian.                                                                                                                                      | Dalej ▶                  |
| 10  | Ola          | A dokąd list jedzie naprawdę – to jest w środku.     | Bez zmian.                                                                                                                                      | ✂️ Otwórz kopertę ▶      |
| 11  | _akcja_      | _Router otwiera kopertę i czyta list…_               | Koperta znika. Widać list „Do: Serwer WWW”, pulsuje jego adres.                                                                                 | Dalej ▶                  |
| 12  | Ola          | Serwer jest po drugiej stronie bramy.                | Działka serwera odzyskuje kolor.                                                                                                                | ✉️ Nowa koperta ▶        |
| 13  | _akcja_      | _Router wkłada list do nowej koperty…_               | Nowa koperta „Dla: Serwer WWW” jedzie Router → Switch → Serwer WWW.                                                                             | Dalej ▶                  |
| 14  | Kierownik IT | Czyli koperta inna – a list ten sam? 🙂              | Pod schematem obok siebie: stara koperta, nowa koperta i jeden list.                                                                            | Dalej ▶                  |
| 15  | Ola          | Właśnie tak. Na każdej bramie nowa koperta.          | Bez zmian.                                                                                                                                      | Dalej ▶                  |
| 16  | _zagadka_    | Co zmienił Router? A) Adres na liście. B) Kopertę.   | Stan końcowy.                                                                                                                                   | Zobacz to samo w sieci ▶ |

Reakcje na zagadkę:

- A: „Nie – list dojechał nietknięty. Zmieniła się koperta.”
- B: „Właśnie tak. Zobacz, jak to się nazywa w sieci.”

## Scena 2: „To samo w sieci”

| #   | Kto          | Kwestia                                                                | Echo ze sceny 1                        | Na schemacie                                                                                        | Przycisk                  |
| --- | ------------ | ---------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | Ola          | Ta sama droga – teraz po sieciowemu 🤓                                 | 1                                      | Ten sam schemat. Na kartach pojawiają się adresy IP.                                                | Dalej ▶                   |
| 2   | Ola          | List to pakiet. Adres na liście to adres IP.                           | 5: „Laptop pisze list…”                | Przy Laptopie pakiet: „IP odbiorcy: 10.10.20.50”.                                                   | Dalej ▶                   |
| 3   | Ola          | Koperta to ramka. Napis na kopercie to adres MAC.                      | 6: „…do koperty – dla bramy.”          | Pakiet chowa się w ramce: „MAC odbiorcy: Router”.                                                   | Dalej ▶                   |
| 4   | Kierownik IT | A skąd Laptop zna MAC Routera? 🤔                                      | —                                      | Pulsuje „MAC odbiorcy: Router”.                                                                     | Dalej ▶                   |
| 5   | Ola          | Pyta wszystkich na swojej działce – to ARP.                            | —                                      | Bez zmian.                                                                                          | 📢 Zapytaj ▶              |
| 6   | _akcja_      | _Laptop pyta: „Kto ma 10.10.10.1?” – odpowiada Router._                | —                                      | Pomarańczowe pytanie rozchodzi się po działce Laptopa i staje na Routerze. Zielona odpowiedź wraca. | Dalej ▶                   |
| 7   | Ola          | Ramka do Routera – pakiet do serwera.                                  | 9: „Koperta mówi tylko, kto odbierze…” | Ramka gotowa przy Laptopie.                                                                         | ✉️ Wyślij ▶               |
| 8   | _akcja_      | _Ramka jedzie do Routera…_                                             | 7                                      | Ramka jedzie Laptop → Switch → Router.                                                              | Dalej ▶                   |
| 9   | Ola          | Router zdejmuje ramkę i czyta adres IP.                                | 11                                     | Ramka znika. Widać pakiet, pulsuje „IP odbiorcy: 10.10.20.50”.                                      | ✉️ Nowa ramka ▶           |
| 10  | _akcja_      | _Router wkłada pakiet do nowej ramki…_                                 | 13                                     | Nowa ramka „MAC odbiorcy: Serwer WWW” jedzie Router → Switch → Serwer WWW.                          | Dalej ▶                   |
| 11  | Kierownik IT | Czyli MAC się zmienił – a IP nie?                                      | 14: „…koperta inna – a list ten sam?”  | Pod schematem obok siebie: stara ramka, nowa ramka i jeden pakiet.                                  | Dalej ▶                   |
| 12  | Ola          | Zawsze. MAC – do najbliższej bramy. IP – do końca drogi.               | 15: „Na każdej bramie nowa koperta.”   | Na starej i nowej ramce podświetlone adresy MAC, na pakiecie adres IP.                              | Dalej ▶                   |
| 13  | _zagadka_    | Ramka minęła Router. Co jest w niej nowe? A) Adresy IP. B) Adresy MAC. | 16                                     | Stan końcowy.                                                                                       | ↺ Wróć do listu i koperty |

Reakcje na zagadkę:

- A: „Nie tym razem – adresy IP jadą bez zmian do samego końca.”
- B: „Właśnie tak. Nowa ramka, nowe adresy MAC – pakiet ten sam.”

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- Router w kroku 10 sceny 2 zna już adres MAC Serwera WWW. Naprawdę najpierw pyta o niego przez ARP
  na działce serwera – tak samo jak Laptop w kroku 6.
- Na kopercie i na liście jest też nadawca. Pokazujemy tylko odbiorcę, bo o niego chodzi w lekcji.
- „MAC – do najbliższej bramy” dotyczy drogi do innej sieci. W swojej sieci adres MAC wskazuje
  wprost odbiorcę (to pokazuje Symulator ARP).
- Odpowiedź serwera wraca tą samą drogą w drugą stronę (serwer też wysyła do swojej bramy). To
  materiał na osobną, krótką scenę.
- Router ma tu dwie działki, więc wybór strony jest oczywisty. Tablica routingu to następny temat.

## Do decyzji przy akceptacji

- Czy zostają postacie z Laboratorium VLAN (Ola, Kierownik IT).
- Czy metafora „list i koperta” jest dobra. Alternatywa bez nowej metafory: od razu „pakiet i ramka”,
  czyli tylko scena 2.
- Czy w scenie 2 zostaje ARP (kroki 4–6). Bez nich scena ma 10 kroków, ale znika pytanie „skąd Laptop
  zna MAC Routera”.
- Nazwa urządzenia „Serwer WWW” (PYT-059).
- Technologia: styl „rozmowa” w naszym silniku albo osobny plik jak `vlan.html` (PYT-062).
