// Seria mikro-ćwiczeń M1–M4 (audyt.md, rozdz. 4–5): każde ćwiczenie = jedno pytanie, jedno nowe
// pojęcie, jeden element sterujący, jeden ekran. Ostatnia zakładka to „Tryb swobodny” (PYT-002a).
// DLACZEGO DANE, A NIE KOMPONENTY: teksty i sceny kroków są w jednym miejscu, a test pilnuje limitu
// słów, nazw ze Słownika pojęć i tego, że każda ramka idzie po istniejącym kablu.

import type { ControlSpec, Course, Exercise } from '../engine/types';
import { firstThreeOctets, formatIp, parseIp } from '../lib/ipv4';
import { nameOf } from '../model/glossary';
import {
 device,
 deviceCidr,
 deviceIp,
 deviceIpText,
 deviceMac,
 forwardsBroadcast,
 INTERNET_IP,
 LINKS,
 ZONES,
 type DeviceId
} from '../model/siec';
import { arpRequest } from '../net/arp';
import { ROUTER_IP, routerIpIn } from '../net/mask';
import { floodPath } from '../net/path';
import { floodRoles } from '../net/traffic';
import { cable } from '../ui/diagram/graph';
import type { Cable, Device, DiagramState } from '../ui/diagram/types';
import type { CompareRow } from '../ui/views/CompareView';
import type { FenceSpec } from '../ui/views/FenceView';
import { CABLES, devicesFor, maskDiagram, PINS, SWITCH_NOTE } from './maska-uklad';

// --- Elementy sterujące: jeden na ćwiczenie ---

const next = (label: string): ControlSpec => ({ type: 'next', label });
/** Przełącznik maski: pozycja nr i = krok nr i. */
const MASK_TOGGLE: ControlSpec = { type: 'toggle', label: 'Maska', options: ['/24', '/25'] };

// --- M1: porównanie numerów sieci ---

export const COMPARE_ROWS: CompareRow[] = [
 { label: nameOf('laptop'), ip: deviceIpText('laptop') },
 { label: nameOf('nas'), ip: deviceIpText('nas') },
 { label: nameOf('printer'), ip: deviceIpText('printer') },
 { label: 'Adres w Internecie', ip: INTERNET_IP }
];

/** Numer sieci przy masce /24 jako tekst: pierwsze trzy liczby adresu. */
const networkNumber = (ip: string) => firstThreeOctets(parseIp(ip));

// Fragmenty adresów wstawiane do tekstów kroków (jedyne źródło: model sieci).
const NET = ZONES.biuro.net;
const NET_NUMBER = networkNumber(NET);
const INTERNET_NUMBER = networkNumber(INTERNET_IP);

// --- M2: oś adresów – tylko Laptop i Drukarka ---

const fence = (prefix: number): FenceSpec => ({
 type: 'fence',
 src: 'laptop',
 dst: 'printer',
 prefix,
 pins: PINS.filter((p) => p.id === 'laptop' || p.id === 'printer')
});

// --- M3: mała topologia – tylko urządzenia z ćwiczenia ---

const M3_CABLES: Cable[] = [
 cable('laptop', 'right', 'switch', 'left'),
 cable('switch', 'top', 'router', 'bottom'),
 cable('switch', 'right', 'printer', 'left')
];

const M3_POSITIONS = {
 router: { x: 300, y: 0 },
 laptop: { x: 0, y: 210 },
 switch: { x: 300, y: 210 },
 printer: { x: 600, y: 210 }
} satisfies Partial<Record<DeviceId, Device['position']>>;

function m3Devices(prefix: 24 | 25): Device[] {
 const local = prefix === 24;
 const card = (id: keyof typeof M3_POSITIONS): Device => ({
  id,
  kind: device(id).kind,
  label: nameOf(id),
  position: M3_POSITIONS[id]
 });
 return [
  {
   ...card('router'),
   ip: formatIp(ROUTER_IP),
   // Router potrzebuje adresu w sieci Drukarki – pokazujemy go bez komentarza (Lab 2: RoaS).
   note: local ? undefined : `+ ${formatIp(routerIpIn(deviceIp('printer'), 25))} (sieć Drukarki)`
  },
  {
   ...card('laptop'),
   ip: `${deviceIpText('laptop')}/${prefix}`,
   note: local ? 'Myśl: .130 – moja sieć → bezpośrednio' : 'Myśl: .130 – inna sieć → do bramy'
  },
  { ...card('switch'), note: SWITCH_NOTE },
  { ...card('printer'), ip: `${deviceIpText('printer')}/${prefix}` }
 ];
}

function m3State(prefix: 24 | 25): DiagramState {
 // Ta sama decyzja co w Trybie swobodnym – bez tła kart (audyt: trzeci kod wizualny był zbędny).
 const { roles, flows } = maskDiagram({ prefix, target: 'printer', trap: false, phase: 'there' });
 return { roles, flows };
}

// --- M4: Broadcast dociera do wszystkich, bez względu na maskę ---

const M4_NOTES: Partial<Record<DeviceId, string>> = {
 laptop: 'Działka .0–.127',
 nas: 'Na działce Laptopa',
 printer: 'Za płotem',
 camera: 'Za płotem',
 switch: SWITCH_NOTE
};

function m4Devices(): Device[] {
 return devicesFor({ prefix: 25, target: 'nas', trap: false, phase: 'there' }).map((d) => ({
  ...d,
  note: M4_NOTES[d.id as DeviceId]
 }));
}

const M4_QUESTION = `Kto ma ${deviceIpText('nas')}?`;

/** Broadcast z Laptopa: Switch rozsyła kopie na wszystkie pozostałe kable. */
function m4Broadcast(): DiagramState {
 const hops = floodPath<DeviceId>(LINKS, 'laptop', forwardsBroadcast);
 const frame = arpRequest(deviceMac('laptop'), M4_QUESTION);
 return {
  frame,
  roles: floodRoles(hops, 'laptop'),
  flows: hops.map(({ from, to, hop }) => ({
   from,
   to,
   hop,
   label: hop === 0 ? frame.name : 'kopia'
  }))
 };
}

// --- Seria ---

export const EXERCISES: Exercise[] = [
 {
  code: 'M1',
  title: 'Moja sieć czy inna?',
  question: `Laptop ma adres ${deviceCidr('laptop')}. Które adresy są w jego sieci?`,
  steps: [
   {
    text: `Maska /24: pierwsze 24 bity, czyli pierwsze 3 liczby adresu, to numer sieci. Laptop: ${NET_NUMBER}. Serwer NAS: ${NET_NUMBER}. Ten sam numer, więc Serwer NAS jest w sieci Laptopa.`,
    change: 'nowy wiersz: Serwer NAS – ta sama sieć',
    view: { type: 'compare', rows: COMPARE_ROWS, revealed: 1 },
    control: next('Pokaż następny adres →')
   },
   {
    text: `Drukarka ${deviceIpText('printer')}: numer sieci ${NET_NUMBER} – taki sam. Drukarka jest w sieci Laptopa. Laptop wyśle do niej ramkę bezpośrednio, przez Switch.`,
    change: 'nowy wiersz: Drukarka – ta sama sieć',
    view: { type: 'compare', rows: COMPARE_ROWS, revealed: 2 },
    control: next('Pokaż następny adres →')
   },
   {
    text: `Adres ${INTERNET_IP}: numer sieci ${INTERNET_NUMBER} – inny. To inna sieć. Laptop nie wyśle ramki prosto do ${INTERNET_IP}. Jak to zrobi, zobaczysz w M3.`,
    change: `nowy wiersz: ${INTERNET_IP} – inna sieć`,
    view: { type: 'compare', rows: COMPARE_ROWS, revealed: 3 },
    control: next('Pokaż następny adres →')
   }
  ],
  nextQuestion: `Czy płot może stanąć wewnątrz sieci ${NET}?`
 },
 {
  code: 'M2',
  title: 'Płot na ulicy',
  question: 'Przełącz maskę na /25. Czy Drukarka .130 jest w sieci Laptopa?',
  steps: [
   {
    text:
     'Maska /24: jedna sieć .0–.255, bez płotów. Laptop .105 i Drukarka .130 są w tej samej sieci.',
    change: 'brak płotów: jedna działka .0–.255',
    view: fence(24),
    control: MASK_TOGGLE
   },
   {
    text:
     'Maska /25 dzieli adresy .0–.255 na dwie sieci po 128 adresów. Płot stoi na .128. Laptop .105 jest przed płotem, Drukarka .130 za płotem. To dwie różne sieci.',
    change: 'płot wyrasta na .128',
    view: fence(25),
    control: MASK_TOGGLE
   }
  ],
  nextQuestion: 'Ten sam Switch. Jak Laptop wyśle plik do Drukarki?'
 },
 {
  code: 'M3',
  title: 'Objazd przez Router',
  question: 'Maska /25. Którą drogą pójdzie ramka z Laptopa do Drukarki?',
  steps: [
   {
    text:
     'Maska /24: Drukarka .130 jest w sieci Laptopa. Laptop wysyła ramkę bezpośrednio, przez sam Switch. Router (Brama) nie bierze udziału.',
    change: 'droga: Laptop → Switch → Drukarka',
    view: { type: 'diagram', devices: m3Devices(24), cables: M3_CABLES, state: m3State(24) },
    control: MASK_TOGGLE
   },
   {
    text:
     'Laptop liczy swoją maską /25: Drukarka .130 jest w innej sieci. Laptop wysyła więc ramkę do Routera (Brama), a Router przekazuje ją Drukarce. Ten sam Switch i te same kable – inna droga.',
    change: 'droga: Laptop → Switch → Router → Switch → Drukarka',
    view: { type: 'diagram', devices: m3Devices(25), cables: M3_CABLES, state: m3State(25) },
    control: MASK_TOGGLE
   }
  ],
  nextQuestion: 'Czy maska /25 zatrzyma Broadcast przed Drukarką?'
 },
 {
  code: 'M4',
  title: 'Maska to nie ściana',
  question: 'Maska /25. Czy Drukarka .130 dostanie ARP Request od Laptopa?',
  steps: [
   {
    text: `Laptop wysyła ARP Request: „${M4_QUESTION}”. Przy masce /25 Drukarka .130 i Kamera .200 są za płotem. Kliknij i sprawdź, kto dostanie ramkę.`,
    change: 'nic jeszcze nie płynie',
    view: {
     type: 'diagram',
     devices: m4Devices(),
     cables: CABLES,
     state: { roles: {}, flows: [] }
    },
    control: next('Wyślij ARP Request →')
   },
   {
    text:
     'Tak – Drukarka, Kamera i Router też. Switch nie zna masek, czyta tylko adresy MAC. Broadcast dostaje każde urządzenie podłączone do tego Switcha. Maska to reguła nadawcy, nie ściana w kablu.',
    change: 'kopie Broadcastu docierają do wszystkich 4 urządzeń',
    view: { type: 'diagram', devices: m4Devices(), cables: CABLES, state: m4Broadcast() },
    control: next('Wyślij ARP Request →')
   }
  ],
  nextQuestion:
   'Sieci naprawdę rozdziela Router. Co Router zmienia w ramce, gdy przekazuje ją dalej?',
  // Odpowiedź jest na osobnej stronie o routingu (PYT-070a).
  nextLink: { href: 'symulator-routing.html', label: 'Zobacz: List za płot ▶' }
 }
];

/** Kurs bez Trybu swobodnego – tę zakładkę dokłada strona (`pages/maska.tsx`). */
export const MASKA = {
 id: 'maska',
 title: 'Ćwiczenia z maską',
 exercises: EXERCISES
} satisfies Course;
