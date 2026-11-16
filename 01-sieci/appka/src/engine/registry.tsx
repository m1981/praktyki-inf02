// Rejestry: rodzaj widoku, panelu i elementu sterującego → komponent.
// DLACZEGO REJESTR: szablon ekranu (`LessonShell`) nie zna żadnego konkretnego widoku. Nowy rodzaj
// widoku = nowy komponent, jego opis (`…Spec`) w unii poniżej i jedna linia w rejestrze. Szablon
// i pozostałe widoki zostają bez zmian (zasada otwarte–zamknięte).

import type { ComponentType } from 'react';
import { NextControl, type NextSpec } from '../ui/controls/NextControl';
import { StepperControl, type StepperSpec } from '../ui/controls/StepperControl';
import { ToggleControl, type ToggleSpec } from '../ui/controls/ToggleControl';
import { FramePanel, type FrameSpec } from '../ui/panels/FramePanel';
import { QuestionsPanel, type QuestionsSpec } from '../ui/panels/QuestionsPanel';
import { TablesPanel, type TablesSpec } from '../ui/panels/TablesPanel';
import { CompareView, type CompareSpec } from '../ui/views/CompareView';
import { DiagramView, type DiagramSpec } from '../ui/views/DiagramView';
import { FenceView, type FenceSpec } from '../ui/views/FenceView';
import type { StepNav } from './nav';

export type ViewSpec = DiagramSpec | FenceSpec | CompareSpec;
export type PanelSpec = FrameSpec | TablesSpec | QuestionsSpec;
export type ControlSpec = NextSpec | ToggleSpec | StepperSpec;

/** Rejestr: dla każdego `type` z unii opisów – komponent, który przyjmuje dokładnie ten opis. */
type Registry<Spec extends { type: string }, Extra = object> = {
 [K in Spec['type']]: ComponentType<{ spec: Extract<Spec, { type: K }> } & Extra>;
};

const VIEWS: Registry<ViewSpec, { runId: number }> = {
 diagram: DiagramView,
 fence: FenceView,
 compare: CompareView
};

const PANELS: Registry<PanelSpec> = {
 frame: FramePanel,
 tables: TablesPanel,
 questions: QuestionsPanel
};

const CONTROLS: Registry<ControlSpec, { nav: StepNav }> = {
 next: NextControl,
 toggle: ToggleControl,
 stepper: StepperControl
};

// Rzutowanie w jednym miejscu: typ `Registry` gwarantuje, że pod `spec.type` leży komponent dla
// tego właśnie opisu, ale TypeScript nie umie tego wywnioskować z indeksu.

export function View({ spec, runId }: { spec: ViewSpec; runId: number }) {
 const Component = VIEWS[spec.type] as ComponentType<{ spec: ViewSpec; runId: number }>;
 return <Component spec={spec} runId={runId} />;
}

export function Panel({ spec }: { spec: PanelSpec }) {
 const Component = PANELS[spec.type] as ComponentType<{ spec: PanelSpec }>;
 return <Component spec={spec} />;
}

export function Control({ spec, nav }: { spec: ControlSpec; nav: StepNav }) {
 const Component = CONTROLS[spec.type] as ComponentType<{ spec: ControlSpec; nav: StepNav }>;
 return <Component spec={spec} nav={nav} />;
}
