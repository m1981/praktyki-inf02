// Rejestry: rodzaj widoku i elementu sterującego → komponent.
// DLACZEGO REJESTR: szablon ekranu (`LessonShell`) nie zna żadnego konkretnego widoku. Nowy rodzaj
// widoku = nowy komponent, jego opis (`…Spec`) w unii poniżej i jedna linia w rejestrze. Szablon
// i pozostałe widoki zostają bez zmian (zasada otwarte–zamknięte).

import type { ComponentType } from 'react';
import { NextControl, type NextSpec } from '../ui/controls/NextControl';
import { ToggleControl, type ToggleSpec } from '../ui/controls/ToggleControl';
import { CompareView, type CompareSpec } from '../ui/views/CompareView';
import { DiagramView, type DiagramSpec } from '../ui/views/DiagramView';
import { FenceView, type FenceSpec } from '../ui/views/FenceView';
import type { StepNav } from './nav';

export type ViewSpec = DiagramSpec | FenceSpec | CompareSpec;
export type ControlSpec = NextSpec | ToggleSpec;

/** Rejestr: dla każdego `type` z unii opisów – komponent, który przyjmuje dokładnie ten opis. */
type Registry<Spec extends { type: string }, Extra = object> = {
 [K in Spec['type']]: ComponentType<{ spec: Extract<Spec, { type: K }> } & Extra>;
};

const VIEWS: Registry<ViewSpec, { runId: number }> = {
 diagram: DiagramView,
 fence: FenceView,
 compare: CompareView
};

const CONTROLS: Registry<ControlSpec, { nav: StepNav }> = {
 next: NextControl,
 toggle: ToggleControl
};

// Rzutowanie w jednym miejscu: typ `Registry` gwarantuje, że pod `spec.type` leży komponent dla
// tego właśnie opisu, ale TypeScript nie umie tego wywnioskować z indeksu.

export function View({ spec, runId }: { spec: ViewSpec; runId: number }) {
 const Component = VIEWS[spec.type] as ComponentType<{ spec: ViewSpec; runId: number }>;
 return <Component spec={spec} runId={runId} />;
}

export function Control({ spec, nav }: { spec: ControlSpec; nav: StepNav }) {
 const Component = CONTROLS[spec.type] as ComponentType<{ spec: ControlSpec; nav: StepNav }>;
 return <Component spec={spec} nav={nav} />;
}
