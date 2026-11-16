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

/**
 * Czego jedno urządzenie uczy się w jednym kroku: komputer dopisuje wpisy do tablicy ARP,
 * Switch – do tablicy MAC. Każde urządzenie ma własne tablice.
 */
export type Learn = { device: string; arp: ArpEntry[] } | { device: string; mac: MacEntry[] };

export interface TableRow<T> {
 entry: T;
 /** Wpis pojawił się w bieżącym kroku. */
 isNew: boolean;
}

interface LearningStep {
 learns?: readonly Learn[];
}

function rowsAt<T>(
 steps: readonly LearningStep[],
 stepIndex: number,
 pick: (learn: Learn) => T[]
): TableRow<T>[] {
 return steps
  .slice(0, stepIndex + 1)
  .flatMap((step, i) =>
   (step.learns ?? []).flatMap(pick).map((entry) => ({ entry, isNew: i === stepIndex }))
  );
}

/** Tablica ARP urządzenia po wykonaniu kroków 0..stepIndex. */
export function arpTableAt(
 steps: readonly LearningStep[],
 stepIndex: number,
 device: string
): TableRow<ArpEntry>[] {
 return rowsAt(steps, stepIndex, (l) => (l.device === device && 'arp' in l ? l.arp : []));
}

/** Tablica MAC Switcha po wykonaniu kroków 0..stepIndex. */
export function macTableAt(
 steps: readonly LearningStep[],
 stepIndex: number,
 device: string
): TableRow<MacEntry>[] {
 return rowsAt(steps, stepIndex, (l) => (l.device === device && 'mac' in l ? l.mac : []));
}
