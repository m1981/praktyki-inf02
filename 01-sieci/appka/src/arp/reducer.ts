// DLACZEGO useReducer, A NIE useState:
// Symulacja to deterministyczna maszyna stanów. Reguły przejść (granice zakresu, reset) są tu,
// w czystej funkcji – łatwej do przetestowania i rozbudowy (auto-play, wybór scenariusza)
// bez dotykania komponentów UI.

export interface SimulationState {
 stepIndex: number;
 stepCount: number;
}

export type SimulationAction = { type: 'NEXT' } | { type: 'PREV' } | { type: 'RESET' };

export function initSimulation(stepCount: number): SimulationState {
 return { stepIndex: 0, stepCount };
}

export function simulationReducer(
 state: SimulationState,
 action: SimulationAction
): SimulationState {
 switch (action.type) {
  case 'NEXT':
   return { ...state, stepIndex: Math.min(state.stepIndex + 1, state.stepCount - 1) };
  case 'PREV':
   return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
  case 'RESET':
   return { ...state, stepIndex: 0 };
 }
}
