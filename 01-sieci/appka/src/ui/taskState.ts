// Stan jednego ćwiczenia „uczeń sam”: czy zrobione i co odpowiedzieć na ostatni ruch.
// DLACZEGO OSOBNY MAGAZYN: uczeń klika na schemacie (widok), a reakcja i przycisk „Dalej” są w oknie
// rozmowy (element sterujący). Szablon ekranu nie łączy widoku z elementem sterującym, więc dzielą
// ten mały stan. Widok zeruje go przy każdym nowym kroku.

import { useSyncExternalStore } from 'react';

export interface TaskState {
 /** Ćwiczenie zrobione – „Dalej” jest aktywne. */
 solved: boolean;
 /** Reakcja na ostatni ruch ucznia. */
 feedback?: { text: string; ok: boolean };
}

const EMPTY: TaskState = { solved: false };
let state: TaskState = EMPTY;
const listeners = new Set<() => void>();

export function setTask(next: TaskState): void {
 state = next;
 listeners.forEach((l) => l());
}

export function resetTask(): void {
 if (state !== EMPTY) setTask(EMPTY);
}

export function useTask(): TaskState {
 return useSyncExternalStore(
  (listener) => {
   listeners.add(listener);
   return () => listeners.delete(listener);
  },
  () => state
 );
}
