// Testy treści (architektura.md, rozdz. 2.5): pilnują reguł z audytu dla KAŻDEGO kursu.
// Nowe ćwiczenie dopisujesz w `content/` – te testy sprawdzą je bez żadnej zmiany tutaj.

import { describe, expect, it } from 'vitest';
import type { Course } from '../engine/types';
import { countWords, MAX_STEP_WORDS } from '../engine/words';
import { GLOSSARY } from '../model/glossary';
import { DEVICES } from '../model/siec';
import { MAX_PREFIX, MIN_PREFIX, TARGETS } from '../net/mask';
import { assertFlowsOnCables } from '../ui/diagram/graph';
import { MASKA } from './maska';
import { FREE_MODE, PRESETS } from './maska-swobodny';

const COURSES: Course[] = [MASKA];

const steps = COURSES.flatMap((course) =>
 course.exercises.flatMap((ex) =>
  ex.steps.map((step, i) => ({ name: `${ex.code} krok ${i + 1}`, ex, step }))
 )
);

/** Wszystkie zdania, które czyta uczeń: [skąd, tekst]. */
const sentences: [string, string][] = [
 ...COURSES.flatMap((course) =>
  course.exercises.flatMap((ex): [string, string][] => [
   [`${ex.code} tytuł`, ex.title],
   [`${ex.code} pytanie`, ex.question ?? ''],
   [`${ex.code} pytanie na następne ćwiczenie`, ex.nextQuestion ?? '']
  ])
 ),
 ...steps.flatMap(({ name, step }): [string, string][] => [
  [`${name} tytuł`, step.title ?? ''],
  [`${name} tekst`, step.text],
  [`${name} zmiana`, step.change ?? '']
 ]),
 ...PRESETS.flatMap((p): [string, string][] => [
  [`przykład ${p.id} tytuł`, p.title],
  [`przykład ${p.id} lekcja`, p.lesson]
 ])
];

describe('treść kursów', () => {
 it.each(steps.map(({ name, step }) => [name, step.text]))(
  `%s – tekst ma najwyżej ${MAX_STEP_WORDS} słów`,
  (_name, text) => {
   expect(countWords(text)).toBeLessThanOrEqual(MAX_STEP_WORDS);
  }
 );

 it('każda ramka na diagramie idzie po istniejącym kablu między pokazanymi urządzeniami', () => {
  for (const { name, step } of steps) {
   const v = step.view;
   if (v.type !== 'diagram') continue;
   const ids = new Set(v.devices.map((d) => d.id));
   for (const f of v.state.flows) expect(ids.has(f.from) && ids.has(f.to)).toBe(true);
   expect(() => assertFlowsOnCables(v.cables, v.state.flows, name)).not.toThrow();
  }
 });

 it('każde urządzenie na diagramie istnieje w modelu sieci', () => {
  const known = new Set<string>(DEVICES.map((d) => d.id));
  for (const { step } of steps) {
   if (step.view.type !== 'diagram') continue;
   for (const d of step.view.devices) expect(known.has(d.id)).toBe(true);
  }
 });

 it('ćwiczenia serii mają pytanie i pytanie dla następnego', () => {
  for (const ex of MASKA.exercises) {
   expect(ex.question?.length).toBeGreaterThan(0);
   expect(ex.nextQuestion?.length).toBeGreaterThan(0);
  }
 });
});

// Kryterium 12 z audytu: w tekstach tylko nazwy ze Słownika pojęć („Laptop”, „Switch”, „Router
// (Brama)”/„Router”, „Serwer NAS”, „Drukarka”, „Kamera”) – odmienione, ale zawsze tym samym słowem
// i wielką literą.
describe('nazwy urządzeń tylko ze słownika', () => {
 // Temat nazwy do odmiany: „Drukarka” → „Drukark” (Drukarki, Drukarce…), „Laptop” → „Laptop”.
 const stems = Object.values(GLOSSARY).map((name) =>
  (name.short ?? name.nom).split(' ')[0].replace(/[aeiouy]$/, '')
 );
 const anyCase = new RegExp(`(?<![\\p{L}])(?:${stems.join('|')})\\p{L}*`, 'giu');
 const proper = new RegExp(`^(?:${stems.join('|')})\\p{L}*$`, 'u');
 // Inne słowa na te same urządzenia – w materiałach ich nie używamy.
 const OTHER_NAMES =
  /(?<![\p{L}])(?:komputer|notebook|przełącznik|ruter|hub|dysk sieciow|serwer plik)\p{L}*/giu;

 it('test widzi teksty wszystkich kursów', () => {
  expect(sentences.length).toBeGreaterThan(40);
  expect(stems).toContain('Drukark');
 });

 it.each(sentences)('%s', (_where, text) => {
  const wrongCase = (text.match(anyCase) ?? []).filter((word) => !proper.test(word));
  expect(wrongCase).toEqual([]);
  expect(text.match(OTHER_NAMES) ?? []).toEqual([]);
  // „NAS” występuje tylko jako część nazwy „Serwer NAS”.
  const nasAlone = text.match(/(?<!Serwer\p{L}* )(?<![\p{L}])NAS(?![\p{L}])/gu) ?? [];
  expect(nasAlone).toEqual([]);
 });
});

describe('seria M1–M4', () => {
 it('M3: przy /25 ramka jedzie przez Router, przy /24 nie', () => {
  const [s24, s25] = MASKA.exercises[2].steps;
  const viaRouter = (s: typeof s24) =>
   s.view.type === 'diagram' && s.view.state.flows.some((f) => f.to === 'router');
  expect(viaRouter(s24)).toBe(false);
  expect(viaRouter(s25)).toBe(true);
 });
});

describe('Tryb swobodny maski', () => {
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

 it('każda droga ramki idzie po kablach z diagramu (wszystkie kombinacje ustawień)', () => {
  for (let prefix = MIN_PREFIX; prefix <= MAX_PREFIX; prefix++)
   for (const target of TARGETS)
    for (const trap of [false, true])
     for (const phase of ['there', 'back'] as const) {
      const s = { prefix, target, trap, phase };
      expect(() =>
       assertFlowsOnCables(FREE_MODE.cables, FREE_MODE.diagram(s).flows, JSON.stringify(s))
      ).not.toThrow();
     }
 });
});
