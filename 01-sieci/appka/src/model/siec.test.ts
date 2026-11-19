import { describe, expect, it } from 'vitest';
import { GLOSSARY, genitiveOf, nameOf, shortNameOf } from './glossary';
import {
 DEVICES,
 deviceCidr,
 deviceIpText,
 deviceMac,
 forwardsBroadcast,
 hasLink,
 LINKS,
 portOf,
 zoneCidr
} from './siec';

describe('model sieci', () => {
 it('adres urządzenia = adres sieci strefy + numer hosta', () => {
  expect(deviceIpText('laptop')).toBe('10.10.10.105');
  expect(deviceCidr('nas')).toBe('10.10.10.30/24');
  expect(zoneCidr('biuro')).toBe('10.10.10.0/24');
 });

 it('Switch nie ma adresu IP', () => {
  expect(() => deviceIpText('switch')).toThrow();
 });

 it('adresy IP i MAC się nie powtarzają', () => {
  const ips = DEVICES.filter((d) => d.host !== undefined).map((d) => deviceIpText(d.id));
  const macs = DEVICES.flatMap((d) => (d.mac ? [d.mac] : []));
  expect(new Set(ips).size).toBe(ips.length);
  expect(new Set(macs).size).toBe(macs.length);
 });

 it('każdy kabel łączy dwa istniejące urządzenia, a porty Switcha się nie powtarzają', () => {
  const ids = new Set<string>(DEVICES.map((d) => d.id));
  for (const link of LINKS) expect(ids.has(link.a) && ids.has(link.b)).toBe(true);
  // Port należy do urządzenia: „Fa0/1” może być na dwóch Switchach, ale nie dwa razy na jednym.
  const ports = LINKS.flatMap((l) => [
   ...(l.portA ? [`${l.a} ${l.portA}`] : []),
   ...(l.portB ? [`${l.b} ${l.portB}`] : [])
  ]);
  expect(new Set(ports).size).toBe(ports.length);
 });

 it('odczytuje MAC, port i kabel', () => {
  expect(deviceMac('laptop')).toBe('AA:BB:CC:00:01:05');
  expect(portOf('switch', 'nas')).toBe('Fa0/2');
  // Port jest po stronie Switcha; po stronie Serwera NAS model go nie podaje.
  expect(() => portOf('nas', 'switch')).toThrow();
  expect(() => portOf('laptop', 'nas')).toThrow();
  expect(hasLink('switch', 'laptop')).toBe(true);
  expect(hasLink('laptop', 'nas')).toBe(false);
 });

 it('Broadcast rozsyła dalej tylko Switch', () => {
  expect(forwardsBroadcast('switch')).toBe(true);
  expect(forwardsBroadcast('router')).toBe(false);
  expect(forwardsBroadcast('laptop')).toBe(false);
 });
});

describe('słownik nazw', () => {
 it('każdy rodzaj urządzenia z modelu ma nazwę', () => {
  for (const d of DEVICES) expect(GLOSSARY[d.kind].nom.length).toBeGreaterThan(0);
 });

 it('podaje mianownik, dopełniacz i formę krótką', () => {
  expect(nameOf('router')).toBe('Router (Brama)');
  expect(shortNameOf('router')).toBe('Router');
  expect(genitiveOf('nas')).toBe('Serwera NAS');
  expect(shortNameOf('printer')).toBe('Drukarka');
 });
});
