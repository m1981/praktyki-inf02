// CO JEST w sieci – jedyne miejsce z adresami IP, adresami MAC, portami i kablami.
// Na razie to „przykładowe biuro” 10.10.10.0/24 ze starych symulatorów. Krok 6 migracji
// (architektura.md, rozdz. 3) podmieni TE dane na plan firmy ZS1 – i tylko te dane.
// DLACZEGO BEZ POZYCJI NA EKRANIE: gdzie stoi karta urządzenia, to sprawa widoku, nie sieci.
// Ten sam Laptop jest rysowany w innym miejscu w ARP, w M3 i w Trybie swobodnym.

import { formatIp, parseIp, type Ip } from '../lib/ipv4';

export type DeviceKind = 'laptop' | 'switch' | 'router' | 'nas' | 'printer' | 'camera' | 'server';
export type DeviceId =
 | 'router'
 | 'switch'
 | 'laptop'
 | 'nas'
 | 'printer'
 | 'camera'
 | 'switch2'
 | 'www';
export type ZoneId = 'biuro' | 'serwery';

interface Zone {
 /** Adres sieci strefy. */
 net: string;
 prefix: number;
}

interface ModelDevice {
 id: DeviceId;
 kind: DeviceKind;
 zone: ZoneId;
 /** Numer hosta w sieci strefy: adres = adres sieci + host. Switch (L2) nie ma adresu IP. */
 host?: number;
 mac?: string;
}

interface Link {
 a: DeviceId;
 b: DeviceId;
 /** Nazwa portu po stronie urządzenia `a`. Kabel ma dwa końce, więc port może być po obu stronach. */
 portA?: string;
 /** Nazwa portu po stronie urządzenia `b`. */
 portB?: string;
}

export const ZONES: Record<ZoneId, Zone> = {
 biuro: { net: '10.10.10.0', prefix: 24 },
 // Druga sieć, za Routerem – potrzebna w scenach o routingu (PYT-056a).
 serwery: { net: '10.10.20.0', prefix: 24 }
};

export const DEVICES: readonly ModelDevice[] = [
 { id: 'router', kind: 'router', zone: 'biuro', host: 1, mac: 'AA:BB:CC:00:00:01' },
 { id: 'switch', kind: 'switch', zone: 'biuro' },
 { id: 'laptop', kind: 'laptop', zone: 'biuro', host: 105, mac: 'AA:BB:CC:00:01:05' },
 { id: 'nas', kind: 'nas', zone: 'biuro', host: 30, mac: 'AA:BB:CC:00:00:30' },
 { id: 'printer', kind: 'printer', zone: 'biuro', host: 130 },
 { id: 'camera', kind: 'camera', zone: 'biuro', host: 200 },
 { id: 'switch2', kind: 'switch', zone: 'serwery' },
 { id: 'www', kind: 'server', zone: 'serwery', host: 50, mac: 'AA:BB:CC:00:20:50' }
];

/** Fizyczne kable: gwiazda wokół Switcha. */
export const LINKS: readonly Link[] = [
 { a: 'laptop', b: 'switch', portB: 'Fa0/1' },
 { a: 'router', b: 'switch', portB: 'Fa0/3' },
 { a: 'nas', b: 'switch', portB: 'Fa0/2' },
 { a: 'printer', b: 'switch' },
 { a: 'camera', b: 'switch' },
 // Druga sieć: Router ma w niej drugi port, za nim osobny Switch i Serwer WWW.
 { a: 'router', b: 'switch2' },
 { a: 'www', b: 'switch2' }
];

/** Adres spoza firmy używany w przykładach „inna sieć” (publiczny serwer DNS). */
export const INTERNET_IP = '8.8.8.8';

// --- Selektory: jedyny sposób odczytu danych ---

export function device(id: DeviceId): ModelDevice {
 const found = DEVICES.find((d) => d.id === id);
 if (!found) throw new Error(`Brak urządzenia „${id}” w modelu sieci.`);
 return found;
}

export function zoneOf(id: DeviceId): Zone {
 return ZONES[device(id).zone];
}

/** Adres IP jako liczba (do obliczeń). */
export function deviceIp(id: DeviceId): Ip {
 const { host } = device(id);
 if (host === undefined) throw new Error(`Urządzenie „${id}” nie ma adresu IP.`);
 return parseIp(zoneOf(id).net) + host;
}

/** Adres IP jako tekst, np. „10.10.10.105”. */
export function deviceIpText(id: DeviceId): string {
 return formatIp(deviceIp(id));
}

/** Adres IP z maską strefy, np. „10.10.10.105/24”. */
export function deviceCidr(id: DeviceId): string {
 return `${deviceIpText(id)}/${zoneOf(id).prefix}`;
}

/** Adres sieci strefy z maską, np. „10.10.10.0/24”. */
export function zoneCidr(zone: ZoneId): string {
 return `${ZONES[zone].net}/${ZONES[zone].prefix}`;
}

export function deviceMac(id: DeviceId): string {
 const { mac } = device(id);
 if (!mac) throw new Error(`Urządzenie „${id}” nie ma adresu MAC w modelu sieci.`);
 return mac;
}

/**
 * Port urządzenia `of`, do którego wpięty jest kabel prowadzący do `peer`.
 * Przykład: `portOf('switch', 'laptop')` → „Fa0/1” (port Switcha, za którym jest Laptop).
 */
export function portOf(of: DeviceId, peer: DeviceId): string {
 const link = LINKS.find((l) => (l.a === of && l.b === peer) || (l.b === of && l.a === peer));
 const port = link && (link.a === of ? link.portA : link.portB);
 if (!port) throw new Error(`W modelu sieci „${of}” nie ma portu z kablem do „${peer}”.`);
 return port;
}

/**
 * Czy urządzenie rozsyła Broadcast dalej. Robi to tylko Switch (warstwa 2). Router i urządzenia
 * końcowe odbierają ramkę Broadcast, ale nie przekazują jej na inne kable – dlatego Broadcast nie
 * wychodzi poza jedną sieć.
 */
export function forwardsBroadcast(id: DeviceId): boolean {
 return device(id).kind === 'switch';
}

export function deviceByMac(mac: string): ModelDevice | undefined {
 return DEVICES.find((d) => d.mac === mac);
}

export function hasLink(a: string, b: string): boolean {
 return LINKS.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a));
}
