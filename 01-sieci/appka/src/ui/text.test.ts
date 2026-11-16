import { describe, expect, it } from 'vitest';
import { fillText, plural } from './text';

describe('teksty z polami do wypełnienia', () => {
 it('wypełnia pola {nazwa}', () => {
  expect(fillText('{dst} ma bramę {gateway}.', { dst: 'Drukarka', gateway: '10.0.0.1' })).toBe(
   'Drukarka ma bramę 10.0.0.1.'
  );
 });

 it('zgłasza pole, którego kod nie wypełnia (literówka w tekście)', () => {
  expect(() => fillText('{cel} jest w mojej sieci', { dst: 'Drukarka' })).toThrow();
 });

 it('odmienia liczbę mnogą', () => {
  const bits = ['bit', 'bity', 'bitów'] as const;
  expect([1, 2, 4, 5, 6].map((n) => plural(n, bits))).toEqual([
   'bit',
   'bity',
   'bity',
   'bitów',
   'bitów'
  ]);
 });
});
