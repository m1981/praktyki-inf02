// Strona arkusza dla warstwy 9 „Cały arkusz” (scenariusz-arkusz-9.md, PYT-122a): zadania 2–9 z arkusza
// INF.02 ze stycznia 2025, co do słowa, w układzie z PDF. Adresy z `model/` (test „literaly”).
// Zadanie 5 wyszarzone (nie dotyczy sieci); w zadaniu 7 część o IIS i 7-Zip skrócona do „…”.
// Fragmenty F1–F15 (zakreślane, z plakietkami) i U2, U3, U8, U9 (UWAGI o zgłoszeniu) – identyfikatory
// z tabeli „Zakreślane fragmenty” scenariusza.
import {
 sheetGateway,
 SHEET_CARDS,
 SHEET_DHCP,
 SHEET_ROUTER_DNS,
 SHEET_VM_LAN3
} from '../model/arkusz';
import type { PageBlock, PageSeg } from '../ui/views/SheetPage';
import sheetDrawing from './arkusz-2025-01-schemat.jpg';

const cidr = (card: keyof typeof SHEET_CARDS) => SHEET_CARDS[card].cidr ?? '';
const STATION_GW = sheetGateway('stacja-lan2');
const STATION_DNS = SHEET_CARDS['stacja-lan2'].dns ?? '';
const SERVER_DNS = SHEET_CARDS['serwer-lan1'].dns ?? '';

const f = (id: string, text: string): PageSeg => ({ id, text });
const task = (...segs: PageSeg[]): PageBlock => ({ kind: 'task', segs });
const p = (...segs: PageSeg[]): PageBlock => ({ kind: 'p', segs });
const uwaga = (...segs: PageSeg[]): PageBlock => ({ kind: 'uwaga', segs });
const li = (depth: number, ...segs: PageSeg[]): PageBlock => ({ kind: 'li', depth, segs });
const foot = (text: string): PageBlock => ({ kind: 'foot', segs: [text] });

export const FRAGMENT_TEXT = {
 F1: '4. Za pomocą kabli połączeniowych znajdujących się na stanowisku egzaminacyjnym połącz urządzenia zgodnie ze schematem, a następnie podłącz je do sieci zasilającej.',
 F2: 'Ruter pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze RUTER na nośniku opisanym DOKUMENTACJA/PROGRAMY.',
 F3: `adres IP interfejsu WAN: ${cidr('ruter-wan')}, brama domyślna: ${sheetGateway('ruter-wan')}`,
 F4: `serwer DNS dla interfejsu WAN: ${SHEET_ROUTER_DNS.primary} oraz drugi serwer DNS: ${SHEET_ROUTER_DNS.secondary}, jeśli jest wymagany`,
 F5: `adres IP interfejsu LAN: ${cidr('ruter-lan')}`,
 F6: 'odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze',
 F7: `zarezerwowany adres IP ${SHEET_DHCP.reserved} dla interfejsu WAN serwera`,
 F8: `adres IP: ${cidr('stacja-lan2')}`,
 F9: `adres IP: ${cidr('przelacznik')}`,
 F10: 'brama domyślna: brak',
 F11: 'ustaw w strefie egzamin.local nowy rekord hosta o nazwie www, powiązany z adresem IP interfejsu sieciowego LAN 1',
 F12: 'Na serwerze za pomocą poleceń systemowych wykonaj test komunikacji serwera ze stacją roboczą oraz interfejsem LAN rutera.',
 F13: 'W razie potrzeby na stacji roboczej zmień odpowiednio ustawienia zapory sieciowej.',
 F14: 'ustaw tryb pracy karty sieciowej maszyny wirtualnej, który umożliwi realizację połączenia z fizyczną siecią lokalną',
 F15: 'Na stacji roboczej w systemie Windows, w utworzonej maszynie wirtualnej Linux uruchom przeglądarkę internetową i wyświetl za pomocą adresu www.egzamin.local stronę internetową, udostępnioną przez serwer'
} as const;
const F = (id: keyof typeof FRAGMENT_TEXT) => f(id, FRAGMENT_TEXT[id]);

export const PAGE_BLOCKS: readonly PageBlock[] = [
 task('2. Skonfiguruj ruter zgodnie z następującymi zaleceniami:'),
 li(0, F('F3')),
 li(0, F('F4')),
 li(0, F('F5')),
 li(0, 'serwer DHCP:'),
 li(2, 'włączony'),
 li(2, `zakres adresów: ${SHEET_DHCP.from} ÷ ${SHEET_DHCP.to}`),
 li(2, `serwer DNS: ${SHEET_DHCP.dns}`),
 li(2, F('F7')),
 p(
  F('F2'),
  ' Jeżeli ruter wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.'
 ),
 uwaga(
  f(
   'U2',
   'UWAGA: Po wykonaniu konfiguracji zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do oceny ustawień rutera.'
  )
 ),
 task('3. Skonfiguruj przełącznik zgodnie z następującymi zaleceniami:'),
 li(0, F('F9')),
 li(0, `brama domyślna: ${sheetGateway('przelacznik')}`),
 p(
  'Przełącznik pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze PRZEŁĄCZNIK na nośniku opisanym DOKUMENTACJA/PROGRAMY. Jeżeli przełącznik wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.'
 ),
 uwaga(
  f(
   'U3',
   'UWAGA: Po wykonaniu konfiguracji zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do oceny ustawień przełącznika.'
  )
 ),
 foot('Strona 2 z 6'),
 task(F('F1')),
 { kind: 'fig', src: sheetDrawing, alt: 'Schemat połączenia urządzeń z arkusza' },
 { kind: 'cap', segs: ['Schemat połączenia urządzeń'] },
 {
  kind: 'task',
  off: true,
  segs: [
   '5. Przeprowadź na stacji roboczej identyfikację podzespołów komputera za pomocą dostępnych w systemie operacyjnym Linux narzędzi. Odczytane dane, zapisz w postaci zrzutów ekranowych, w katalogu Identyfikacja na dysku USB oznaczonym nazwą Egzamin-x, gdzie x to numer stanowiska egzaminacyjnego. Odczytane dane zapisz w Tabeli 1. Parametry podzespołów stacji roboczej znajdującej się w arkuszu egzaminacyjnym. W przypadku braku możliwości identyfikacji wymaganych parametrów przez system należy zapisać brak danych.'
  ]
 },
 task('6. Na stacji roboczej skonfiguruj system Windows:'),
 li(0, 'skonfiguruj przewodowy interfejs sieciowy podłączony do przełącznika:'),
 li(1, 'nazwa połączenia: LAN 2'),
 li(1, F('F8')),
 li(1, `brama domyślna: ${STATION_GW}`),
 li(1, `DNS: ${STATION_DNS}`),
 li(
  0,
  'w programie do wirtualizacji Oracle VirtualBox utwórz nową maszynę wirtualną z systemem Linux, skorzystaj przy tym z obrazu dysku ISO dostępnego w folderze PLIKI na nośniku opisanym DOKUMENTACJA/PROGRAMY. Wykonaj następujące czynności'
 ),
 li(1, F('F14')),
 li(1, 'skonfiguruj interfejs sieciowy maszyny wirtualnej Linux:'),
 li(2, 'nazwa interfejsu: LAN 3'),
 li(2, `adres IP: ${SHEET_VM_LAN3}`),
 li(2, `brama domyślna: ${STATION_GW}`),
 li(2, `DNS: ${STATION_DNS}`),
 task('7. Skonfiguruj serwer z zainstalowanym systemem operacyjnym Windows:'),
 li(0, 'skonfiguruj interfejs sieciowy serwera podłączony do rutera:'),
 li(1, 'nazwa połączenia: WAN'),
 li(1, 'adres IP oraz pozostałe parametry konfiguracji sieciowej: uzyskiwane automatycznie'),
 li(1, F('F6')),
 foot('Strona 3 z 6'),
 li(0, 'skonfiguruj interfejs sieciowy serwera podłączony do przełącznika:'),
 li(1, 'nazwa połączenia: LAN 1'),
 li(1, `adres IP: ${cidr('serwer-lan1')}`),
 li(1, F('F10')),
 li(1, `DNS: ${SERVER_DNS}`),
 li(0, 'zainstaluj na serwerze usługę DNS i IIS oraz skonfiguruj według zaleceń:'),
 li(1, 'utwórz nową strefę wyszukiwania do przodu: egzamin.local'),
 li(1, F('F11')),
 li(1, '…'),
 task(
  '8. ',
  F('F12'),
  ' Wyświetl adres IP interfejsu WAN serwera. ',
  F('F13')
 ),
 uwaga(
  f(
   'U8',
   'UWAGA: Po wykonaniu testów połączenia zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do przeprowadzenia ponownego sprawdzenia komunikacji serwera z ruterem oraz stacją roboczą.'
  ),
  ' Sprawdzenie wykonaj w obecności egzaminatora. Na ekranie serwera wyświetl automatycznie nadany adres IP'
 ),
 task(
  '9. ',
  F('F15'),
  ', następnie wyświetl konfigurację interfejsu sieciowego maszyny wirtualnej Linux.'
 ),
 uwaga(
  f(
   'U9',
   'UWAGA: Po wyświetleniu strony oraz konfiguracji interfejsu sieciowego zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do oceny poprawności jej wyświetlenia oraz oceny konfiguracji interfejsu sieciowego maszyny wirtualnej Linux.'
  ),
  ' Sprawdzenie wykonaj w obecności egzaminatora.'
 )
];
