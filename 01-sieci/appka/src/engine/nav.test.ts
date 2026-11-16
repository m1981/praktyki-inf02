import { describe, expect, it } from 'vitest';
import { exFromHash, freeIndex, hashOf, navReducer, type CourseShape, type NavState } from './nav';

// Seria: dwa ćwiczenia (3 i 2 kroki) + Tryb swobodny. Pojedynczy scenariusz: jedno ćwiczenie.
const series: CourseShape = { codes: ['M1', 'M2'], stepCounts: [3, 2], freeHash: 'swobodny' };
const single: CourseShape = { codes: ['ARP'], stepCounts: [4] };
const FREE = freeIndex(series);

describe('nawigacja po kursie', () => {
 it('Dalej przechodzi przez kroki, potem do następnego ćwiczenia i do Trybu swobodnego', () => {
  let s: NavState = { ex: 0, step: 0 };
  for (let i = 0; i < 5; i++) s = navReducer(series, s, { type: 'NEXT' });
  expect(s).toEqual({ ex: FREE, step: 0 });
  expect(navReducer(series, s, { type: 'NEXT' })).toEqual(s);
 });

 it('Wstecz cofa krok, a z pierwszego kroku wraca na początek poprzedniego ćwiczenia', () => {
  expect(navReducer(series, { ex: 0, step: 0 }, { type: 'PREV' })).toEqual({ ex: 0, step: 0 });
  expect(navReducer(series, { ex: 0, step: 2 }, { type: 'PREV' })).toEqual({ ex: 0, step: 1 });
  expect(navReducer(series, { ex: 1, step: 0 }, { type: 'PREV' })).toEqual({ ex: 0, step: 0 });
  expect(navReducer(series, { ex: FREE, step: 0 }, { type: 'PREV' })).toEqual({ ex: 1, step: 0 });
 });

 it('kurs bez Trybu swobodnego zatrzymuje się na ostatnim kroku', () => {
  const last: NavState = { ex: 0, step: 3 };
  expect(navReducer(single, last, { type: 'NEXT' })).toEqual(last);
  expect(navReducer(single, last, { type: 'RESET' })).toEqual({ ex: 0, step: 0 });
  expect(navReducer(single, last, { type: 'GOTO', ex: 5 })).toEqual({ ex: 0, step: 0 });
 });

 it('przełącznik ustawia krok wprost, zakładka otwiera ćwiczenie od początku', () => {
  expect(navReducer(series, { ex: 1, step: 0 }, { type: 'SET_STEP', step: 1 })).toEqual({
   ex: 1,
   step: 1
  });
  expect(navReducer(series, { ex: 0, step: 2 }, { type: 'GOTO', ex: 1 })).toEqual({
   ex: 1,
   step: 0
  });
  expect(navReducer(series, { ex: 0, step: 2 }, { type: 'GOTO', ex: 9 })).toEqual({
   ex: FREE,
   step: 0
  });
 });

 it('adres #m1, #m2 i #swobodny wskazuje właściwą zakładkę', () => {
  for (let ex = 0; ex <= FREE; ex++) expect(exFromHash(series, hashOf(series, ex))).toBe(ex);
  expect(exFromHash(series, '#cokolwiek')).toBe(0);
  expect(exFromHash(single, '#swobodny')).toBe(0);
 });
});
