// Nawigacja po kursie: jedna maszyna stanów dla wszystkich stron (ARP, maska, później ZS1).
// DLACZEGO CZYSTA FUNKCJA: reguły przejść (granice, przejście do następnego ćwiczenia, Tryb
// swobodny) da się przetestować bez przeglądarki. Nawigacja zna tylko KSZTAŁT kursu (ile kroków
// ma każde ćwiczenie), nie jego treść.

/** Kształt kursu potrzebny nawigacji. */
export interface CourseShape {
 /** Kody ćwiczeń, np. „M1” – z nich powstaje adres `#m1`. */
 codes: readonly string[];
 /** Liczba kroków każdego ćwiczenia. */
 stepCounts: readonly number[];
 /** Adres zakładki „Tryb swobodny” (bez `#`), gdy kurs ją ma. */
 freeHash?: string;
}

/** `ex` równe liczbie ćwiczeń oznacza zakładkę „Tryb swobodny”. */
export interface NavState {
 ex: number;
 step: number;
}

export type NavAction =
 | { type: 'NEXT' }
 | { type: 'PREV' }
 | { type: 'RESET' }
 | { type: 'GOTO'; ex: number }
 | { type: 'SET_STEP'; step: number };

/** Indeks zakładki „Tryb swobodny” (po ostatnim ćwiczeniu). */
export const freeIndex = (shape: CourseShape): number => shape.codes.length;

/** Ostatnia zakładka, na którą wolno przejść. */
const lastTab = (shape: CourseShape): number =>
 shape.freeHash === undefined ? shape.codes.length - 1 : freeIndex(shape);

export function navReducer(shape: CourseShape, state: NavState, action: NavAction): NavState {
 const free = freeIndex(shape);
 const isFree = state.ex === free;
 switch (action.type) {
  case 'NEXT':
   if (isFree) return state;
   if (state.step < shape.stepCounts[state.ex] - 1) return { ...state, step: state.step + 1 };
   return state.ex < lastTab(shape) ? { ex: state.ex + 1, step: 0 } : state;
  case 'PREV':
   if (isFree) return { ex: free - 1, step: 0 };
   if (state.step > 0) return { ...state, step: state.step - 1 };
   return state.ex > 0 ? { ex: state.ex - 1, step: 0 } : state;
  case 'RESET':
   return isFree ? state : { ...state, step: 0 };
  case 'GOTO':
   return { ex: Math.min(Math.max(action.ex, 0), lastTab(shape)), step: 0 };
  case 'SET_STEP':
   return isFree ? state : { ...state, step: action.step };
 }
}

/** Adres w pasku (#m1 … #m4, #swobodny) – nauczyciel może podać link do konkretnego ćwiczenia. */
export function hashOf(shape: CourseShape, ex: number): string {
 return ex === freeIndex(shape) ? `#${shape.freeHash}` : `#${shape.codes[ex].toLowerCase()}`;
}

export function exFromHash(shape: CourseShape, hash: string): number {
 if (shape.freeHash !== undefined && hash === `#${shape.freeHash}`) return freeIndex(shape);
 const i = shape.codes.findIndex((code) => `#${code.toLowerCase()}` === hash);
 return i >= 0 ? i : 0;
}

/** To, czego element sterujący potrzebuje od nawigacji (i nic więcej). */
export interface StepNav {
 stepIndex: number;
 /** Pierwszy krok pierwszego ćwiczenia – nie ma dokąd wracać. */
 atStart: boolean;
 /** Ostatni krok bieżącego ćwiczenia. */
 isLastStep: boolean;
 /** Nazwa tego, co jest po bieżącym ćwiczeniu (kod następnego albo „Tryb swobodny”). */
 nextTitle?: string;
 next: () => void;
 prev: () => void;
 reset: () => void;
 /** Powrót na początek całego kursu (pierwsze ćwiczenie, pierwszy krok). */
 restart: () => void;
 setStep: (step: number) => void;
}
