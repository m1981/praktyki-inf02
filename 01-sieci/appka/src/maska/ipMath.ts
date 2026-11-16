// Arytmetyka IPv4 na liczbach 32-bitowych. `>>> 0` = wynik jako liczba bez znaku
// (operatory bitowe w JS zwracają liczby ze znakiem).

export type Ip = number;

export function parseIp(text: string): Ip {
 return text.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

export function formatIp(ip: Ip): string {
 return [24, 16, 8, 0].map((shift) => (ip >>> shift) & 255).join('.');
}

/** /25 → 255.255.255.128 jako liczba. */
export function maskOf(prefix: number): Ip {
 return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** Adres sieci = IP AND maska. */
export function networkOf(ip: Ip, prefix: number): Ip {
 return (ip & maskOf(prefix)) >>> 0;
}

/** Adres rozgłoszeniowy (Broadcast) = adres sieci z samymi jedynkami w części hosta. */
export function broadcastOf(ip: Ip, prefix: number): Ip {
 return (networkOf(ip, prefix) | ~maskOf(prefix)) >>> 0;
}

export function sameNetwork(a: Ip, b: Ip, prefix: number): boolean {
 return networkOf(a, prefix) === networkOf(b, prefix);
}

/** Liczba adresów w jednej podsieci: /26 → 64. */
export function blockSize(prefix: number): number {
 return 2 ** (32 - prefix);
}

export function lastOctet(ip: Ip): number {
 return ip & 255;
}

/** Bity ostatniego oktetu od najstarszego: 105 → [0,1,1,0,1,0,0,1]. */
export function octetBits(octet: number): number[] {
 return Array.from({ length: 8 }, (_, i) => (octet >> (7 - i)) & 1);
}
