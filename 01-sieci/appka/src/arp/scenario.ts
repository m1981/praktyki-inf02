// Model danych i scenariusz symulacji.
// DLACZEGO OSOBNY PLIK BEZ REACTA: scenariusz to czyste dane. Nowy scenariusz (np. „Ruch do
// Internetu przez Router”) to nowa tablica kroków – bez zmian w komponentach.

import { assertFlowsOnCables } from '../sim/graph';
import {
 BROADCAST_MAC,
 type Cable,
 type Device,
 type DeviceRole,
 type DiagramState,
 type Frame
} from '../sim/types';

export type DeviceId = 'laptop' | 'switch' | 'router' | 'nas';

export interface ArpEntry {
 ip: string;
 mac: string;
}

export interface MacEntry {
 mac: string;
 port: string;
}

export interface Question {
 question: string;
 answer: string;
}

export interface SimulationStep extends DiagramState {
 title: string;
 layer: string;
 description: string;
 roles: Partial<Record<DeviceId, DeviceRole>>;
 /** Wpisy, które pojawiają się w tablicach W TYM kroku. Stan tablic liczymy z kroków 0..N. */
 learns?: { laptopArp?: ArpEntry[]; switchMac?: MacEntry[] };
 questions?: Question[];
}

// --- Stałe sieci (jedno miejsce prawdy dla adresów i portów) ---

const IP = { laptop: '10.10.10.105', nas: '10.10.10.30', router: '10.10.10.1' } as const;
const MAC = {
 laptop: 'AA:BB:CC:00:01:05',
 nas: 'AA:BB:CC:00:00:30',
 router: 'AA:BB:CC:00:00:01'
} as const;
const PORT = { laptop: 'Fa0/1', nas: 'Fa0/2', router: 'Fa0/3' } as const;

// --- Topologia biura SOHO (gwiazda wokół Switcha) ---

export const DEVICES: Device[] = [
 {
  id: 'router',
  kind: 'router',
  label: 'Router (Brama)',
  ip: `${IP.router}/24`,
  mac: MAC.router,
  position: { x: 380, y: 0 }
 },
 {
  id: 'laptop',
  kind: 'laptop',
  label: 'Laptop',
  ip: `${IP.laptop}/24`,
  mac: MAC.laptop,
  position: { x: 0, y: 250 }
 },
 {
  id: 'switch',
  kind: 'switch',
  label: 'Switch',
  // Switch (L2) przełącza ramki po adresach MAC – nie potrzebuje adresu IP.
  note: 'L2: czyta tylko MAC',
  ports: { left: PORT.laptop, right: PORT.nas, top: PORT.router },
  position: { x: 380, y: 250 }
 },
 {
  id: 'nas',
  kind: 'nas',
  label: 'Serwer NAS',
  ip: `${IP.nas}/24`,
  mac: MAC.nas,
  position: { x: 760, y: 250 }
 }
];

export const CABLES: Cable[] = [
 { id: 'laptop-switch', a: 'laptop', aSide: 'right', b: 'switch', bSide: 'left' },
 { id: 'switch-router', a: 'switch', aSide: 'top', b: 'router', bSide: 'bottom' },
 { id: 'switch-nas', a: 'switch', aSide: 'right', b: 'nas', bSide: 'left' }
];

/** Nazwa urządzenia dla adresu MAC – do podpisów w tabelach. */
export function macOwner(mac: string): string | undefined {
 if (mac === BROADCAST_MAC) return 'Broadcast – do wszystkich';
 return DEVICES.find((d) => d.mac === mac)?.label;
}

// --- Ramki użyte w scenariuszu ---

const ARP_REQUEST: Frame = {
 name: 'ARP Request',
 srcMac: MAC.laptop,
 dstMac: BROADCAST_MAC,
 payload: `Kto ma ${IP.nas}? Odpowiedz do ${IP.laptop}`
};

const ARP_REPLY: Frame = {
 name: 'ARP Reply',
 srcMac: MAC.nas,
 dstMac: MAC.laptop,
 payload: `${IP.nas} ma adres MAC ${MAC.nas}`
};

const DATA: Frame = {
 name: 'Dane (pakiet IP)',
 srcMac: MAC.laptop,
 dstMac: MAC.nas,
 payload: `Pakiet IP: ${IP.laptop} → ${IP.nas}, w środku fragment pliku`
};

// --- Scenariusz: komunikacja w jednej sieci LAN (ARP + Unicast) ---

export const SIMULATION_STEPS: SimulationStep[] = [
 {
  title: 'Start: Laptop chce zapisać plik na Serwerze NAS',
  layer: 'Brak ruchu',
  description: `Sieć LAN 10.10.10.0/24 jest w spoczynku. Laptop (${IP.laptop}) chce wysłać plik do Serwera NAS (${IP.nas}). Laptop zna adres IP Serwera NAS, ale nie zna jego adresu MAC. Tablica ARP Laptopa i tablica MAC Switcha są puste.`,
  roles: {},
  flows: []
 },
 {
  title: 'Krok 1: Decyzja – ta sama sieć czy inna?',
  layer: 'L3 (Sieć) – decyzja',
  description: `Laptop nakłada maskę /24 na oba adresy. Swój adres ${IP.laptop} → sieć 10.10.10.0. Adres Serwera NAS ${IP.nas} → sieć 10.10.10.0. Sieci są takie same, więc Laptop wyśle dane bezpośrednio do Serwera NAS, bez Routera. Do zbudowania ramki potrzebuje adresu MAC Serwera NAS. Laptop sprawdza swoją tablicę ARP: nie ma w niej adresu ${IP.nas}.`,
  roles: { laptop: 'analyzes' },
  flows: []
 },
 {
  title: 'Krok 2: ARP Request – Laptop pyta wszystkich',
  layer: 'L2 (Łącze danych) – Broadcast',
  description: `Laptop wysyła ramkę ARP Request z pytaniem: „Kto ma ${IP.nas}?”. Laptop nie zna adresu MAC odbiorcy, dlatego wpisuje adres Broadcast ${BROADCAST_MAC} (do wszystkich). Switch odbiera ramkę na porcie ${PORT.laptop} i zapisuje w tablicy MAC: adres MAC Laptopa jest za portem ${PORT.laptop}.`,
  roles: { laptop: 'sends', switch: 'receives' },
  frame: ARP_REQUEST,
  flows: [{ from: 'laptop', to: 'switch', hop: 0 }],
  learns: { switchMac: [{ mac: MAC.laptop, port: PORT.laptop }] }
 },
 {
  title: 'Krok 3: Switch rozsyła ramkę na wszystkie porty',
  layer: 'L2 (Łącze danych) – Broadcast',
  description: `Adres MAC odbiorcy to Broadcast, więc Switch wysyła kopię ramki na wszystkie porty oprócz ${PORT.laptop} (stamtąd ramka przyszła). Switch nie zmienia ramki. Router dostaje kopię na porcie ${PORT.router}: ${IP.nas} to nie jego adres, więc Router odrzuca ramkę. Serwer NAS dostaje kopię na porcie ${PORT.nas}: rozpoznaje swój adres i zapisuje adres MAC Laptopa w swojej tablicy ARP.`,
  roles: { switch: 'forwards', router: 'drops', nas: 'receives' },
  frame: ARP_REQUEST,
  flows: [
   { from: 'switch', to: 'router', hop: 0, label: 'ARP Request (kopia)' },
   { from: 'switch', to: 'nas', hop: 0, label: 'ARP Request (kopia)' }
  ]
 },
 {
  title: 'Krok 4: ARP Reply – Serwer NAS odpowiada tylko Laptopowi',
  layer: 'L2 (Łącze danych) – Unicast',
  description: `Serwer NAS wysyła ramkę ARP Reply: „${IP.nas} to ja, mój MAC to ${MAC.nas}”. Serwer NAS zna już adres MAC Laptopa, więc wysyła ramkę tylko do niego (Unicast). Switch zapisuje w tablicy MAC: adres MAC Serwera NAS jest za portem ${PORT.nas}. Adres MAC Laptopa Switch ma już w tablicy (${PORT.laptop}), więc wysyła ramkę tylko na ten port. Router nie dostaje tej ramki. Laptop zapisuje odpowiedź w swojej tablicy ARP.`,
  roles: { nas: 'sends', switch: 'forwards', laptop: 'receives' },
  frame: ARP_REPLY,
  flows: [
   { from: 'nas', to: 'switch', hop: 0 },
   { from: 'switch', to: 'laptop', hop: 1 }
  ],
  learns: {
   switchMac: [{ mac: MAC.nas, port: PORT.nas }],
   laptopArp: [{ ip: IP.nas, mac: MAC.nas }]
  }
 },
 {
  title: 'Krok 5: Wysłanie danych (Unicast)',
  layer: 'L3 + L2 – pakiet IP w ramce Ethernet',
  description: `Laptop zna już adres IP i adres MAC Serwera NAS. Wkłada pakiet IP z danymi do ramki Ethernet z adresem MAC odbiorcy ${MAC.nas}. Switch sprawdza tablicę MAC: adres Serwera NAS jest za portem ${PORT.nas}, więc wysyła ramkę tylko na ten port. Router nie bierze udziału w tej wymianie.`,
  roles: { laptop: 'sends', switch: 'forwards', nas: 'receives' },
  frame: DATA,
  flows: [
   { from: 'laptop', to: 'switch', hop: 0 },
   { from: 'switch', to: 'nas', hop: 1 }
  ],
  questions: [
   {
    question:
     'Minutę później Laptop wysyła drugi plik do Serwera NAS. Czy znowu wyśle ARP Request?',
    answer: `Nie. Adres MAC Serwera NAS jest już w tablicy ARP Laptopa, więc Laptop od razu wysyła ramkę z danymi (Krok 5). Wpis w tablicy ARP wygasa po kilku minutach – dopiero wtedy Laptop znowu zapyta przez ARP.`
   },
   {
    question: 'Laptop wysyła dane do adresu 8.8.8.8. O czyj adres MAC zapyta przez ARP?',
    answer: `O adres MAC Routera (${IP.router}). Adres 8.8.8.8 jest poza siecią 10.10.10.0/24, więc Laptop wysyła dane przez bramę domyślną. ARP działa tylko w sieci lokalnej – Laptop nigdy nie pyta o MAC urządzenia z innej sieci.`
   }
  ]
 }
];

/**
 * Sprawdza spójność scenariusza: każdy skok musi iść po istniejącym kablu,
 * a krok z ruchem musi mieć ramkę. Wywoływane w trybie deweloperskim.
 */
export function assertScenario(steps: SimulationStep[]): void {
 steps.forEach((step, i) => {
  if (step.flows.length > 0 && !step.frame) {
   throw new Error(`Krok ${i}: są przepływy, ale brak ramki (frame).`);
  }
  assertFlowsOnCables(CABLES, step.flows, `Krok ${i}`);
 });
}

export interface TableRow<T> {
 entry: T;
 isNew: boolean;
}

/** Stan tablic ARP (Laptop) i MAC (Switch) po wykonaniu kroków 0..stepIndex. */
export function tablesAt(steps: SimulationStep[], stepIndex: number) {
 const arp: TableRow<ArpEntry>[] = [];
 const mac: TableRow<MacEntry>[] = [];
 steps.slice(0, stepIndex + 1).forEach((step, i) => {
  const isNew = i === stepIndex;
  step.learns?.laptopArp?.forEach((entry) => arp.push({ entry, isNew }));
  step.learns?.switchMac?.forEach((entry) => mac.push({ entry, isNew }));
 });
 return { arp, mac };
}
