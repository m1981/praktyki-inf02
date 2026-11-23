// Sieć z arkusza egzaminacyjnego INF.02, styczeń 2025 (egzaminy/inf02-2025-styczen-…-praktyczny.pdf),
// układ „serwer w środku”. Jedyne miejsce z adresami tej sieci – strona „Arkusz krok po kroku”
// (scenariusz-arkusz-1-2.md, PYT-074a).
// DLACZEGO OSOBNO OD `siec.ts`: to inna sieć (z arkusza, nie „przykładowe biuro”), a nazwy urządzeń
// są tu takie jak w arkuszu („Ruter”, „Przełącznik”), nie ze Słownika pojęć (PYT-074a).
// Maszyna wirtualna z kartą „LAN 3” jest w arkuszu, ale etapy 1–2 ją pomijają (scenariusz).

export type SheetDevice = 'ruter' | 'serwer' | 'przelacznik' | 'stacja';

/** Karta sieciowa albo urządzenie z jednym adresem (Przełącznik). */
export type SheetCard =
 | 'ruter-wan'
 | 'ruter-lan'
 | 'serwer-wan'
 | 'serwer-lan1'
 | 'przelacznik'
 | 'stacja-lan2';

/** Sieci na schemacie, nazwane kolorem (pomarańczowy znaczy u nas tylko Broadcast – nie używamy). */
export type SheetNet = 'fioletowa' | 'zielona' | 'niebieska';

interface Name {
 nom: string;
 gen: string;
}

/** Nazwy urządzeń jak w arkuszu (PYT-074a). Słownik pojęć innych stron (`glossary.ts`) bez zmian. */
export const SHEET_NAMES: Record<SheetDevice, Name> = {
 ruter: { nom: 'Ruter', gen: 'Rutera' },
 serwer: { nom: 'Serwer', gen: 'Serwera' },
 przelacznik: { nom: 'Przełącznik', gen: 'Przełącznika' },
 stacja: { nom: 'Stacja robocza', gen: 'Stacji roboczej' }
};

interface CardData {
 device: SheetDevice;
 /** Nazwa interfejsu albo połączenia z arkusza („WAN”, „LAN 1”); pusta przy Przełączniku. */
 label: string;
 net: SheetNet;
 /** Adres IP z maską, np. „192.168.1.3/25”. */
 cidr?: string;
 /** Brama domyślna; `null` – arkusz każe wpisać „brak”. */
 gateway?: string | null;
 dns?: string;
 /** „Adres IP oraz pozostałe parametry: uzyskiwane automatycznie”. */
 auto?: boolean;
}

export const SHEET_CARDS: Record<SheetCard, CardData> = {
 'ruter-wan': {
  device: 'ruter',
  label: 'WAN',
  net: 'fioletowa',
  cidr: '90.0.0.3/28',
  gateway: '90.0.0.2'
 },
 'ruter-lan': { device: 'ruter', label: 'LAN', net: 'zielona', cidr: '10.10.0.1/24' },
 'serwer-wan': { device: 'serwer', label: 'WAN', net: 'zielona', auto: true },
 'serwer-lan1': {
  device: 'serwer',
  label: 'LAN 1',
  net: 'niebieska',
  cidr: '192.168.1.1/25',
  gateway: null,
  dns: '192.168.1.1'
 },
 przelacznik: {
  device: 'przelacznik',
  label: '',
  net: 'niebieska',
  cidr: '192.168.1.2/25',
  gateway: '192.168.1.1'
 },
 'stacja-lan2': {
  device: 'stacja',
  label: 'LAN 2',
  net: 'niebieska',
  cidr: '192.168.1.3/25',
  gateway: '192.168.1.1',
  dns: '192.168.1.1'
 }
};

/** Maszyna wirtualna z kartą „LAN 3” – jest w arkuszu, ale nie na schemacie (tylko w notatce). */
export const SHEET_VM_LAN3 = '192.168.1.4/25';

/** Serwer DHCP na ruterze (zakres, DNS dla klientów, rezerwacja dla karty „WAN” serwera). */
export const SHEET_DHCP = {
 from: '10.10.0.2',
 to: '10.10.0.20',
 dns: '10.10.0.20',
 reserved: '10.10.0.20'
} as const;

/**
 * PRZYKŁAD, nie dane z arkusza (warstwa 3): adres, który serwer dostaje z zakresu przed rezerwacją,
 * i adresy MAC kart serwera. Na ekranie oznaczone jako przykład.
 */
export const SHEET_EXAMPLE = {
 leased: '10.10.0.7',
 macWan: '00-1A-2B-3C-4D-01',
 macLan1: '00-1A-2B-3C-4D-02'
} as const;

export const SHEET_CARD_IDS = Object.keys(SHEET_CARDS) as SheetCard[];

/** Adres IP karty bez maski, np. „192.168.1.3”. */
export function sheetIp(card: SheetCard): string {
 const { cidr } = SHEET_CARDS[card];
 if (!cidr) throw new Error(`Karta „${card}” nie ma w arkuszu stałego adresu IP.`);
 return cidr.split('/')[0];
}

/** Brama domyślna karty z arkusza. */
export function sheetGateway(card: SheetCard): string {
 const { gateway } = SHEET_CARDS[card];
 if (!gateway) throw new Error(`Karta „${card}” nie ma w arkuszu bramy domyślnej.`);
 return gateway;
}

/** Karta, która ma podany adres IP (np. brama Przełącznika → karta „LAN 1” Serwera). */
export function cardWithIp(ip: string): SheetCard | undefined {
 return SHEET_CARD_IDS.find((c) => SHEET_CARDS[c].cidr?.split('/')[0] === ip);
}
