// Układ ekranu ćwiczeń z maską: gdzie stoją karty urządzeń, którymi bokami łączą je kable, co jest
// napisane na kartach i na ramkach. Wspólne dla serii M1–M4 i Trybu swobodnego.
// Decyzję nadawcy i drogę ramki liczy `net/mask.ts` – tu tylko ją opisujemy i rozmieszczamy.

import { formatIp } from '../lib/ipv4';
import { genitiveOf, nameOf } from '../model/glossary';
import { device, deviceIp, type DeviceId } from '../model/siec';
import {
 GATEWAY,
 gatewayOf,
 MASK_HOSTS,
 maskRoute,
 prefixOf,
 ROUTER_IP,
 type MaskSettings
} from '../net/mask';
import { cable } from '../ui/diagram/graph';
import type { Cable, Device, DiagramState } from '../ui/diagram/types';
import type { Pin } from '../ui/views/FenceLine';

// Router u góry, Switch pośrodku, urządzenia w rzędzie na dole.
const POSITIONS: Record<DeviceId, { x: number; y: number }> = {
 router: { x: 300, y: 0 },
 switch: { x: 300, y: 230 },
 laptop: { x: 0, y: 230 },
 nas: { x: 0, y: 480 },
 printer: { x: 260, y: 480 },
 camera: { x: 520, y: 480 }
};

/** Jedna gwiazda wokół Switcha. Kable są w modelu sieci – tu wybieramy tylko boki kart. */
export const CABLES: Cable[] = [
 cable('laptop', 'right', 'switch', 'left'),
 cable('switch', 'top', 'router', 'bottom'),
 cable('switch', 'bottom', 'nas', 'top'),
 cable('switch', 'bottom', 'printer', 'top'),
 cable('switch', 'bottom', 'camera', 'top')
];

/** Stopka karty Switcha w widokach maski. */
export const SWITCH_NOTE = 'Nie zna masek – czyta MAC';

/** Urządzenia na osi adresów; etykiety na zmianę nad i pod osią. */
export const PINS: Pin[] = [
 { id: 'router', row: 'above' },
 { id: 'nas', row: 'below' },
 { id: 'laptop', row: 'above' },
 { id: 'printer', row: 'below' },
 { id: 'camera', row: 'above' }
];

/** Karty urządzeń z adresami i bramami dla bieżących ustawień. */
export function devicesFor(s: MaskSettings): Device[] {
 const hosts = MASK_HOSTS.map((id) => {
  const prefix = prefixOf(id, s);
  return {
   id,
   kind: device(id).kind,
   label: nameOf(id),
   ip: `${formatIp(deviceIp(id))}/${prefix}`,
   note: `Brama: ${formatIp(gatewayOf(id, prefix))}`,
   position: POSITIONS[id]
  };
 });
 return [
  {
   id: GATEWAY,
   kind: device(GATEWAY).kind,
   label: nameOf(GATEWAY),
   ip: formatIp(ROUTER_IP),
   // Uproszczenie: Router ma adres w każdej podsieci (jak Router-on-a-Stick w Lab 2).
   note: '+ adres w każdej podsieci',
   position: POSITIONS[GATEWAY]
  },
  {
   id: 'switch',
   kind: device('switch').kind,
   label: nameOf('switch'),
   note: SWITCH_NOTE,
   position: POSITIONS.switch
  },
  ...hosts
 ];
}

/** Stan diagramu dla ustawień: droga ramki z podpisem, do kogo jest adresowana („do Drukarki”). */
export function maskDiagram(s: MaskSettings): DiagramState {
 const { roles, hops, tones } = maskRoute(s);
 const flows = hops.map(({ from, to, hop, toward }) => ({
  from,
  to,
  hop,
  label: `do ${genitiveOf(toward)}`
 }));
 return { roles, flows, tones };
}
