// Decyzja nadawcy: „bezpośrednio czy przez bramę”. To sedno lekcji o masce, więc liczy ją
// JEDNA czysta funkcja – korzystają z niej diagram, tabela decyzji i testy.

import { networkOf, sameNetwork, type Ip } from '../lib/ipv4';

/** Ustawienia karty sieciowej nadawcy. */
export interface HostConfig {
 ip: Ip;
 prefix: number;
 gateway: Ip;
}

/**
 * `direct` – cel jest w sieci nadawcy; `via-router` – cel poza siecią, ramka idzie do bramy;
 * `gateway-outside` – cel poza siecią i brama też poza nią, więc nie ma komu oddać ramki.
 */
export type Outcome = 'direct' | 'via-router' | 'gateway-outside';

export interface RouteDecision {
 /** Maska NADAWCY – tylko jej używa nadawca, także do liczenia sieci celu. */
 prefix: number;
 srcNet: Ip;
 dstNet: Ip;
 gateway: Ip;
 gatewayInside: boolean;
 outcome: Outcome;
}

export function decideRoute(src: HostConfig, dstIp: Ip): RouteDecision {
 const gatewayInside = sameNetwork(src.gateway, src.ip, src.prefix);
 const local = sameNetwork(dstIp, src.ip, src.prefix);
 return {
  prefix: src.prefix,
  srcNet: networkOf(src.ip, src.prefix),
  dstNet: networkOf(dstIp, src.prefix),
  gateway: src.gateway,
  gatewayInside,
  outcome: local ? 'direct' : gatewayInside ? 'via-router' : 'gateway-outside'
 };
}
