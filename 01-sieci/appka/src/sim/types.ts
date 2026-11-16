// Wspólne typy wszystkich symulatorów. Diagram nie wie nic o ARP ani o maskach –
// dostaje tylko urządzenia, kable i `DiagramState` (kto co robi, jakie ramki płyną).

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type DeviceKind = 'laptop' | 'switch' | 'router' | 'nas' | 'printer' | 'camera';

/** Co urządzenie robi w danej chwili (etykieta pod kartą urządzenia). */
export type DeviceRole = 'analyzes' | 'sends' | 'receives' | 'forwards' | 'drops' | 'blocked';

/** Tło karty: urządzenie w sieci nadawcy (`inside`) albo poza nią (`outside`). */
export type DeviceTone = 'inside' | 'outside';

export const BROADCAST_MAC = 'FF:FF:FF:FF:FF:FF';

export interface Device {
 id: string;
 kind: DeviceKind;
 label: string;
 ip?: string;
 mac?: string;
 /** Stopka karty (np. brama albo uwaga o Switchu). */
 note?: string;
 /** Nazwy portów widoczne na karcie (tylko Switch). */
 ports?: Partial<Record<Side, string>>;
 position: { x: number; y: number };
}

/** Fizyczny kabel. Kierunek a → b nie ma znaczenia dla ruchu – liczy się `Flow.from`. */
export interface Cable {
 id: string;
 a: string;
 aSide: Side;
 b: string;
 bSide: Side;
}

export interface Frame {
 name: string;
 srcMac: string;
 dstMac: string;
 payload: string;
}

/** Jeden „skok” ramki po jednym kablu. Skoki o tym samym `hop` lecą jednocześnie. */
export interface Flow {
 from: string;
 to: string;
 hop: number;
 /** Domyślnie: nazwa ramki (`frame.name`). */
 label?: string;
}

export interface DiagramState {
 roles: Partial<Record<string, DeviceRole>>;
 flows: Flow[];
 /** Broadcast/Unicast wynika z `frame.dstMac`. Bez ramki = Unicast. */
 frame?: Frame;
 tones?: Partial<Record<string, DeviceTone>>;
}
