// Stan Trybu swobodnego: ustawienia, które uczeń zmienia sam, i gotowe przykłady.
// DLACZEGO useReducer: kilka powiązanych ustawień (maska, cel, pułapka, kierunek) zmienia się
// razem (gotowe przykłady), a każda zmiana musi też zrestartować animację (runId).

import { MAX_PREFIX, MIN_PREFIX, type HostId, type MaskSettings, type Phase } from '../../net/mask';

/** Gotowy przykład: ustawienia + jedna lekcja (najwyżej 40 słów). */
export interface Preset {
 id: string;
 title: string;
 settings: MaskSettings;
 lesson: string;
}

export function matchingPreset(presets: readonly Preset[], s: MaskSettings): Preset | undefined {
 return presets.find(
  (p) =>
   p.settings.prefix === s.prefix &&
   p.settings.target === s.target &&
   p.settings.trap === s.trap &&
   p.settings.phase === s.phase
 );
}

export interface MaskState extends MaskSettings {
 /** Rośnie przy każdej zmianie – restartuje animację ramek od początku. */
 runId: number;
}

export type MaskAction =
 | { type: 'SET_PREFIX'; prefix: number }
 | { type: 'SET_TARGET'; target: HostId }
 | { type: 'SET_TRAP'; trap: boolean }
 | { type: 'SET_PHASE'; phase: Phase }
 | { type: 'APPLY_PRESET'; settings: MaskSettings };

export const initMaskState = (settings: MaskSettings): MaskState => ({ ...settings, runId: 0 });

export function maskReducer(state: MaskState, action: MaskAction): MaskState {
 const next = { ...state, runId: state.runId + 1 };
 switch (action.type) {
  case 'SET_PREFIX':
   return { ...next, prefix: Math.min(MAX_PREFIX, Math.max(MIN_PREFIX, action.prefix)) };
  case 'SET_TARGET':
   return { ...next, target: action.target };
  case 'SET_TRAP':
   return { ...next, trap: action.trap };
  case 'SET_PHASE':
   return { ...next, phase: action.phase };
  case 'APPLY_PRESET':
   return { ...next, ...action.settings };
 }
}
