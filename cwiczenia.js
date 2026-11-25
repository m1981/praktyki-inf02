// JEDNA LISTA ćwiczeń interaktywnych (PYT-084a). Z niej powstają:
//  – strona „🎮 Ćwiczenia interaktywne” (cwiczenia.html),
//  – stopka „◀ poprzednie · 🎮 wszystkie ćwiczenia · następne ▶” na każdej stronie z listy (menu.js).
// Kolejność na liście = kolejność nauki i kolejność „poprzednie / następne”.
// Nowe ćwiczenie = jedna pozycja tutaj. Strażnik linków (scripts/linki.mjs) sprawdza, czy plik istnieje.
// Ścieżki `plik` są liczone od katalogu głównego serwisu.

window.CWICZENIA = {
 kroki: [
  { id: 'znajduja', tytul: 'Krok 1 · Jak urządzenia się znajdują' },
  { id: 'maska', tytul: 'Krok 2 · Maska i podsieci' },
  { id: 'vlan-routing', tytul: 'Krok 3 · VLAN i routing' },
  { id: 'arkusz', tytul: 'Krok 4 · Arkusz egzaminacyjny' }
 ],
 lista: [
  {
   plik: '01-sieci/symulator-arp.html',
   krok: 'znajduja',
   ikona: '🎬',
   nazwa: 'ARP krok po kroku',
   opis: 'Kto ma ten adres? Broadcast i odpowiedź.',
   gdzie: 'teoria: krok ARP'
  },
  {
   plik: '01-sieci/symulator-maska.html',
   krok: 'maska',
   ikona: '🚧',
   nazwa: 'Płoty maski',
   opis: 'Wprost czy przez bramę? Seria M1–M4 i tryb swobodny.',
   gdzie: 'teoria: krok Subnetting'
  },
  {
   plik: '01-sieci/laby-vlan/podsieci.html',
   krok: 'maska',
   ikona: '✂️',
   nazwa: 'Podsieci (VLSM)',
   opis: 'Podziel sieć na działki.',
   gdzie: 'teoria: krok Subnetting'
  },
  {
   plik: '01-sieci/laby-vlan/vlan.html',
   krok: 'vlan-routing',
   ikona: '🏢',
   nazwa: 'VLAN: 4 kłopoty',
   opis: 'Po co dzielić jeden Switch.',
   gdzie: 'teoria: krok VLAN · Lab 2'
  },
  {
   plik: '01-sieci/symulator-routing.html',
   krok: 'vlan-routing',
   ikona: '✉️',
   nazwa: 'List za płot',
   opis: 'Co robi Router z ramką i pakietem.',
   gdzie: 'teoria: krok Routing'
  },
  {
   plik: '01-sieci/symulator-arkusz.html',
   krok: 'arkusz',
   ikona: '📝',
   nazwa: 'Arkusz krok po kroku',
   opis:
    'Warstwy 1–9: kolory sieci, tabela adresów, skąd adres, kto zna nazwy, jak wejść na urządzenie, przełącznik, kolejność pracy, sprawdzanie, cały arkusz.',
   gdzie: 'arkusz: styczeń 2025'
  },
  {
   plik: 'egzaminy/egzamin-25-06.html',
   krok: 'arkusz',
   ikona: '🕵️',
   nazwa: 'Dekoder: czerwiec 2025',
   opis: 'Arkusz CKE przetłumaczony na zadania.',
   gdzie: 'do czytania, bez klikania'
  }
 ],
 // Zapowiedzi: karta bez linku, nie wchodzi do „poprzednie / następne”.
 wkrotce: []
};
