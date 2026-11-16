// Protokół ARP: ramki pytania i odpowiedzi oraz tablice, które urządzenia z nich budują.

import { BROADCAST_MAC, type Frame } from './frame';

/** Pytanie ARP: nadawca nie zna MAC odbiorcy, więc wysyła ramkę do wszystkich (Broadcast). */
export function arpRequest(srcMac: string, payload: string): Frame {
 return { name: 'ARP Request', srcMac, dstMac: BROADCAST_MAC, payload };
}

/** Odpowiedź ARP: MAC pytającego jest znany z pytania, więc ramka idzie tylko do niego (Unicast). */
export function arpReply(srcMac: string, dstMac: string, payload: string): Frame {
 return { name: 'ARP Reply', srcMac, dstMac, payload };
}

/** Wpis tablicy ARP (komputer): adres IP → adres MAC. */
export interface ArpEntry {
 ip: string;
 mac: string;
}

/** Wpis tablicy MAC (Switch): adres MAC → port. */
export interface MacEntry {
 mac: string;
 port: string;
}

/** Wpisy, które pojawiają się w tablicach w jednym kroku. */
export interface Learns {
 laptopArp?: ArpEntry[];
 switchMac?: MacEntry[];
}

export interface TableRow<T> {
 entry: T;
 isNew: boolean;
}

/** Stan tablic ARP (Laptop) i MAC (Switch) po wykonaniu kroków 0..stepIndex. */
export function tablesAt(steps: readonly { learns?: Learns }[], stepIndex: number) {
 const arp: TableRow<ArpEntry>[] = [];
 const mac: TableRow<MacEntry>[] = [];
 steps.slice(0, stepIndex + 1).forEach((step, i) => {
  const isNew = i === stepIndex;
  step.learns?.laptopArp?.forEach((entry) => arp.push({ entry, isNew }));
  step.learns?.switchMac?.forEach((entry) => mac.push({ entry, isNew }));
 });
 return { arp, mac };
}
