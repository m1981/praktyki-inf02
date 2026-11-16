import { useEffect, useMemo, useReducer } from 'react';
import { exFromHash, freeIndex, hashOf, navReducer, type NavAction, type NavState } from './nav';
import { hasTabs, shapeOf, type Course } from './types';

/**
 * Jedna nawigacja dla wszystkich stron: krok i ćwiczenie w jednym reducerze, adres `#kod`,
 * strzałki ← → na klawiaturze, reakcja na zmianę adresu w pasku.
 */
export function useCourseNav(course: Course) {
 const shape = useMemo(() => shapeOf(course), [course]);
 const tabs = hasTabs(course);
 const [state, dispatch] = useReducer(
  (s: NavState, a: NavAction) => navReducer(shape, s, a),
  undefined,
  (): NavState => ({ ex: tabs ? exFromHash(shape, window.location.hash) : 0, step: 0 })
 );
 const isFree = state.ex === freeIndex(shape);

 // Adres w pasku (#m1 …) bez dopisywania historii przy każdym kroku.
 useEffect(() => {
  if (tabs) history.replaceState(null, '', hashOf(shape, state.ex));
 }, [tabs, shape, state.ex]);

 // Wklejony link z innym #m… w tej samej karcie nie przeładowuje strony – reagujemy na zmianę adresu.
 useEffect(() => {
  if (!tabs) return;
  const onHash = () => dispatch({ type: 'GOTO', ex: exFromHash(shape, window.location.hash) });
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
 }, [tabs, shape]);

 // Strzałki ← → (wygodne przy rzutniku). Pomijamy, gdy fokus jest w polu tekstowym.
 // W Trybie swobodnym strzałki obsługują suwak maski.
 useEffect(() => {
  if (isFree) return;
  const onKey = (e: KeyboardEvent) => {
   if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
   if (e.key === 'ArrowRight') dispatch({ type: 'NEXT' });
   if (e.key === 'ArrowLeft') dispatch({ type: 'PREV' });
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [isFree]);

 return { state, dispatch, isFree };
}
