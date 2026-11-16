// Ramka Ethernet i jej droga po kablach – pojęcia sieciowe wspólne dla wszystkich symulatorów.

/** Adres MAC „do wszystkich”. Ramka z takim odbiorcą to Broadcast. */
export const BROADCAST_MAC = 'FF:FF:FF:FF:FF:FF';

export interface Frame {
 name: string;
 srcMac: string;
 dstMac: string;
 payload: string;
}

export function isBroadcast(frame: Frame | undefined): boolean {
 return frame?.dstMac === BROADCAST_MAC;
}

/** Jeden „skok” ramki po jednym kablu. Skoki o tym samym `hop` lecą jednocześnie. */
export interface Flow {
 from: string;
 to: string;
 hop: number;
 /** Domyślnie: nazwa ramki (`frame.name`). */
 label?: string;
}
