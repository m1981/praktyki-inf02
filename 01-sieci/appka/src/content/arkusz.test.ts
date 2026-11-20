// Testy strony „Arkusz krok po kroku”:
//  1. kwestie, polecenia i reakcje są co do słowa takie jak w zatwierdzonym scenariuszu
//     (scenariusz-arkusz-1-2.md, PYT-074a) – zmiana tekstu = najpierw zmiana scenariusza;
//  2. nazwy urządzeń z arkusza (PYT-074a, PYT-076 – tymczasowo): Ruter, Przełącznik, Stacja robocza,
//     Serwer; nazwy ze Słownika innych stron („Router”, „Switch”, „Laptop”) są tu zakazane;
//  3. adresy z arkusza są spójne: brama każdej karty jest w jej kolorze.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Step } from '../engine/types';
import { cardWithIp, SHEET_CARDS, SHEET_CARD_IDS } from '../model/arkusz';
import { ARKUSZ, ARKUSZ_FIGURE } from './arkusz';

const SCENARIO = readFileSync(new URL('../../scenariusz-arkusz-1-2.md', import.meta.url), 'utf8');

/** Wiersze tabel Markdown z sekcji `### …` etapu: tablica komórek bez krawędzi. */
function tableRows(stage: string, section: string): string[][] {
 const from = SCENARIO.indexOf(`## Etap ${stage}`);
 const start = SCENARIO.indexOf(`### ${section}`, from);
 const end = SCENARIO.indexOf('\n#', start + 4);
 return SCENARIO.slice(start, end)
  .split('\n')
  .filter((line) => /^\| \d+ /.test(line))
  .map((line) =>
   line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim())
  );
}

/** „tekst” → tekst (reakcje w scenariuszu są w cudzysłowie). */
const unquote = (text: string) => text.replace(/^„/, '').replace(/”$/, '');

/** Kwestia ze scenariusza tak, jak stoi na ekranie: akcja bez kursywy, zagadka bez odpowiedzi. */
function sceneLine([, who, line]: string[]): string {
 if (who === '_akcja_') return line.replace(/^_|_$/g, '');
 if (who === '_zagadka_') return line.split(' A) ')[0];
 return line;
}

/** Reakcje na zagadkę: lista „- A: „…”” pod tabelą sceny. */
function quizReactions(stage: string): string[] {
 const from = SCENARIO.indexOf(`## Etap ${stage}`);
 const start = SCENARIO.indexOf('Reakcje na zagadkę:', from);
 const end = SCENARIO.indexOf('###', start);
 return [...SCENARIO.slice(start, end).matchAll(/^- [AB]: (.+)$/gm)].map((m) => unquote(m[1]));
}

const [ETAP_1, ETAP_2] = ARKUSZ.exercises;
const isTask = (step: Step) => step.speaker === 'task';
/** Polecenie ćwiczenia z tabelą – mechanika i tekst z PYT-077a, scenariusz go nie podaje. */
const isTableTask = (step: Step) => step.view.type === 'sheet' && step.view.task?.kind === 'table';

/** Reakcja na błąd w ćwiczeniu: z kliknięcia na schemacie albo ze złej odpowiedzi do wyboru. */
function wrongReaction(step: Step): string | undefined {
 if (step.view.type === 'sheet' && step.view.task?.kind === 'pick') return step.view.task.wrong;
 if (step.control.type === 'task') return step.control.options?.find((o) => !o.correct)?.feedback;
 return undefined;
}

describe('kwestie co do słowa ze scenariusza', () => {
 it.each([
  ['1', ETAP_1],
  ['2', ETAP_2]
 ] as const)('etap %s: scena', (stage, exercise) => {
  const expected = tableRows(stage, 'Scena').map(sceneLine);
  const actual = exercise.steps.filter((s) => !isTask(s)).map((s) => s.text);
  expect(actual).toEqual(expected);
 });

 it.each([
  ['1', ETAP_1, 'Ćwiczenie'],
  ['2', ETAP_2, 'Ćwiczenie']
 ] as const)('etap %s: polecenia i reakcje na błąd', (stage, exercise, section) => {
  // Etap 1: | # | Polecenie | Co robi uczeń | Dobra odpowiedź | Reakcja na błąd |
  // Etap 2: tabela do wypełnienia, potem | # | Pytanie | Dobra odpowiedź | Reakcja na błąd |
  const rows = tableRows(stage, section).filter((cells) => cells.length >= 4);
  const tasks = exercise.steps.filter((s) => isTask(s) && !isTableTask(s));
  expect(tasks.map((s) => s.text)).toEqual(rows.map((cells) => cells[1]));
  expect(tasks.map(wrongReaction)).toEqual(rows.map((cells) => unquote(cells.at(-1)!)));
 });

 it.each([
  ['1', ETAP_1],
  ['2', ETAP_2]
 ] as const)('etap %s: reakcje na zagadkę', (stage, exercise) => {
  const quiz = exercise.steps.find((s) => s.control.type === 'quiz')!;
  const options = quiz.control.type === 'quiz' ? quiz.control.options : [];
  expect(options.map((o) => o.feedback)).toEqual(quizReactions(stage));
 });
});

describe('nazwy urządzeń jak w arkuszu', () => {
 const steps = ARKUSZ.exercises.flatMap((ex) => ex.steps);
 /** Kwestie Oli i Kuby – mowa potoczna (PYT-075b: „komputer” wolno tylko tu). */
 const spoken = steps.filter((s) => s.speaker === 'ola' || s.speaker === 'kuba').map((s) => s.text);
 const written: string[] = [ARKUSZ_FIGURE.alt, ARKUSZ_FIGURE.caption].concat(
  steps.flatMap((s) => {
   const out = s.speaker === 'ola' || s.speaker === 'kuba' ? [] : [s.text];
   if (s.control.type === 'quiz')
    out.push(...s.control.options.flatMap((o) => [o.text, o.feedback]));
   if (s.control.type === 'task') {
    out.push(...(s.control.options ?? []).flatMap((o) => [o.text, o.feedback ?? '']));
   }
   if (s.view.type === 'sheet') {
    const v = s.view;
    if (v.task?.kind === 'pick') out.push(v.task.wrong);
    if (v.task?.kind === 'table') {
     out.push(
      ...v.task.rows.flatMap((r) => [r.name, r.about]),
      v.task.hints.row,
      v.task.hints.column
     );
    }
    if (v.excerpt) out.push(v.excerpt.title, ...v.excerpt.rows.map((r) => r.heading));
    if (v.note) out.push(v.note);
   }
   return out;
  })
 );

 // Słowa nazw ze Słownika innych stron i inne nazwy na te same urządzenia.
 const GLOSSARY_NAMES = /(?<![\p{L}])(?:router|switch|laptop|notebook|hub)\p{L}*/giu;
 const COMPUTER = /(?<![\p{L}])komputer\p{L}*/giu;

 it('test widzi teksty strony', () => {
  expect(spoken.length).toBeGreaterThan(15);
  expect(written.length).toBeGreaterThan(20);
 });

 it.each([...spoken, ...written])('%s', (text) => {
  expect(text.match(GLOSSARY_NAMES) ?? []).toEqual([]);
 });

 it.each(written)('%s – bez słowa „komputer” poza kwestiami postaci', (text) => {
  expect(text.match(COMPUTER) ?? []).toEqual([]);
 });
});

describe('adresy z arkusza', () => {
 it('brama każdej karty jest w jej kolorze (sieci)', () => {
  for (const card of SHEET_CARD_IDS) {
   const { gateway, net } = SHEET_CARDS[card];
   if (!gateway) continue;
   const gate = cardWithIp(gateway);
   // Brama Rutera WAN (90.0.0.2) jest u operatora – poza schematem, w sieci „świat”.
   if (card === 'ruter-wan') {
    expect(gate).toBeUndefined();
    continue;
   }
   expect(gate && SHEET_CARDS[gate].net).toBe(net);
  }
 });
});
