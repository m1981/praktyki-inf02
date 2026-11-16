import { describe, expect, it } from 'vitest';
import { assertFlowsOnCables } from '../sim/graph';
import { countWords, MAX_STEP_WORDS } from '../sim/words';
import {
 broadcastOf,
 formatIp,
 maskOf,
 networkOf,
 octetBits,
 parseIp,
 sameNetwork
} from '../net/ipMath';
import {
 CABLES,
 decide,
 MAX_PREFIX,
 MIN_PREFIX,
 PRESETS,
 requestFailed,
 TARGETS,
 toDiagram,
 type MaskSettings
} from './network';

const ip = parseIp;
const base: MaskSettings = { prefix: 24, target: 'printer', trap: false, phase: 'there' };

describe('ipMath', () => {
 it('parsuje i formatuje adres', () => {
  expect(formatIp(ip('10.10.10.105'))).toBe('10.10.10.105');
  expect(ip('255.255.255.255')).toBe(0xffffffff);
 });

 it('zamienia prefiks na maskę', () => {
  expect(formatIp(maskOf(24))).toBe('255.255.255.0');
  expect(formatIp(maskOf(26))).toBe('255.255.255.192');
  expect(formatIp(maskOf(30))).toBe('255.255.255.252');
 });

 it('liczy adres sieci i Broadcast', () => {
  expect(formatIp(networkOf(ip('10.10.10.105'), 26))).toBe('10.10.10.64');
  expect(formatIp(broadcastOf(ip('10.10.10.105'), 26))).toBe('10.10.10.127');
  expect(formatIp(broadcastOf(ip('10.10.10.105'), 24))).toBe('10.10.10.255');
 });

 it('porównuje sieci', () => {
  expect(sameNetwork(ip('10.10.10.105'), ip('10.10.10.130'), 24)).toBe(true);
  expect(sameNetwork(ip('10.10.10.105'), ip('10.10.10.130'), 25)).toBe(false);
 });

 it('rozkłada oktet na bity', () => {
  expect(octetBits(105)).toEqual([0, 1, 1, 0, 1, 0, 0, 1]);
 });
});

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
  expect(toDiagram({ ...s, phase: 'back' }).flows).toEqual([]);
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

 it.each(PRESETS.map((p) => [p.title, p.lesson]))(
  `%s – lekcja ma najwyżej ${MAX_STEP_WORDS} słów`,
  (_title, lesson) => {
   expect(countWords(lesson)).toBeLessThanOrEqual(MAX_STEP_WORDS);
  }
 );

 it('każdy gotowy przykład ma inne ustawienia', () => {
  const keys = PRESETS.map((p) => JSON.stringify(p.settings));
  expect(new Set(keys).size).toBe(PRESETS.length);
 });
});

describe('toDiagram', () => {
 it('każda droga ramki idzie po istniejących kablach (wszystkie kombinacje)', () => {
  for (let prefix = MIN_PREFIX; prefix <= MAX_PREFIX; prefix++)
   for (const target of TARGETS)
    for (const trap of [false, true])
     for (const phase of ['there', 'back'] as const) {
      const s = { prefix, target, trap, phase };
      expect(() =>
       assertFlowsOnCables(CABLES, toDiagram(s).flows, JSON.stringify(s))
      ).not.toThrow();
     }
 });

 it('objazd używa kabla do Routera dwa razy: w górę i w dół', () => {
  const flows = toDiagram({ ...base, prefix: 25 }).flows;
  expect(flows.filter((f) => [f.from, f.to].includes('router'))).toHaveLength(2);
 });
});
