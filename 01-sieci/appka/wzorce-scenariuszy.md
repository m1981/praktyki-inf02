# Wzorce scenariuszy „Arkusz krok po kroku”

Obowiązuje przy każdej nowej warstwie (PYT-089a). Czytaj **przed** napisaniem scenariusza.
Recenzent (`prompt-recenzent.md`) sprawdza scenariusz także pod kątem tych wzorców.

Źródło: recenzja scenariusza warstwy 3 (2026-11-23, PYT-090) – trzy rzeczy, które recenzent wskazał
jako warte powtarzania, a operator kazał zapisać jako wzór („Zapisz pochwalone trzy rzeczy jako
warte używania w kolejnych warstwach”).

## Reguła warstwy

1 pytanie · najwyżej 5 linijek arkusza · najwyżej 2 pułapki · 1 nowa rzecz na schemacie.
Kwestia najwyżej 12 słów; ruch na schemacie w osobnym kroku „akcja”.

## Trzy wzorce

| #   | Wzorzec                                                 | Jak to wygląda                                                                                                                                                                                                                    | Przykład (warstwa 3)                                                                                                            |
| --- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Pułapka rodzi się ze sceny, nie z listy**             | Najpierw Kuba robi to, co zrobiłby uczeń, i widać skutek („nie działa 😩”). Dopiero potem Ola podaje regułę. Pułapka nie jest punktem na liście ostrzeżeń, tylko wpadką, którą uczeń zobaczył.                                    | Krok 13: „Wpisałem rezerwację, a serwer dalej ma stary adres 😩” → krok 14: „Serwer pamięta stary. Każ mu zapytać jeszcze raz.” |
| 2   | **Ćwiczenie „od tekstu do urządzenia”**                 | Uczeń dostaje prawdziwe linijki z arkusza i przypisuje je do miejsca: urządzenia, karty albo pola. W linijkach zostaje naturalny haczyk (słowo, które myli), a reakcja na błąd nazywa ten haczyk.                                 | Ćwiczenie 2: „Kliknij linijki, które ustawiasz na ruterze.” Haczyk: L3 mówi „…serwera”, a wpisuje się ją na ruterze.            |
| 3   | **Jedno pytanie na warstwę; reszta odcięta i zapisana** | Linijka, która należy do innego pytania, nie wchodzi do warstwy, nawet jeśli stoi w arkuszu tuż obok. Scenariusz mówi wprost, do której warstwy ją odsunięto. Uproszczenia są zapisane w notatce dla nauczyciela, nie na ekranie. | „serwer DNS: 10.10.0.20” (z ustawień DHCP) odsunięta do warstwy 4 „Kto zna nazwy?”; sekcja „Uproszczenia”.                      |

## Częste błędy z recenzji warstwy 3 (żeby ich nie powtarzać)

- Pojęcie z arkusza (np. „zakres”) pada w kwestii, ale nikt go nie pokazuje na przykładzie.
- Reguła oparta na kolorze bez wskazania karty („swój kolor”) – urządzenie z dwiema kartami ma dwa kolory.
- Skrót (DHCP, MAC) bez jednego słowa wyjaśnienia albo bez przywołania, gdzie uczeń go już widział.
- Zagadka sprawdza poboczną myśl zamiast rdzenia warstwy.
- Kolor użyty w innym znaczeniu niż sieć (np. „zielony = dobrze”).
- Scena skacze między urządzeniami bez informacji „Jesteś na: …”.
- Opis ćwiczenia bez stanu schematu – podpowiedź ze sceny zostaje i ćwiczenie jest „za darmo”.
