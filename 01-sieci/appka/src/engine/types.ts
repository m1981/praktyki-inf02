// Kontrakt lekcji: Kurs → Ćwiczenie → Krok. Treść (`content/`) to dane w tym kształcie, a szablon
// ekranu (`ui/LessonShell`) umie pokazać każdy kurs. Nowe ćwiczenie = nowe dane, bez zmian w kodzie.

import type { ComponentType } from 'react';
import type { PacketKind } from '../ui/tokens';
import type { ControlSpec, PanelSpec, ViewSpec } from './registry';
import type { CourseShape } from './nav';

export type { ControlSpec, PanelSpec, ViewSpec };

/** Postać w rozmowie (styl „rozmowa”). */
export interface Speaker {
 name: string;
 /** Kim jest, np. „administratorka sieci”. */
 role: string;
 /** Znak w kółku obok imienia. */
 avatar: string;
 /** Kolor kółka. */
 color: string;
}

export interface Step {
 /** Styl „rozmowa”: kto mówi (klucz z `Exercise.speakers`). */
 speaker?: string;
 /** Styl „rozmowa”: krok-akcja – nikt nie mówi, tekst opisuje ruch na schemacie. */
 action?: boolean;
 /** Krok wstępny: ma etykietę „Start” i nie liczy się do numeracji kroków. */
 intro?: boolean;
 /** Warstwa modelu, której dotyczy krok, np. „L2 (Łącze danych) – Broadcast”. */
 layer?: string;
 title?: string;
 /** Tekst kroku: najwyżej 40 słów (test). */
 text: string;
 /** Pasek „Zmiana”: tylko to, co zmieniło się w tym kroku. */
 change?: string;
 /** Scena: co widać obok tekstu. */
 view: ViewSpec;
 /** Panele pod sceną (ramka, tablice, pytania). */
 panels?: PanelSpec[];
 /** Jeden element sterujący kroku. */
 control: ControlSpec;
}

export interface LegendItem {
 /** Kolor znaczenia z `ui/tokens.ts`. */
 color: PacketKind;
 text: string;
}

export interface Exercise {
 code: string;
 title: string;
 /**
  * Jak pokazać krok obok sceny: `lesson` (domyślnie) – tekst kroku z paskiem „Zmiana”;
  * `dialog` – rozmowa postaci, jedna krótka kwestia na krok (jak Laboratorium VLAN).
  */
 style?: 'lesson' | 'dialog';
 /** Postacie rozmowy. */
 speakers?: Record<string, Speaker>;
 /** Jedno pytanie, na które ćwiczenie odpowiada. */
 question?: string;
 legend?: LegendItem[];
 steps: Step[];
 /** Pytanie, które ćwiczenie zostawia dla następnego (zasada z plan.md). */
 nextQuestion?: string;
 /** Odsyłacz przy tym pytaniu – gdy odpowiedź jest na innej stronie. */
 nextLink?: { href: string; label: string };
 /** „Dla dociekliwych”: pytania „dlaczego?” z odpowiedziami, zwinięte pod sceną (PYT-095). */
 notes?: readonly Note[];
}

/** Jedna notatka „Dla dociekliwych”: pytanie i krótka odpowiedź. */
export interface Note {
 q: string;
 a: string;
}

export interface FreeMode {
 /** Adres zakładki bez `#`, np. „swobodny”. */
 hash: string;
 /** Napis na zakładce. */
 tab: string;
 /** Nazwa w przycisku „Dalej: …”. */
 name: string;
 component: ComponentType;
}

export interface Course {
 id: string;
 /** Opis listy zakładek dla czytników ekranu. */
 title: string;
 exercises: Exercise[];
 /** Ostatnia zakładka: ekran, na którym uczeń sam zmienia ustawienia (PYT-002a). */
 freeMode?: FreeMode;
}

export function shapeOf(course: Course): CourseShape {
 return {
  codes: course.exercises.map((e) => e.code),
  stepCounts: course.exercises.map((e) => e.steps.length),
  freeHash: course.freeMode?.hash
 };
}

/** Kurs z jedną zakładką nie pokazuje zakładek i nie zmienia adresu strony. */
export function hasTabs(course: Course): boolean {
 return course.exercises.length > 1 || course.freeMode !== undefined;
}
