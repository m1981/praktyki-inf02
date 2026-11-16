import { describe, expect, it } from 'vitest';
import { formatIp } from '../lib/ipv4';
import { hasLink } from '../model/siec';
import {
 decide,
 maskRoute,
 MAX_PREFIX,
 MIN_PREFIX,
 requestFailed,
 TARGETS,
 type MaskSettings
} from './mask';

const base: MaskSettings = { prefix: 24, target: 'printer', trap: false, phase: 'there' };

describe('decide – lekcje z gotowych przykładów', () => {
 it('/24: Laptop wysyła do Drukarki bezpośrednio', () => {
  expect(decide('laptop', 'printer', base).outcome).toBe('direct');
 });

 it('/25: Drukarka za płotem – objazd przez Router w obie strony', () => {
  const s = { ...base, prefix: 25 };
  expect(decide('laptop', 'printer', s).outcome).toBe('via-router');
  expect(decide('printer', 'laptop', s).outcome).toBe('via-router');
  expect(formatIp(decide('printer', 'laptop', s).gateway)).toBe('10.10.10.129');
 });

 it('/26: brama Laptopa (.1) jest poza jego siecią (.64)', () => {
  const s: MaskSettings = { ...base, prefix: 26, target: 'nas' };
  const d = decide('laptop', 'nas', s);
  expect(d.outcome).toBe('gateway-outside');
  expect(formatIp(d.srcNet)).toBe('10.10.10.64');
  expect(requestFailed(s)).toBe(true);
  expect(maskRoute({ ...s, phase: 'back' }).hops).toEqual([]);
 });

 it('pułapka: Laptop /24 wysyła bezpośrednio, NAS /26 odpowiada przez Router', () => {
  const s: MaskSettings = { prefix: 24, target: 'nas', trap: true, phase: 'there' };
  expect(decide('laptop', 'nas', s).outcome).toBe('direct');
  expect(decide('nas', 'laptop', s).outcome).toBe('via-router');
 });

 it('nadawca liczy sieć celu SWOJĄ maską', () => {
  const s: MaskSettings = { prefix: 24, target: 'nas', trap: true, phase: 'back' };
  expect(decide('nas', 'laptop', s).prefix).toBe(26);
  expect(decide('laptop', 'nas', s).prefix).toBe(24);
 });
});

describe('maskRoute – droga ramki', () => {
 it('każdy skok idzie po kablu z modelu sieci (wszystkie kombinacje ustawień)', () => {
  for (let prefix = MIN_PREFIX; prefix <= MAX_PREFIX; prefix++)
   for (const target of TARGETS)
    for (const trap of [false, true])
     for (const phase of ['there', 'back'] as const)
      for (const hop of maskRoute({ prefix, target, trap, phase }).hops)
       expect(hasLink(hop.from, hop.to)).toBe(true);
 });

 it('objazd używa kabla do Routera dwa razy: w górę i w dół', () => {
  const hops = maskRoute({ ...base, prefix: 25 }).hops;
  expect(hops.filter((h) => [h.from, h.to].includes('router'))).toHaveLength(2);
 });

 it('objazd: pierwsza połowa drogi jest adresowana do Routera, druga do celu', () => {
  const hops = maskRoute({ ...base, prefix: 25 }).hops;
  expect(hops.map((h) => h.toward)).toEqual(['router', 'router', 'printer', 'printer']);
 });
});
