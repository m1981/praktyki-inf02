// Scenariusz symulacji ARP: układ diagramu, ramki i kroki.
// DLACZEGO OSOBNY PLIK BEZ REACTA: scenariusz to czyste dane. Nowy scenariusz (np. „Ruch do
// Internetu przez Router”) to nowa tablica kroków – bez zmian w komponentach.

import {
 device,
 deviceByMac,
 deviceCidr,
 deviceIpText,
 deviceMac,
 INTERNET_IP,
 switchPort,
 zoneCidr,
 type DeviceId as ModelDeviceId
} from '../model/siec';
import { GLOSSARY, nameOf } from '../model/glossary';
import { arpReply, arpRequest, type Learns } from '../net/arp';
import { BROADCAST_MAC, type Frame } from '../net/frame';
import { assertFlowsOnCables, cable } from '../sim/graph';
import type { Cable, Device, DeviceRole, DiagramState } from '../sim/types';

export type DeviceId = Extract<ModelDeviceId, 'laptop' | 'switch' | 'router' | 'nas'>;

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
 learns?: Learns;
 questions?: Question[];
}

// --- Adresy i porty: skróty do modelu sieci (jedyne źródło prawdy: model/siec.ts) ---

const IP = {
 laptop: deviceIpText('laptop'),
 nas: deviceIpText('nas'),
 router: deviceIpText('router')
};
const MAC = { laptop: deviceMac('laptop'), nas: deviceMac('nas'), router: deviceMac('router') };
const PORT = { laptop: switchPort('laptop'), nas: switchPort('nas'), router: switchPort('router') };
const NET = zoneCidr('biuro');

// --- Układ diagramu: biuro SOHO, gwiazda wokół Switcha ---

/** Karta urządzenia z adresem IP i MAC z modelu. */
function card(id: DeviceId, position: Device['position']): Device {
 return {
  id,
  kind: device(id).kind,
  label: nameOf(id),
  ip: deviceCidr(id),
  mac: deviceMac(id),
  position
 };
}

export const DEVICES: Device[] = [
 card('router', { x: 380, y: 0 }),
 card('laptop', { x: 0, y: 250 }),
 {
  id: 'switch',
  kind: 'switch',
  label: nameOf('switch'),
  // Switch (L2) przełącza ramki po adresach MAC – nie potrzebuje adresu IP.
  note: 'L2: czyta tylko MAC',
  ports: { left: PORT.laptop, right: PORT.nas, top: PORT.router },
  position: { x: 380, y: 250 }
 },
 card('nas', { x: 760, y: 250 })
];

export const CABLES: Cable[] = [
 cable('laptop', 'right', 'switch', 'left'),
 cable('switch', 'top', 'router', 'bottom'),
 cable('switch', 'right', 'nas', 'left')
];

/** Nazwa urządzenia dla adresu MAC – do podpisów w tabelach. */
export function macOwner(mac: string): string | undefined {
 if (mac === BROADCAST_MAC) return 'Broadcast – do wszystkich';
 const owner = deviceByMac(mac);
 return owner && GLOSSARY[owner.kind].nom;
}

// --- Ramki użyte w scenariuszu ---

const ARP_REQUEST = arpRequest(MAC.laptop, `Kto ma ${IP.nas}? Odpowiedz do ${IP.laptop}`);

const ARP_REPLY = arpReply(MAC.nas, MAC.laptop, `${IP.nas} ma adres MAC ${MAC.nas}`);

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
  description: `Laptop (${IP.laptop}) chce wysłać plik do Serwera NAS (${IP.nas}). Zna jego adres IP, ale nie zna adresu MAC. Tablica ARP Laptopa i tablica MAC Switcha są puste.`,
  roles: {},
  flows: []
 },
 {
  title: 'Krok 1: Ta sama sieć – bez Routera',
  layer: 'L3 (Sieć) – decyzja',
  description: `Laptop i Serwer NAS mają ten sam numer sieci: ${NET}. Laptop wyśle dane bezpośrednio, bez Routera. Do ramki potrzebuje adresu MAC Serwera NAS, a jego tablica ARP jest pusta.`,
  roles: { laptop: 'analyzes' },
  flows: []
 },
 {
  title: 'Krok 2: ARP Request – Laptop pyta wszystkich',
  layer: 'L2 (Łącze danych) – Broadcast',
  description: `Laptop wysyła ramkę ARP Request: „Kto ma ${IP.nas}?”. Nie zna MAC odbiorcy, więc wpisuje adres Broadcast ${BROADCAST_MAC} – ramka do wszystkich. Switch zapisuje w tablicy MAC: Laptop jest za portem ${PORT.laptop}.`,
  roles: { laptop: 'sends', switch: 'receives' },
  frame: ARP_REQUEST,
  flows: [{ from: 'laptop', to: 'switch', hop: 0 }],
  learns: { switchMac: [{ mac: MAC.laptop, port: PORT.laptop }] }
 },
 {
  title: 'Krok 3: Switch rozsyła kopie na wszystkie porty',
  layer: 'L2 (Łącze danych) – Broadcast',
  description: `Adres odbiorcy to Broadcast, więc Switch wysyła kopię ramki na wszystkie porty oprócz ${PORT.laptop}. Router odrzuca kopię: ${IP.nas} to nie jego adres. Serwer NAS rozpoznaje swój adres.`,
  roles: { switch: 'forwards', router: 'drops', nas: 'receives' },
  frame: ARP_REQUEST,
  flows: [
   { from: 'switch', to: 'router', hop: 0, label: 'ARP Request (kopia)' },
   { from: 'switch', to: 'nas', hop: 0, label: 'ARP Request (kopia)' }
  ]
 },
 {
  title: 'Krok 4: ARP Reply – Serwer NAS odpowiada',
  layer: 'L2 (Łącze danych) – Unicast',
  description: `Serwer NAS wysyła ARP Reply: „Mój MAC to ${MAC.nas}”. MAC Laptopa zna z pytania, więc odpowiada tylko jemu – to Unicast. Switch zapisuje w tablicy MAC: Serwer NAS jest za portem ${PORT.nas}.`,
  roles: { nas: 'sends', switch: 'receives' },
  frame: ARP_REPLY,
  flows: [{ from: 'nas', to: 'switch', hop: 0 }],
  learns: { switchMac: [{ mac: MAC.nas, port: PORT.nas }] }
 },
 {
  title: 'Krok 5: Switch wysyła odpowiedź tylko do Laptopa',
  layer: 'L2 (Łącze danych) – Unicast',
  description: `Switch ma MAC Laptopa w tablicy (${PORT.laptop}), więc wysyła ramkę tylko na ten port. Router jej nie dostaje. Laptop zapisuje w tablicy ARP: ${IP.nas} → ${MAC.nas}.`,
  roles: { switch: 'forwards', laptop: 'receives' },
  frame: ARP_REPLY,
  flows: [{ from: 'switch', to: 'laptop', hop: 0 }],
  learns: { laptopArp: [{ ip: IP.nas, mac: MAC.nas }] }
 },
 {
  title: 'Krok 6: Wysłanie danych (Unicast)',
  layer: 'L3 + L2 – pakiet IP w ramce Ethernet',
  description: `Laptop wkłada pakiet IP z plikiem do ramki z MAC odbiorcy ${MAC.nas}. Switch sprawdza tablicę MAC i wysyła ramkę tylko na port ${PORT.nas}. Router nie bierze udziału.`,
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
    answer: `Nie. Adres MAC Serwera NAS jest już w tablicy ARP Laptopa, więc Laptop od razu wysyła ramkę z danymi (Krok 6). Wpis w tablicy ARP wygasa po kilku minutach – dopiero wtedy Laptop znowu zapyta przez ARP.`
   },
   {
    question: `Laptop wysyła dane do adresu ${INTERNET_IP}. O czyj adres MAC zapyta przez ARP?`,
    answer: `O adres MAC Routera (${IP.router}). Adres ${INTERNET_IP} jest poza siecią ${NET}, więc Laptop wysyła dane przez bramę domyślną. ARP działa tylko w sieci lokalnej – Laptop nigdy nie pyta o MAC urządzenia z innej sieci.`
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
