import { describe, expect, it } from 'vitest';
import { countWords, MAX_STEP_WORDS } from '../sim/words';
import { assertScenario, SIMULATION_STEPS } from './scenario';

describe('scenariusz ARP', () => {
 it('każdy skok idzie po istniejącym kablu, a krok z ruchem ma ramkę', () => {
  expect(() => assertScenario(SIMULATION_STEPS)).not.toThrow();
 });

 it.each(SIMULATION_STEPS.map((s) => [s.title, s.description]))(
  `%s – opis ma najwyżej ${MAX_STEP_WORDS} słów`,
  (_title, description) => {
   expect(countWords(description)).toBeLessThanOrEqual(MAX_STEP_WORDS);
  }
 );
});
