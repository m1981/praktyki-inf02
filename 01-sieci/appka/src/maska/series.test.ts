import { describe, expect, it } from 'vitest';
import { assertFlowsOnCables } from '../sim/graph';
import { countWords, MAX_STEP_WORDS } from '../sim/words';
import { exFromHash, EXERCISES, FREE_MODE, hashOf, seriesReducer } from './series';

const steps = EXERCISES.flatMap((ex) => ex.steps.map((s, i) => ({ ex, s, i })));

describe('seria M1–M4', () => {
 it.each(steps.map(({ ex, s, i }) => [`${ex.code} krok ${i + 1}`, s.text]))(
  `%s – tekst ma najwyżej ${MAX_STEP_WORDS} słów`,
  (_name, text) => {
   expect(countWords(text)).toBeLessThanOrEqual(MAX_STEP_WORDS);
  }
 );

 it('każda ramka w diagramach serii idzie po istniejącym kablu', () => {
  for (const { ex, s, i } of steps) {
   const v = s.visual;
   if (v.kind !== 'diagram') continue;
   const ids = new Set(v.devices.map((d) => d.id));
   for (const f of v.state.flows) {
    expect(ids.has(f.from) && ids.has(f.to)).toBe(true);
   }
   expect(() => assertFlowsOnCables(v.cables, v.state.flows, `${ex.code}/${i}`)).not.toThrow();
  }
 });

 it('każde ćwiczenie ma pytanie i pytanie dla następnego', () => {
  for (const ex of EXERCISES) {
   expect(ex.question.length).toBeGreaterThan(0);
   expect(ex.nextQuestion.length).toBeGreaterThan(0);
  }
 });

 it('M3: przy /25 ramka jedzie przez Router, przy /24 nie', () => {
  const [s24, s25] = EXERCISES[2].steps;
  const viaRouter = (s: typeof s24) =>
   s.visual.kind === 'diagram' && s.visual.state.flows.some((f) => f.to === 'router');
  expect(viaRouter(s24)).toBe(false);
  expect(viaRouter(s25)).toBe(true);
 });

 it('nawigacja: Dalej przechodzi przez kroki, potem do następnego ćwiczenia i do Trybu swobodnego', () => {
  let s = { ex: 0, step: 0 };
  const total = EXERCISES.reduce((n, e) => n + e.steps.length, 0);
  for (let i = 0; i < total; i++) s = seriesReducer(s, { type: 'NEXT' });
  expect(s).toEqual({ ex: FREE_MODE, step: 0 });
  expect(seriesReducer(s, { type: 'NEXT' })).toEqual(s);
  expect(seriesReducer({ ex: 0, step: 0 }, { type: 'PREV' })).toEqual({ ex: 0, step: 0 });
 });

 it('adres #m1…#m4 i #swobodny wskazuje właściwe ćwiczenie', () => {
  for (let ex = 0; ex <= FREE_MODE; ex++) expect(exFromHash(hashOf(ex))).toBe(ex);
  expect(exFromHash('#cokolwiek')).toBe(0);
 });
});
