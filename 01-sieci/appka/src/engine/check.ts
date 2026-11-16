import { assertFlowsOnCables } from '../ui/diagram/graph';
import type { Course } from './types';

/**
 * Sprawdza spójność kursu: każda ramka na diagramie musi iść po narysowanym kablu. Strony wołają to
 * w trybie deweloperskim (`pnpm dev`) – błąd w danych wychodzi od razu, a nie jako „brakująca
 * strzałka” na diagramie. Te same reguły pilnuje `content/content.test.ts`.
 */
export function assertCourse(course: Course): void {
 for (const ex of course.exercises) {
  ex.steps.forEach((step, i) => {
   if (step.view.type !== 'diagram') return;
   assertFlowsOnCables(step.view.cables, step.view.state.flows, `${ex.code}, krok ${i + 1}`);
  });
 }
}
