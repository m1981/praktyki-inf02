// Strażnik refaktoru (zlecenie-refaktor.md): dane i teksty, które widzi uczeń, są zapisane we
// wzorcu `__snapshots__/niezmiennosc.test.ts.snap`. Refaktor nie może zmienić ani jednego znaku.
// Wzorzec wolno odświeżyć (`pnpm test -u`) tylko przy zatwierdzonej zmianie treści (etap C).

import { describe, expect, it } from 'vitest';
import { CABLES as ARP_CABLES, DEVICES as ARP_DEVICES, SIMULATION_STEPS } from './arp/scenario';
import {
 CABLES as MASK_CABLES,
 decide,
 devicesFor,
 endpoints,
 MAX_PREFIX,
 MIN_PREFIX,
 PRESETS,
 TARGETS,
 toDiagram,
 type MaskSettings
} from './maska/network';
import { COMPARE_ROWS, EXERCISES } from './maska/series';

function allSettings(): MaskSettings[] {
 const all: MaskSettings[] = [];
 for (let prefix = MIN_PREFIX; prefix <= MAX_PREFIX; prefix++)
  for (const target of TARGETS)
   for (const trap of [false, true])
    for (const phase of ['there', 'back'] as const) all.push({ prefix, target, trap, phase });
 return all;
}

describe('refaktor nie zmienia danych ani tekstów', () => {
 it('ARP: urządzenia, kable i kroki scenariusza', () => {
  expect({ devices: ARP_DEVICES, cables: ARP_CABLES, steps: SIMULATION_STEPS }).toMatchSnapshot();
 });

 it('maska: gotowe przykłady i kable', () => {
  expect({ presets: PRESETS, cables: MASK_CABLES }).toMatchSnapshot();
 });

 it('maska: karty urządzeń, decyzja i diagram dla każdej kombinacji ustawień', () => {
  const rows = allSettings().map((s) => {
   const { src, dst } = endpoints(s);
   return { s, devices: devicesFor(s), decision: decide(src, dst, s), diagram: toDiagram(s) };
  });
  expect(rows).toMatchSnapshot();
 });

 it('seria M1–M4: ćwiczenia z widokami i tabela porównania', () => {
  expect({ exercises: EXERCISES, compareRows: COMPARE_ROWS }).toMatchSnapshot();
 });
});
