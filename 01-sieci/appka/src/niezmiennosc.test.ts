// Strażnik refaktoru (zlecenie-refaktor.md): dane i teksty, które widzi uczeń, są zapisane we
// wzorcu `__snapshots__/niezmiennosc.test.ts.snap`. Refaktor nie może zmienić ani jednego znaku.
// Wzorzec wolno odświeżyć (`pnpm test -u`) tylko przy zatwierdzonej zmianie treści (etap C).

import { describe, expect, it } from 'vitest';
import { CABLES as ARP_CABLES, DEVICES as ARP_DEVICES, SCENARIO } from './content/arp';
import { COMPARE_ROWS, MASKA } from './content/maska';
import { PRESETS } from './content/maska-swobodny';
import { CABLES as MASK_CABLES, devicesFor, maskDiagram } from './content/maska-uklad';
import type { Step } from './engine/types';
import { decide, endpoints, MAX_PREFIX, MIN_PREFIX, TARGETS, type MaskSettings } from './net/mask';

function allSettings(): MaskSettings[] {
 const all: MaskSettings[] = [];
 for (let prefix = MIN_PREFIX; prefix <= MAX_PREFIX; prefix++)
  for (const target of TARGETS)
   for (const trap of [false, true])
    for (const phase of ['there', 'back'] as const) all.push({ prefix, target, trap, phase });
 return all;
}

// Wzorzec powstał przed etapem B, w starym kształcie danych. Te funkcje przepisują nowy kształt
// (kontrakt `Step`) na stary – tylko po to, żeby porównać go ze wzorcem co do znaku.

function legacyVisual(view: Step['view']) {
 if (view.type === 'compare') return { kind: 'compare', revealed: view.revealed };
 if (view.type === 'fence') return { kind: 'fence', prefix: view.prefix };
 return { kind: 'diagram', devices: view.devices, cables: view.cables, state: view.state };
}

function legacyControl(control: Step['control'], stepIndex: number) {
 if (control.type === 'toggle') return control.options[stepIndex];
 return control.type === 'next' ? control.label : undefined;
}

function legacyExercises() {
 return MASKA.exercises.map((ex) => ({
  code: ex.code,
  title: ex.title,
  question: ex.question,
  controlKind: ex.steps[0].control.type,
  steps: ex.steps.map((step, i) => ({
   text: step.text,
   change: step.change,
   visual: legacyVisual(step.view),
   control: legacyControl(step.control, i)
  })),
  nextQuestion: ex.nextQuestion
 }));
}

/** Stary kształt wpisów do tablic: jedna tablica ARP (Laptop) i jedna tablica MAC (Switch). */
function legacyScenario() {
 return SCENARIO.map(({ learns, ...step }) => {
  if (!learns) return step;
  const laptopArp = learns.flatMap((l) => (l.device === 'laptop' && 'arp' in l ? l.arp : []));
  const switchMac = learns.flatMap((l) => (l.device === 'switch' && 'mac' in l ? l.mac : []));
  return {
   ...step,
   learns: {
    ...(laptopArp.length > 0 ? { laptopArp } : {}),
    ...(switchMac.length > 0 ? { switchMac } : {})
   }
  };
 });
}

describe('refaktor nie zmienia danych ani tekstów', () => {
 it('ARP: urządzenia, kable i kroki scenariusza', () => {
  expect({ devices: ARP_DEVICES, cables: ARP_CABLES, steps: legacyScenario() }).toMatchSnapshot();
 });

 it('maska: gotowe przykłady i kable', () => {
  expect({ presets: PRESETS, cables: MASK_CABLES }).toMatchSnapshot();
 });

 it('maska: karty urządzeń, decyzja i diagram dla każdej kombinacji ustawień', () => {
  const rows = allSettings().map((s) => {
   const { src, dst } = endpoints(s);
   return { s, devices: devicesFor(s), decision: decide(src, dst, s), diagram: maskDiagram(s) };
  });
  expect(rows).toMatchSnapshot();
 });

 it('seria M1–M4: ćwiczenia z widokami i tabela porównania', () => {
  expect({ exercises: legacyExercises(), compareRows: COMPARE_ROWS }).toMatchSnapshot();
 });
});
