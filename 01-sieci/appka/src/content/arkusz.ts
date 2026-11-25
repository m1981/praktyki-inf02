// „Arkusz krok po kroku”, etapy 1–2: sceny w stylu „rozmowa” i ćwiczenia „uczeń sam”.
// Źródło kwestii: scenariusz-arkusz-1-2.md, wersja 1 (zatwierdzona, PYT-074a). Zmiana kwestii =
// najpierw zmiana w scenariuszu. Test `arkusz.test.ts` porównuje kwestie ze scenariuszem.
// Nazwy urządzeń jak w arkuszu (PYT-074a); adresy tylko z `model/arkusz.ts`.

import type { ControlSpec, Course, Exercise, Note, Speaker, Step } from '../engine/types';
// Rysunek z arkusza (styczeń 2025, strona 3), wyjęty z PDF bez zmian.
import sheetDrawing from './arkusz-2025-01-schemat.jpg';
import {
 sheetGateway,
 sheetIp,
 SHEET_DHCP,
 SHEET_CARDS,
 SHEET_EXAMPLE,
 SHEET_ROUTER_DNS,
 SHEET_VM_LAN3,
 type SheetCard,
 type SheetNet
} from '../model/arkusz';
import type { TaskOption } from '../ui/controls/TalkControl';
import type { Figure } from '../ui/ExamFigure';
import type { LinesSpec, ReservationSpec, SheetLine } from '../ui/views/SheetParts';
import type { CardLabel, ExcerptRow, Field, SheetSpec, TableRow } from '../ui/views/SheetView';

const SPEAKERS: Record<string, Speaker> = {
 ola: { name: 'Ola', role: 'administratorka sieci', avatar: 'O', color: '#d9ecf9' },
 kuba: { name: 'Kuba', role: 'praktykant, uczy się do INF.02', avatar: 'K', color: '#f6e3c8' },
 quiz: { name: 'Zagadka', role: 'dla Ciebie', avatar: '?', color: '#e3f2fd' },
 task: { name: 'Teraz Ty', role: 'ćwiczenie bez Oli', avatar: '✍', color: '#e8f8f5' }
};

// --- Wycinek arkusza: linijki o adresach, słowa jak w arkuszu ---

const EXCERPT_TITLE = 'Arkusz, styczeń 2025 – linijki o adresach';
const LABELS: Record<Field, string> = {
 ip: 'adres IP:',
 gw: 'brama domyślna:',
 dns: 'DNS:',
 auto: 'adres IP oraz pozostałe parametry: uzyskiwane automatycznie'
};
const ROWS: readonly ExcerptRow[] = [
 { card: 'ruter-wan', heading: 'Ruter, interfejs WAN' },
 { card: 'ruter-lan', heading: 'Ruter, interfejs LAN' },
 { card: 'serwer-wan', heading: 'Serwer, karta „WAN”' },
 { card: 'serwer-lan1', heading: 'Serwer, karta „LAN 1”' },
 { card: 'przelacznik', heading: 'Przełącznik' },
 { card: 'stacja-lan2', heading: 'Stacja, karta „LAN 2”' }
];

type Excerpt = NonNullable<SheetSpec['excerpt']>;
const excerpt = (extra: Partial<Excerpt> = {}): Excerpt => ({
 title: EXCERPT_TITLE,
 rows: ROWS,
 labels: LABELS,
 ...extra
});

type Scene = Omit<SheetSpec, 'type'>;
const sheet = (state: Scene): SheetSpec => ({ type: 'sheet', ...state });

const ALL: readonly SheetNet[] = ['niebieska', 'zielona', 'fioletowa'];

// --- Kroki ---

const next: ControlSpec = { type: 'talk' };
const act = (label: string): ControlSpec => ({ type: 'talk', next: label });
const PAINT = act('🖍️ Pokoloruj ▶');

const say =
 (speaker: 'ola' | 'kuba') =>
 (text: string, view: Scene, control: ControlSpec = next): Step => ({
  speaker,
  text,
  view: sheet(view),
  control
 });
const ola = say('ola');
const kuba = say('kuba');

/** Krok-akcja: nikt nie mówi, na schemacie coś się dzieje. */
const action = (text: string, view: Scene): Step => ({
 action: true,
 text,
 view: sheet(view),
 control: next
});

const NOW_YOU = 'Teraz Ty ▶';

const quiz = (text: string, view: Scene, options: [string, string, boolean][]): Step => ({
 speaker: 'quiz',
 text,
 view: sheet(view),
 control: {
  type: 'quiz',
  next: NOW_YOU,
  options: options.map(([option, feedback, correct]) => ({ text: option, feedback, correct }))
 }
});

/** Polecenie ćwiczenia: uczeń klika na schemacie albo wybiera odpowiedź. */
const task = (
 text: string,
 view: Scene,
 options?: TaskOption[],
 end?: Partial<Extract<ControlSpec, { type: 'task' }>>
): Step => ({
 speaker: 'task',
 text,
 view: sheet(view),
 control: { type: 'task', options, ...end }
});

const yesNo = (correct: 'Tak' | 'Nie', feedback: string): TaskOption[] =>
 (['Tak', 'Nie'] as const).map((text) =>
  text === correct ? { text, correct: true } : { text, feedback }
 );

const CARDS_AND_SWITCH: readonly SheetCard[] = [
 'ruter-wan',
 'ruter-lan',
 'serwer-wan',
 'serwer-lan1',
 'przelacznik',
 'stacja-lan2'
];
const SERVER_CARDS: readonly SheetCard[] = ['serwer-wan', 'serwer-lan1'];

// --- Etap 1: „Koloruję sieci” ---

const DIM = excerpt({ dim: true });

// „Dla dociekliwych” (PYT-095): treść ze scenariusza, sekcja o tej samej nazwie (test co do słowa).
const NOTES_1: Note[] = [
 {
  q: 'Dlaczego sieć kończy się na karcie rutera albo serwera?',
  a: 'Przełącznik przekazuje ramki dalej. Ramka do wszystkich (Broadcast) zatrzymuje się na karcie rutera albo serwera – tam kończy się sieć.'
 },
 {
  q: 'Po co serwerowi dwie karty?',
  a: 'Każda karta stoi w innej sieci. Serwer stoi między siecią stacji a siecią rutera, jak brama.'
 },
 {
  q: 'Dlaczego akurat te kolory?',
  a: 'Kolory to tylko etykiety sieci. Pomarańczowego nie używamy, bo w naszych materiałach znaczy Broadcast.'
 },
 {
  q: 'Skąd ten schemat?',
  a: 'Z arkusza INF.02 ze stycznia 2025 – rysunek jest pod spodem. Układ „serwer w środku” wraca w kilku arkuszach 2025–2026.'
 }
];

const ETAP_1: Exercise = {
 code: '1',
 title: 'Koloruję sieci',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_1,
 steps: [
  kuba('Dostałem arkusz. Sam tekst i adresy – nic nie widzę 😩', { excerpt: excerpt() }),
  ola('Odłóż adresy. Najpierw policzymy sieci.', { excerpt: DIM }),
  ola(
   'Sieć to wszystko, co łączy kabel i przełącznik.',
   { excerpt: DIM, pulse: ['stacja', 'przelacznik', 'c-stacja'] },
   PAINT
  ),
  action('Ola koloruje pierwszą sieć na niebiesko…', {
   excerpt: DIM,
   colored: ['niebieska'],
   spread: 'niebieska'
  }),
  ola('Sieć kończy się na karcie serwera. Dalej jest już inna.', {
   excerpt: DIM,
   colored: ['niebieska'],
   pulse: ['serwer-lan1']
  }),
  kuba('Czyli serwer stoi w dwóch sieciach naraz? 🤔', {
   excerpt: DIM,
   colored: ['niebieska'],
   pulse: ['serwer-wan']
  }),
  ola(
   'Tak – ma dwie karty. Każda karta to inna sieć.',
   { excerpt: DIM, colored: ['niebieska'], pulse: ['serwer-wan'] },
   PAINT
  ),
  action('Ola koloruje drugą sieć na zielono…', {
   excerpt: DIM,
   colored: ['niebieska', 'zielona'],
   spread: 'zielona'
  }),
  ola('Ruter też ma drugą kartę – tę na świat.', {
   excerpt: DIM,
   colored: ALL,
   spread: 'fioletowa'
  }),
  kuba('Trzy kolory – trzy sieci. To już coś widzę 🙂', { excerpt: DIM, colored: ALL }),
  quiz('W ilu sieciach jest serwer?', { excerpt: DIM, colored: ALL }, [
   ['A) W jednej.', 'Policz jego karty – ma dwie, w dwóch kolorach.', false],
   ['B) W dwóch.', 'Właśnie tak. Dwie karty – dwie sieci.', true]
  ]),
  // Ćwiczenie: ten sam schemat bez kolorów; po dobrej odpowiedzi sieć się koloruje.
  task('Kliknij wszystko, co jest w jednej sieci ze stacją roboczą.', {
   task: {
    kind: 'pick',
    targets: CARDS_AND_SWITCH,
    answer: ['stacja-lan2', 'przelacznik', 'serwer-lan1'],
    wrong: 'Ta karta jest za serwerem. Sieć kończy się na jego karcie.'
   },
   solvedColored: ['niebieska']
  }),
  task('Kliknij kartę serwera, która jest w jednej sieci z ruterem.', {
   colored: ['niebieska'],
   task: {
    kind: 'pick',
    targets: SERVER_CARDS,
    answer: ['serwer-wan'],
    wrong: 'To karta od strony przełącznika. Poszukaj tej od strony rutera.'
   },
   solvedColored: ['zielona']
  }),
  task(
   'Ile sieci jest na schemacie?',
   { colored: ['niebieska', 'zielona'], solvedColored: ['fioletowa'] },
   ['1', '2', '3', '4'].map((text) =>
    text === '3'
     ? { text, correct: true }
     : { text, feedback: 'Policz kolory: stacja–serwer, serwer–ruter, ruter–świat.' }
   )
  ),
  task(
   'Stacja robi ping do przełącznika. Czy ping wychodzi poza jej sieć?',
   { colored: ALL },
   yesNo('Nie', 'Oba są niebieskie – ping zostaje w jednej sieci.')
  )
 ]
};

// --- Etap 2: „Z arkusza do tabeli adresów” ---

const STATION_IP = { 'stacja-lan2': ['ip'] } as const;
const GW_LABEL = sheetGateway('stacja-lan2');
const EVERY_ADDRESS: SheetSpec['shown'] = {
 'ruter-wan': ['ip', 'gw'],
 'ruter-lan': ['ip'],
 'serwer-wan': ['auto'],
 'serwer-lan1': ['ip', 'gw', 'dns'],
 przelacznik: ['ip', 'gw'],
 'stacja-lan2': ['ip', 'gw', 'dns']
};
/** Etap 2 dzieje się na pokolorowanym schemacie, z wycinkiem arkusza obok. */
const colored = (state: Scene): Scene => ({ colored: ALL, excerpt: excerpt(), ...state });
const lit = (...keys: NonNullable<Excerpt['lit']>): Excerpt => excerpt({ lit: keys });

const TABLE_ROWS: readonly TableRow[] = [
 { card: 'ruter-lan', name: 'Ruter, interfejs\u00a0LAN', about: 'interfejsie LAN rutera' },
 { card: 'serwer-wan', name: 'Serwer, „WAN”', about: 'karcie „WAN” serwera' },
 { card: 'serwer-lan1', name: 'Serwer, „LAN\u00a01”', about: 'karcie „LAN 1” serwera' },
 { card: 'przelacznik', name: 'Przełącznik', about: 'przełączniku' },
 { card: 'stacja-lan2', name: 'Stacja, „LAN\u00a02”', about: 'karcie „LAN 2” stacji' }
];

const WRONG_GATE_IP = sheetIp('ruter-lan');

const NOTES_2: Note[] = [
 {
  q: 'Dlaczego maska /25 nie przeszkadza?',
  a: 'Wszystkie niebieskie adresy (.1, .2, .3) leżą w tej samej połowie sieci: od .0 do .127. Liczenie masek ćwiczysz w „Płotach maski”.'
 },
 {
  q: 'Dlaczego na karcie LAN 1 serwera „brama: brak”?',
  a: 'Urządzenie ma jedną bramę domyślną, nawet gdy ma kilka kart. Serwer wychodzi w świat kartą WAN, więc tam jest jego brama.'
 },
 {
  q: 'Skąd karta WAN serwera ma adres?',
  a: 'Arkusz mówi „uzyskiwane automatycznie”: adres daje DHCP rutera. Wyjaśnia to warstwa 3 „Skąd adres?”.'
 },
 {
  q: 'Czy stacja wyjdzie przez serwer do Internetu?',
  a: 'To zależy od usługi routingu na serwerze. W tym arkuszu nie jest to oceniane, więc scena tego nie rusza.'
 },
 {
  q: 'Gdzie jest maszyna wirtualna?',
  a: `W arkuszu jest jeszcze maszyna wirtualna z kartą „LAN 3”: ${SHEET_VM_LAN3}, w tej samej niebieskiej sieci. Pomijamy ją, żeby schemat był prostszy.`
 },
 {
  q: `Kto zna nazwy (DNS ${sheetIp('serwer-lan1')})?`,
  a: 'Serwer ma usługę DNS ze strefą egzamin.local. Więcej w warstwie „Kto zna nazwy?”.'
 }
];

const ETAP_2: Exercise = {
 code: '2',
 title: 'Z arkusza do tabeli adresów',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_2,
 steps: [
  kuba('Sieci widzę. Ale gdzie wpisać te wszystkie adresy?', colored({})),
  ola(
   'Każda linijka arkusza mówi o jednej karcie.',
   colored({
    excerpt: lit('stacja-lan2:ip', 'stacja-lan2:gw', 'stacja-lan2:dns'),
    pulse: ['stacja-lan2']
   }),
   act('📌 Przypnij ▶')
  ),
  action(
   'Adres ląduje przy karcie stacji…',
   colored({ excerpt: lit('stacja-lan2:ip'), shown: STATION_IP, fly: 'stacja-lan2' })
  ),
  ola(
   'Adres – to kim jestem w swojej sieci.',
   colored({ shown: STATION_IP, pulse: ['addr:stacja-lan2'] })
  ),
  ola(
   'Brama – to karta, przez którą wychodzę ze swojej sieci.',
   colored({ shown: STATION_IP, arrows: ['gw'], gwLabel: GW_LABEL })
  ),
  kuba(
   'Bramą stacji jest serwer? Nie ruter? 🤨',
   colored({ shown: STATION_IP, arrows: ['gw'], gwLabel: GW_LABEL, pulse: ['ruter'] })
  ),
  ola(
   'Ruter jest zielony. Stacja wprost do niego nie sięgnie.',
   colored({ shown: STATION_IP, arrows: ['blocked'] })
  ),
  ola(
   'Brama musi być w moim kolorze. Zawsze.',
   colored({
    shown: STATION_IP,
    arrows: ['gw'],
    gwLabel: GW_LABEL,
    pulse: ['stacja-lan2', 'serwer-lan1']
   })
  ),
  kuba(
   'A serwer? Na karcie „LAN 1” ma „brama: brak”.',
   colored({
    excerpt: lit('serwer-lan1:gw'),
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL
   })
  ),
  ola(
   'Bo w świat wychodzi drugą kartą – tą zieloną.',
   colored({
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw', 'out'],
    gwLabel: GW_LABEL
   })
  ),
  // „Komputer” zostaje co do słowa (PYT-075b): mowa ogólna, nie nazwa urządzenia ze schematu.
  ola(
   'Komputer ma jedno wyjście w świat. Nie dwa.',
   colored({
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw', 'out'],
    gwLabel: GW_LABEL,
    pulse: ['arrow:out']
   })
  ),
  kuba(
   'A DNS – co to za adres?',
   colored({
    excerpt: lit('stacja-lan2:dns'),
    shown: { 'stacja-lan2': ['ip', 'gw', 'dns'], 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL
   })
  ),
  ola(
   'Adres tego, kto zna nazwy. Tutaj – serwer.',
   colored({
    shown: { 'stacja-lan2': ['ip', 'gw', 'dns'], 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL,
    note: 'DNS → serwer',
    pulse: ['serwer-lan1']
   })
  ),
  quiz('Co stacja wpisze jako bramę?', colored({ shown: EVERY_ADDRESS }), [
   ['A) Adres rutera.', 'Ruter jest w innym kolorze. Brama musi być w kolorze stacji.', false],
   ['B) Adres serwera.', 'Właśnie tak – karta „LAN 1” serwera, ta niebieska.', true]
  ]),
  // Ćwiczenie: linijka arkusza → pole tabeli (mechanika i podpowiedzi: PYT-077a).
  task(
   'Kliknij linijkę arkusza, a potem pole tabeli, do którego należy.',
   colored({
    task: {
     kind: 'table',
     rows: TABLE_ROWS,
     hints: { row: 'Ta linijka mówi o {about}.', column: 'To jest {is}, nie {cell}.' },
     head: { card: 'Karta (kolor sieci)', ip: 'Adres IP', gw: 'Brama', dns: 'DNS' },
     fieldNames: { ip: 'adres IP', gw: 'brama', dns: 'DNS' },
     netNames: { niebieska: 'sieć niebieska', zielona: 'sieć zielona', fioletowa: 'sieć fioletowa' }
    }
   })
  ),
  task(
   'Kliknij kartę, która jest bramą przełącznika.',
   colored({
    excerpt: undefined,
    shown: EVERY_ADDRESS,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-lan1'],
     wrong: `Brama przełącznika to ${sheetGateway('przelacznik')}. Znajdź kartę z tym adresem.`
    }
   })
  ),
  task(
   'Serwer ma dwie karty. Na której wpiszesz bramę?',
   colored({
    excerpt: undefined,
    shown: EVERY_ADDRESS,
    task: {
     kind: 'pick',
     targets: SERVER_CARDS,
     answer: ['serwer-wan'],
     wrong: 'Na „LAN 1” arkusz mówi: brak. Wyjście w świat jest po stronie rutera.'
    }
   })
  ),
  task(
   `Stacja dostała bramę ${WRONG_GATE_IP}. Zadziała?`,
   colored({ excerpt: undefined, shown: EVERY_ADDRESS }),
   yesNo('Nie', `${WRONG_GATE_IP} jest zielone, stacja niebieska. Brama musi być w jej kolorze.`)
  )
 ]
};

// --- Warstwa 3: „Skąd adres?” (scenariusz-arkusz-3.md, wersja 3; PYT-090a, PYT-092a) ---
// Reguła warstwy: 1 pytanie, 5 linijek arkusza, 2 pułapki, 1 nowa rzecz na schemacie (strzałka DHCP).

const { from: POOL_FROM, to: POOL_TO, reserved: RESERVED } = SHEET_DHCP;
const { leased: LEASED, macWan: MAC_WAN, macLan1: MAC_LAN1 } = SHEET_EXAMPLE;
const lastOctet = (ip: string) => Number(ip.split('.').at(-1));

const LINES: readonly SheetLine[] = [
 { id: 'L1', text: 'serwer DHCP: włączony' },
 { id: 'L2', text: `zakres adresów: ${POOL_FROM} ÷ ${POOL_TO}` },
 { id: 'L3', text: `zarezerwowany adres IP ${RESERVED} dla interfejsu WAN serwera` },
 {
  id: 'L4',
  text: 'adres IP oraz pozostałe parametry konfiguracji sieciowej: uzyskiwane automatycznie'
 },
 { id: 'L5', text: 'odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze' }
];
const LINES_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o tym, skąd adres';
const lines = (...lit: string[]): LinesSpec => ({ title: LINES_TITLE, items: LINES, lit });

const EXAMPLE = '(przykład)';
const ON_ROUTER = 'Jesteś na: ruter';
const ON_SERVER = 'Jesteś na: serwer';
const DHCP_ARROW = 'adres z DHCP';
const DHCP_RESERVED = `${RESERVED} ↔ MAC karty WAN`;

const QUESTION: Scene['labels'] = { 'serwer-wan': [{ text: '?' }] };
const leasedLabel = (tone?: CardLabel['tone']): Scene['labels'] => ({
 'serwer-wan': [
  { text: LEASED, tone },
  { text: EXAMPLE, tone: 'example' }
 ]
});
/** MAC-i przy obu kartach serwera; LAN 1 w trzecim rzędzie, żeby napisy na siebie nie wchodziły. */
const macLabels = (wan?: CardLabel['tone'], lan1?: CardLabel['tone']): Scene['labels'] => ({
 'serwer-wan': [{ text: LEASED }, { text: `MAC ${MAC_WAN}`, tone: wan ?? 'example' }],
 'serwer-lan1': [{ text: '' }, { text: '' }, { text: `MAC ${MAC_LAN1}`, tone: lan1 ?? 'example' }]
});

/** Okno rezerwacji – napisy jak w panelu TP-Link (mapa-menu-urzadzen.md). */
const reservation = (stage: ReservationSpec['stage']): ReservationSpec => ({
 stage,
 labels: {
  title: 'Add a Reservation Entry',
  mac: 'MAC Address',
  ip: 'IP Address',
  view: 'VIEW CONNECTED DEVICES',
  save: 'SAVE',
  list: 'Select from Connected Devices:'
 },
 device: { name: 'serwer (WAN)', mac: MAC_WAN, ip: LEASED },
 fixedIp: RESERVED,
 example: `MAC i adres ${LEASED} to przykład – na egzaminie będą inne.`
});

/** Warstwa 3 dzieje się na pokolorowanym schemacie; adresy z etapu 2 są tłem (przygaszone). */
const layer3 = (state: Scene): Scene => ({
 colored: ALL,
 shown: EVERY_ADDRESS,
 shownDim: true,
 lines: lines(),
 ...state
});

const NOTES_3: Note[] = [
 {
  q: 'Co to jest DHCP?',
  a: 'Usługa, która rozdaje adresy kartom ustawionym na „automatycznie”. Na tym arkuszu działa na ruterze; w innych arkuszach bywa na serwerze.'
 },
 {
  q: 'Co jeszcze daje DHCP oprócz adresu?',
  a: `Maskę, bramę (${sheetIp('ruter-lan')}) i DNS. Dlatego w tabeli z etapu 2 karta WAN serwera ma „automatycznie” w każdej kolumnie.`
 },
 {
  q: 'Dlaczego najpierw /release, a potem /renew?',
  a: `Samo /renew prosi o przedłużenie starego adresu (${LEASED}) i część ruterów go przedłuży. /release oddaje stary adres, /renew prosi o nowy – wtedy przychodzi zarezerwowany.`
 },
 {
  q: 'Co, jeśli karty nie ma na liście w panelu?',
  a: `MAC odczytasz na serwerze: ipconfig /all, karta z adresem ${LEASED}, pole „Adres fizyczny”.`
 },
 {
  q: 'Dlaczego MAC z ipconfig ma myślniki, a panel czasem chce dwukropków?',
  a: 'To ten sam adres zapisany na dwa sposoby. Przy przepisywaniu zamień znaki.'
 },
 {
  q: 'Co znaczy adres 169.254.x.x?',
  a: 'DHCP nie odpowiedział – np. kabel jest w złym porcie. Sprawdzanie takich kłopotów to osobna warstwa.'
 },
 {
  q: `Dlaczego ${LEASED} i MAC na schemacie są „przykładem”?`,
  a: 'Arkusz ich nie podaje. Na egzaminie zobaczysz inne liczby – liczy się, skąd je wziąć.'
 }
];

const ETAP_3: Exercise = {
 code: '3',
 title: 'Skąd adres?',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_3,
 steps: [
  kuba(
   'Serwer, karta »WAN«: »uzyskiwane automatycznie«. Od kogo? 🤔',
   layer3({ shownDim: false, lines: lines('L4'), labels: QUESTION, pulse: ['serwer-wan'] })
  ),
  ola(
   'Te wpisaliśmy ręcznie. Tę dostaje się od DHCP – rozdawacza adresów.',
   layer3({ labels: QUESTION })
  ),
  ola(
   'Na tym arkuszu adresy rozdaje ruter.',
   layer3({ lines: lines('L1'), labels: QUESTION, pulse: ['ruter-lan'] })
  ),
  kuba('Komu rozdaje? Stacji też?', layer3({ labels: QUESTION, pulse: ['stacja'] })),
  ola(
   'Nie. DHCP działa na karcie LAN rutera – tylko zielona sieć.',
   layer3({ colored: ['zielona'], labels: QUESTION, pulse: ['ruter-lan'] }),
   act('📨 Poproś ▶')
  ),
  action(
   'Serwer prosi o adres, ruter odpowiada…',
   layer3({ dhcp: { label: DHCP_ARROW, run: true }, labels: leasedLabel() })
  ),
  kuba(
   `Dostał ${LEASED} z zakresu. A arkusz chce ${RESERVED}!`,
   layer3({
    dhcp: { label: DHCP_ARROW },
    labels: leasedLabel('warn'),
    lines: {
     ...lines('L2', 'L3'),
     pool: {
      after: 'L2',
      from: lastOctet(POOL_FROM),
      to: lastOctet(POOL_TO),
      mark: lastOctet(LEASED)
     }
    }
   })
  ),
  ola(
   'Dlatego jest rezerwacja: ten adres zawsze dla tej karty.',
   layer3({ dhcp: { label: DHCP_ARROW }, labels: leasedLabel('warn'), lines: lines('L3') })
  ),
  kuba(
   'Skąd ruter wie, która karta to ta?',
   layer3({
    dhcp: { label: DHCP_ARROW },
    labels: leasedLabel(),
    pulse: ['serwer-wan', 'serwer-lan1']
   })
  ),
  ola(
   'Po MAC – pamiętasz go z ARP? Każda karta ma swój.',
   layer3({ dhcp: { label: DHCP_ARROW }, labels: macLabels() })
  ),
  ola(
   `Panel rutera ma listę kart. Wybierz tę z ${LEASED}.`,
   layer3({
    youAreOn: ON_ROUTER,
    dhcp: { label: DHCP_ARROW },
    labels: macLabels('frame', 'strike'),
    reservation: reservation('list'),
    lines: undefined
   }),
   act('📌 Wybierz ▶')
  ),
  kuba(
   `Wybrałem. Ale w polu adresu wpisało się ${LEASED} 🤨`,
   layer3({
    youAreOn: ON_ROUTER,
    dhcp: { label: DHCP_ARROW },
    labels: macLabels('frame', 'strike'),
    reservation: reservation('picked'),
    lines: undefined
   })
  ),
  ola(
   'Lista podaje obecny adres. Wpisz ten z arkusza.',
   layer3({
    youAreOn: ON_ROUTER,
    dhcp: { label: DHCP_ARROW },
    labels: macLabels('frame', 'strike'),
    reservation: reservation('fixed'),
    lines: { ...lines('L3'), items: LINES.filter((l) => l.id === 'L3') }
   }),
   act('💾 Zapisz ▶')
  ),
  action(
   `Ruter zapisuje rezerwację: MAC karty WAN → ${RESERVED}…`,
   layer3({ youAreOn: ON_ROUTER, dhcp: { label: DHCP_RESERVED }, labels: leasedLabel() })
  ),
  kuba(
   'Wpisałem rezerwację, a serwer dalej ma stary adres 😩',
   layer3({
    youAreOn: ON_SERVER,
    dhcp: { label: DHCP_RESERVED },
    labels: leasedLabel('warn'),
    lines: lines('L5')
   })
  ),
  ola(
   'Serwer pamięta stary. Każ mu zapytać jeszcze raz.',
   layer3({
    youAreOn: ON_SERVER,
    dhcp: { label: DHCP_RESERVED },
    labels: leasedLabel('warn'),
    commands: ['ipconfig /release', 'ipconfig /renew']
   }),
   act('🔄 Odśwież ▶')
  ),
  action(
   'Serwer pyta jeszcze raz i dostaje swój adres…',
   layer3({
    youAreOn: ON_SERVER,
    dhcp: { label: DHCP_RESERVED, run: true },
    labels: { 'serwer-wan': [{ text: `${RESERVED} ✓`, tone: 'ok' }] }
   })
  ),
  quiz(
   'Po czym ruter pozna kartę serwera?',
   layer3({
    dhcp: { label: DHCP_RESERVED },
    labels: { 'serwer-wan': [{ text: `${RESERVED} ✓`, tone: 'ok' }] }
   }),
   [
    ['A) Po nazwie »WAN«.', 'Nazwę »WAN« zna tylko Windows. Ruter widzi MAC.', false],
    ['B) Po MAC.', 'Właśnie tak – MAC jest jak numer seryjny karty.', true]
   ]
  ),
  // Ćwiczenie: schemat z adresami z etapu 2, bez strzałki DHCP, przy karcie „WAN” serwera „?”.
  task(
   'Kliknij kartę, która dostaje adres od DHCP.',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-wan'],
     wrong: 'Ta karta ma adres wpisany ręcznie. Szukaj »automatycznie«.'
    }
   })
  ),
  task(
   'Kliknij linijki, które ustawiasz na ruterze.',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'lines',
     answer: ['L1', 'L2', 'L3'],
     check: 'Sprawdź',
     wrong: 'Tę linijkę robisz na serwerze, nie na ruterze.',
     missingOne: 'Brakuje jednej. Rezerwację też wpisujesz na ruterze.',
     missingOneId: 'L3',
     missingMore: 'Brakuje linijek. Wszystkie ustawienia DHCP wpisujesz na ruterze.'
    }
   })
  ),
  task(
   'Do rezerwacji potrzebujesz MAC. Której karty?',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'pick',
     targets: SERVER_CARDS,
     answer: ['serwer-wan'],
     wrong: 'LAN 1 jest niebieska. Rezerwacja dotyczy karty w sieci rutera.'
    }
   })
  ),
  task(
   `Serwer ma ${LEASED} zamiast ${RESERVED}. Co robisz?`,
   layer3({ shownDim: false, labels: leasedLabel('warn') }),
   [
    {
     text: `A) Wpisuję ${RESERVED} ręcznie.`,
     feedback: 'Nie wpisuj ręcznie – arkusz każe »automatycznie«. Sprawdź rezerwację i odśwież.'
    },
    { text: 'B) Sprawdzam rezerwację i odświeżam adres.', correct: true }
   ]
  )
 ]
};

// --- Warstwa 4: „Kto zna nazwy?” (scenariusz-arkusz-4.md, wersja 2; PYT-098a) ---
// Nowa rzecz na schemacie: strzałka „pytanie o nazwę” (przerywana, ciemna).

const LAN1_IP = sheetIp('serwer-lan1');
const SHEET_CARDS_DNS = (card: SheetCard): string => SHEET_CARDS[card].dns ?? '';
const DNS_WORLD = SHEET_ROUTER_DNS.primary;
const NAME = 'www.egzamin.local';

const LINES_4: readonly SheetLine[] = [
 { id: 'L1', where: 'stacja, LAN 2', text: `DNS: ${SHEET_CARDS_DNS('stacja-lan2')}` },
 { id: 'L2', where: 'serwer, LAN 1', text: `DNS: ${SHEET_CARDS_DNS('serwer-lan1')}` },
 {
  id: 'L3',
  where: 'serwer',
  text:
   'ustaw w strefie egzamin.local nowy rekord hosta o nazwie www, powiązany z adresem IP interfejsu sieciowego LAN 1'
 },
 { id: 'L4', where: 'ruter, DHCP', text: `serwer DNS: ${SHEET_DHCP.dns}` },
 {
  id: 'L5',
  where: 'ruter, WAN',
  text: `serwer DNS dla interfejsu WAN: ${DNS_WORLD} oraz drugi serwer DNS: ${SHEET_ROUTER_DNS.secondary}, jeśli jest wymagany`
 }
];
const LINES_4_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o tym, kto zna nazwy';
const lines4 = (...lit: string[]): LinesSpec => ({ title: LINES_4_TITLE, items: LINES_4, lit });

const ASKING = `${NAME} = ?`;
const NOT_FOUND = `${NAME} = ? ✕`;
const FOUND = `${NAME} = ${LAN1_IP} ✓`;
const BLOCKED: Scene['asks'] = [
 { from: 'stacja-lan2', to: 'world', blocked: true, label: 'brak odpowiedzi' }
];
const TO_SERVER: Scene['asks'] = [
 { from: 'stacja-lan2', to: 'serwer-lan1', label: `www? → ${LAN1_IP}` }
];
/** Spis serwera – w 2. i 3. rzędzie pod kartą LAN 1, żeby nie wchodził na adres karty WAN. */
const ZONE: CardLabel[] = [
 { text: '' },
 { text: 'strefa egzamin.local' },
 { text: `rekord: www → ${LAN1_IP}` }
];

/** Warstwa 4: schemat w kolorach, adresy z etapu 2 jako tło, przy karcie WAN serwera adres z warstwy 3. */
const layer4 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  shown: EVERY_ADDRESS,
  shownDim: true,
  lines: lines4(),
  labels: { 'serwer-wan': [{ text: RESERVED }], ...labels },
  ...rest
 };
};

const NOTES_4: Note[] = [
 {
  q: 'Gdzie arkusz sprawdza DNS?',
  a: `W zadaniu 9: maszyna wirtualna otwiera ${NAME}. Ustaw DNS ${LAN1_IP} także w niej – to ją ocenia egzaminator.`
 },
 {
  q: 'Co to jest strefa wyszukiwania do przodu?',
  a: 'Spis „nazwa → adres” dla jednej domeny, tu egzamin.local. Spis odwrotny („adres → nazwa”) to strefa wsteczna – arkusz jej nie wymaga.'
 },
 {
  q: 'Czym sprawdzić DNS?',
  a: `Na stacji: nslookup ${NAME}. Odpowiedź powinna podać ${LAN1_IP}.`
 },
 {
  q: 'Skąd serwer zna nazwy spoza egzamin.local?',
  a: 'Usługa DNS na Windows Server sama pyta serwery główne Internetu – przez kartę WAN i ruter. Arkusz tego nie ocenia.'
 },
 {
  q: 'Dlaczego „drugi serwer DNS, jeśli jest wymagany”?',
  a: 'Niektóre panele rutera nie zapiszą ustawień bez drugiego DNS. Gdy panel nie protestuje, drugie pole możesz zostawić puste.'
 },
 {
  q: 'Co ma do tego IIS?',
  a: `Witryna jest powiązana z kartą LAN 1 i nazwą ${NAME}. Rekord www ze złym adresem poprowadzi przeglądarkę tam, gdzie strony nie ma. Instalację IIS ćwiczysz w Filarze 2.`
 }
];

const ETAP_4: Exercise = {
 code: '4',
 title: 'Kto zna nazwy?',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_4,
 steps: [
  kuba(
   `Stacja ma otworzyć ${NAME}. Skąd wie, gdzie to? 🤔`,
   layer4({ shownDim: false, bubble: ASKING, pulse: ['stacja'] })
  ),
  ola('Ludzie pamiętają nazwy, a sieć używa adresów.', layer4({ bubble: ASKING })),
  ola(
   'DNS zamienia nazwę na adres. Jak kontakty w telefonie.',
   layer4({ bubble: ASKING, pulse: ['stacja-lan2'] })
  ),
  kuba(
   `DNS? Wpiszę ${DNS_WORLD} – jak na ruterze!`,
   layer4({ bubble: ASKING, lines: lines4('L5') }),
   act('🔎 Zapytaj ▶')
  ),
  action(`Stacja pyta ${DNS_WORLD} o ${NAME}…`, layer4({ bubble: ASKING, asks: BLOCKED })),
  kuba('Nie działa! Strona się nie otwiera 😩', layer4({ bubble: NOT_FOUND, asks: BLOCKED })),
  ola(
   `Tam nie dojdziesz. A ${DNS_WORLD} i tak nie zna egzamin.local.`,
   layer4({ bubble: NOT_FOUND, asks: BLOCKED })
  ),
  ola(
   'egzamin.local zna tylko serwer. Ma ją w swoim spisie.',
   layer4({ bubble: ASKING, lines: lines4('L3'), labels: { 'serwer-lan1': ZONE } }),
   act('🔎 Zapytaj ▶')
  ),
  action(
   'Stacja pyta serwer, serwer odpowiada adresem…',
   layer4({ bubble: FOUND, lines: lines4('L1'), asks: TO_SERVER, labels: { 'serwer-lan1': ZONE } })
  ),
  kuba(
   `W rekordzie wpiszę ${RESERVED}? To przecież też serwer.`,
   layer4({ bubble: FOUND, labels: { 'serwer-lan1': ZONE }, pulse: ['serwer-wan'] })
  ),
  ola(
   `Arkusz mówi »LAN 1«. Jej adres masz w tabeli: ${LAN1_IP}.`,
   layer4({
    bubble: FOUND,
    lines: lines4('L3'),
    labels: { 'serwer-lan1': ZONE },
    pulse: ['serwer-lan1']
   })
  ),
  kuba(
   `A serwer? Ma DNS ${LAN1_IP}, a od DHCP ${SHEET_DHCP.dns}.`,
   layer4({ bubble: FOUND, lines: lines4('L2', 'L4'), labels: { 'serwer-lan1': ZONE } })
  ),
  ola(
   'Oba to jego własne adresy. Pyta sam siebie.',
   layer4({
    bubble: FOUND,
    lines: lines4('L2', 'L4'),
    labels: { 'serwer-lan1': ZONE },
    asks: [
     { from: 'serwer-wan', to: 'self' },
     { from: 'serwer-lan1', to: 'self' }
    ]
   })
  ),
  kuba(
   `To po co ${DNS_WORLD}?`,
   layer4({ bubble: FOUND, lines: lines4('L5'), labels: { 'serwer-lan1': ZONE } })
  ),
  ola(
   'Dla samego rutera. Na stacji go nie wpisujesz.',
   layer4({
    bubble: FOUND,
    lines: lines4('L5'),
    labels: { 'serwer-lan1': ZONE },
    asks: [{ from: 'ruter-wan', to: 'world', label: `${DNS_WORLD}?` }]
   })
  ),
  quiz(
   'Co stacja wpisze jako DNS?',
   layer4({
    bubble: FOUND,
    labels: { 'serwer-lan1': ZONE },
    asks: [...TO_SERVER!, { from: 'ruter-wan', to: 'world', label: `${DNS_WORLD}?` }]
   }),
   [
    [`A) ${DNS_WORLD}.`, `${DNS_WORLD} nie zna egzamin.local. Stacja pyta serwer.`, false],
    [`B) ${LAN1_IP}.`, 'Właśnie tak – karta LAN 1 serwera, w kolorze stacji.', true]
   ]
  ),
  // Ćwiczenie: bez strzałek pytań, bez spisu serwera; przy karcie WAN serwera adres z warstwy 3.
  task(
   'Kliknij kartę, którą stacja pyta o nazwy.',
   layer4({
    shownDim: false,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-lan1'],
     wrong: 'Ta karta nie zna egzamin.local. Szukaj adresu z wpisu DNS stacji.'
    }
   })
  ),
  task(
   'Kliknij linijki, w których adres DNS to nasz serwer.',
   layer4({
    shownDim: false,
    task: {
     kind: 'lines',
     answer: ['L1', 'L2', 'L4'],
     check: 'Sprawdź',
     wrong: `»Serwer DNS« to nazwa pola. ${DNS_WORLD} to nie nasz serwer.`,
     wrongBy: { L3: 'To rekord w strefie serwera, nie adres DNS karty.' },
     missingOne: `Brakuje jednej. ${SHEET_DHCP.dns} to też serwer – jego karta WAN.`,
     missingOneId: 'L4',
     missingMore: `Brakuje linijek. Szukaj adresów serwera: ${LAN1_IP} i ${SHEET_DHCP.dns}.`
    }
   })
  ),
  task('Rekord www: który adres wpiszesz?', layer4({ shownDim: false }), [
   { text: `A) ${RESERVED}.`, feedback: `Arkusz każe kartę LAN 1. Jej adres to ${LAN1_IP}.` },
   { text: `B) ${LAN1_IP}.`, correct: true }
  ]),
  task(
   `Kliknij kartę, której DNS to ${DNS_WORLD}.`,
   layer4({
    shownDim: false,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['ruter-wan'],
     wrong: `Ta karta pyta nasz serwer. ${DNS_WORLD} jest w ustawieniach rutera.`
    }
   }),
   undefined,
   { end: '↺ Od początku', restart: true }
  )
 ]
};

export const ARKUSZ: Course = {
 id: 'arkusz',
 title: 'Etapy ścieżki „Arkusz krok po kroku”',
 exercises: [ETAP_1, ETAP_2, ETAP_3, ETAP_4]
};

/** Pod ćwiczeniami obu etapów: oryginalny schemat z arkusza, poglądowo (prośba operatora). */
export const ARKUSZ_FIGURE: Figure = {
 src: sheetDrawing,
 alt: 'Schemat sieci z arkusza: Ruter (port LAN) – Serwer (karty WAN i LAN 1) – Przełącznik (porty 1 i 3) – Stacja robocza (LAN 2)',
 caption: 'Tak ten schemat wygląda w arkuszu INF.02 (styczeń 2025, strona 3) – poglądowo.'
};
