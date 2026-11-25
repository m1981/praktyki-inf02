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

const [ETAP_1, ETAP_2, ETAP_3, ETAP_4, ETAP_5, ETAP_6] = ARKUSZ.exercises;
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

/** Notatki „Dla dociekliwych” etapu ze scenariusza: „- **pytanie** odpowiedź” (z zawinięciami). */
function scenarioNotes(stage: string): { q: string; a: string }[] {
 const from = SCENARIO.indexOf('## Dla dociekliwych');
 const start = SCENARIO.indexOf(`### Etap ${stage}`, from);
 const end = SCENARIO.indexOf('\n#', start + 4);
 const items = SCENARIO.slice(start, end)
  .split(/\n- /)
  .slice(1)
  .map((item) => item.replace(/\s*\n\s*/g, ' ').trim());
 return items.map((item) => {
  const m = item.match(/^\*\*(.+?)\*\* (.+)$/);
  if (!m) throw new Error(`Notatka bez pytania w pogrubieniu: ${item}`);
  return { q: m[1], a: m[2] };
 });
}

describe('notatki „Dla dociekliwych” co do słowa ze scenariusza', () => {
 it.each([
  ['1', ETAP_1],
  ['2', ETAP_2]
 ] as const)('etap %s', (stage, exercise) => {
  expect(exercise.notes).toEqual(scenarioNotes(stage));
 });
});

// --- Warstwa 3: scenariusz-arkusz-3.md (wersja 3) ---

const SCENARIO_3 = readFileSync(new URL('../../scenariusz-arkusz-3.md', import.meta.url), 'utf8');

/** Wiersze tabeli z sekcji `## {section}` scenariusza warstwy 3. */
function rows3(section: string, first = /^\| \d+ /, text = SCENARIO_3): string[][] {
 const start = text.indexOf(`## ${section}`);
 const end = text.indexOf('\n## ', start + 4);
 return text
  .slice(start, end)
  .split('\n')
  .filter((line) => first.test(line))
  .map((line) =>
   line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim())
  );
}

/** Tekst po etykiecie w akapicie scenariusza, np. „reakcja, gdy … : „…””. */
function quoteAfter(label: string, scenario = SCENARIO_3): string {
 const start = scenario.indexOf(label);
 const text = scenario.slice(start).replace(/\s*\n\s*/g, ' ');
 return unquote(text.match(/: („[^\n]*?”)(?= |$)/)![1]);
}

describe('warstwa 3 co do słowa ze scenariusza', () => {
 const isTask3 = (s: Step) => s.speaker === 'task';

 it('pięć linijek arkusza', () => {
  const sheet = ETAP_3.steps[0].view;
  const items = sheet.type === 'sheet' ? sheet.lines?.items : [];
  expect(items?.map((l) => [l.id, l.text])).toEqual(
   rows3('Linijki z arkusza', /^\| L\d /).map((c) => [c[0], c[2]])
  );
 });

 it('scena', () => {
  const expected = rows3('Scena').map(sceneLine);
  expect(ETAP_3.steps.filter((s) => !isTask3(s)).map((s) => s.text)).toEqual(expected);
 });

 it('reakcje na zagadkę', () => {
  const start = SCENARIO_3.indexOf('Reakcje na zagadkę:');
  const expected = [
   ...SCENARIO_3.slice(start, SCENARIO_3.indexOf('##', start)).matchAll(/^- [AB]: (.+)$/gm)
  ].map((m) => unquote(m[1]));
  const quiz = ETAP_3.steps.find((s) => s.control.type === 'quiz')!;
  expect(quiz.control.type === 'quiz' && quiz.control.options.map((o) => o.feedback)).toEqual(
   expected
  );
 });

 it('polecenia i reakcje na błąd', () => {
  const rows = rows3('Ćwiczenie');
  const tasks = ETAP_3.steps.filter(isTask3);
  expect(tasks.map((s) => s.text)).toEqual(rows.map((c) => c[1]));
  const reaction = (s: Step) => {
   if (s.view.type === 'sheet' && s.view.task?.kind === 'lines') return s.view.task.wrong;
   return wrongReaction(s);
  };
  expect(tasks.map(reaction)).toEqual(rows.map((c) => unquote(c.at(-1)!)));
 });

 it('ćwiczenie 2: reakcje na brakujące linijki', () => {
  const lines = ETAP_3.steps.filter(isTask3)[1].view;
  const task = lines.type === 'sheet' && lines.task?.kind === 'lines' ? lines.task : undefined;
  expect(task?.missingOne).toBe(
   quoteAfter('Ćwiczenie 2 – reakcja, gdy uczeń zaznaczy tylko L1 i L2')
  );
  expect(task?.missingMore).toBe(quoteAfter('Ćwiczenie 2 – reakcja, gdy brakuje więcej'));
 });

 it('notatki „Dla dociekliwych”', () => {
  const start = SCENARIO_3.indexOf('### Warstwa 3');
  const end = SCENARIO_3.indexOf('\n#', start + 4);
  const expected = SCENARIO_3.slice(start, end)
   .split(/\n- /)
   .slice(1)
   .map((item) => item.replace(/\s*\n\s*/g, ' ').trim())
   .map((item) => {
    const m = item.match(/^\*\*(.+?)\*\* (.+)$/)!;
    return { q: m[1], a: m[2] };
   });
  expect(ETAP_3.notes).toEqual(expected);
 });
});

// --- Warstwa 4: scenariusz-arkusz-4.md (wersja 2) ---

const SCENARIO_4 = readFileSync(new URL('../../scenariusz-arkusz-4.md', import.meta.url), 'utf8');

/** Notatki „Dla dociekliwych” z sekcji `### {heading}` scenariusza. */
function notesOf(text: string, heading: string): { q: string; a: string }[] {
 const start = text.indexOf(`### ${heading}`);
 const end = text.indexOf('\n#', start + 4);
 return text
  .slice(start, end)
  .split(/\n- /)
  .slice(1)
  .map((item) => item.replace(/\s*\n\s*/g, ' ').trim())
  .map((item) => {
   const m = item.match(/^\*\*(.+?)\*\* (.+)$/)!;
   return { q: m[1], a: m[2] };
  });
}

describe('warstwa 4 co do słowa ze scenariusza', () => {
 const isTask4 = (s: Step) => s.speaker === 'task';
 const tasks = ETAP_4.steps.filter(isTask4);

 it('pięć linijek arkusza (czyja i tekst)', () => {
  const view = ETAP_4.steps[0].view;
  const items = view.type === 'sheet' ? view.lines?.items : [];
  expect(items?.map((l) => [l.id, l.where, l.text])).toEqual(
   rows3('Linijki z arkusza', /^\| L\d /, SCENARIO_4).map((c) => [c[0], c[1], c[2]])
  );
 });

 it('scena', () => {
  const expected = rows3('Scena', undefined, SCENARIO_4).map(sceneLine);
  expect(ETAP_4.steps.filter((s) => !isTask4(s)).map((s) => s.text)).toEqual(expected);
 });

 it('zagadka: odpowiedzi i reakcje', () => {
  const quiz = ETAP_4.steps.find((s) => s.control.type === 'quiz')!;
  const options = quiz.control.type === 'quiz' ? quiz.control.options : [];
  const row = rows3('Scena', undefined, SCENARIO_4).find((c) => c[1] === '_zagadka_')!;
  expect(options.map((o) => o.text)).toEqual(row[2].split(/ (?=[AB]\) )/).slice(1));
  const start = SCENARIO_4.indexOf('Reakcje na zagadkę:');
  const reactions = [
   ...SCENARIO_4.slice(start, SCENARIO_4.indexOf('##', start)).matchAll(/^- [AB]: (.+)$/gm)
  ].map((m) => unquote(m[1]));
  expect(options.map((o) => o.feedback)).toEqual(reactions);
 });

 it('polecenia i reakcje na błąd', () => {
  const rows = rows3('Ćwiczenie', undefined, SCENARIO_4);
  expect(tasks.map((s) => s.text)).toEqual(rows.map((c) => c[1]));
  const reaction = (s: Step) =>
   s.view.type === 'sheet' && s.view.task?.kind === 'lines' ? s.view.task.wrong : wrongReaction(s);
  expect(tasks.map(reaction)).toEqual(rows.map((c) => unquote(c.at(-1)!)));
 });

 it('ćwiczenie 2: osobne reakcje (L3, brak L4, brak kilku)', () => {
  const view = tasks[1].view;
  const task = view.type === 'sheet' && view.task?.kind === 'lines' ? view.task : undefined;
  expect(task?.wrongBy?.L3).toBe(quoteAfter('reakcja, gdy uczeń zaznaczy L3', SCENARIO_4));
  expect(task?.missingOne).toBe(quoteAfter('reakcja, gdy uczeń pominie tylko L4', SCENARIO_4));
  expect(task?.missingMore).toBe(quoteAfter('reakcja, gdy brakuje więcej', SCENARIO_4));
 });

 it('ćwiczenie 3: odpowiedzi do wyboru', () => {
  const control = tasks[2].control;
  const options = control.type === 'task' ? (control.options ?? []) : [];
  const line = SCENARIO_4.match(/Odpowiedzi do zadania 3: (.+)/)![1];
  expect(options.map((o) => o.text)).toEqual(line.split(/ (?=[AB]\) )/));
 });

 it('notatki „Dla dociekliwych”', () => {
  expect(ETAP_4.notes).toEqual(notesOf(SCENARIO_4, 'Warstwa 4'));
 });
});

// --- Warstwa 5: scenariusz-arkusz-5.md (wersja 2) ---

const SCENARIO_5 = readFileSync(new URL('../../scenariusz-arkusz-5.md', import.meta.url), 'utf8');

describe('warstwa 5 co do słowa ze scenariusza', () => {
 const isTask5 = (s: Step) => s.speaker === 'task';
 const tasks = ETAP_5.steps.filter(isTask5);
 const optionsOf = (s: Step) => (s.control.type === 'task' ? (s.control.options ?? []) : []);

 it('pięć linijek arkusza (czyja i tekst)', () => {
  const view = ETAP_5.steps[0].view;
  const items = view.type === 'sheet' ? view.lines?.items : [];
  expect(items?.map((l) => [l.id, l.where, l.text])).toEqual(
   rows3('Linijki z arkusza', /^\| L\d /, SCENARIO_5).map((c) => [c[0], c[1], c[2]])
  );
 });

 it('scena', () => {
  const expected = rows3('Scena', undefined, SCENARIO_5).map(sceneLine);
  expect(ETAP_5.steps.filter((s) => !isTask5(s)).map((s) => s.text)).toEqual(expected);
 });

 it('zagadka: odpowiedzi i reakcje', () => {
  const quiz = ETAP_5.steps.find((s) => s.control.type === 'quiz')!;
  const options = quiz.control.type === 'quiz' ? quiz.control.options : [];
  const row = rows3('Scena', undefined, SCENARIO_5).find((c) => c[1] === '_zagadka_')!;
  expect(options.map((o) => o.text)).toEqual(row[2].split(/ (?=[AB]\) )/).slice(1));
  const start = SCENARIO_5.indexOf('Reakcje na zagadkę:');
  const reactions = [
   ...SCENARIO_5.slice(start, SCENARIO_5.indexOf('##', start)).matchAll(/^- [AB]: (.+)$/gm)
  ].map((m) => unquote(m[1]));
  expect(options.map((o) => o.feedback)).toEqual(reactions);
 });

 it('polecenia i reakcje na błąd (zadania 1, 2, 4)', () => {
  const rows = rows3('Ćwiczenie', undefined, SCENARIO_5);
  expect(tasks.map((s) => s.text)).toEqual(rows.map((c) => c[1]));
  const reaction = (s: Step) =>
   s.view.type === 'sheet' && s.view.task?.kind === 'lines' ? s.view.task.wrong : wrongReaction(s);
  for (const i of [0, 1, 3]) expect(reaction(tasks[i])).toBe(unquote(rows[i].at(-1)!));
 });

 it('ćwiczenie 2: reakcje na L5 i na brak L3', () => {
  const view = tasks[1].view;
  const task = view.type === 'sheet' && view.task?.kind === 'lines' ? view.task : undefined;
  expect(task?.wrongBy?.L5).toBe(quoteAfter('reakcja, gdy uczeń zaznaczy L5', SCENARIO_5));
  expect(task?.missingOne).toBe(quoteAfter('reakcja, gdy uczeń nie zaznaczy L3', SCENARIO_5));
 });

 it('ćwiczenie 3: hasła i reakcje', () => {
  const line = SCENARIO_5.match(/Odpowiedzi do zadania 3: ([^]*?)\n\n/)![1].replace(
   /\s*\n\s*/g,
   ' '
  );
  const expected = line.split(' · ').map((part) => {
   const m = part.match(/^(\S+\) \S+)(?: – reakcja: („.+”))?$/)!;
   return { text: m[1], feedback: m[2] ? unquote(m[2]) : undefined };
  });
  expect(optionsOf(tasks[2]).map((o) => ({ text: o.text, feedback: o.feedback }))).toEqual(
   expected
  );
 });

 it('ćwiczenie 4: odpowiedzi do wyboru', () => {
  const line = SCENARIO_5.match(/Odpowiedzi do zadania 4: (.+)/)![1];
  expect(optionsOf(tasks[3]).map((o) => o.text)).toEqual(line.split(/ (?=[AB]\) )/));
 });

 it('notatki „Dla dociekliwych”', () => {
  expect(ETAP_5.notes).toEqual(notesOf(SCENARIO_5, 'Warstwa 5'));
 });
});

// --- Warstwa 6: scenariusz-arkusz-6.md (wersja 2) ---

const SCENARIO_6 = readFileSync(new URL('../../scenariusz-arkusz-6.md', import.meta.url), 'utf8');

describe('warstwa 6 co do słowa ze scenariusza', () => {
 const isTask6 = (s: Step) => s.speaker === 'task';
 const tasks = ETAP_6.steps.filter(isTask6);
 const optionsOf = (s: Step) => (s.control.type === 'task' ? (s.control.options ?? []) : []);
 const answersOf = (n: number) =>
  SCENARIO_6.match(new RegExp(`Odpowiedzi do zadania ${n}: (.+)`))![1].split(/ (?=[AB]\) )/);

 it('linijki arkusza (czyja i tekst)', () => {
  const view = ETAP_6.steps[0].view;
  const items = view.type === 'sheet' ? view.lines?.items : [];
  expect(items?.map((l) => [l.id, l.where, l.text])).toEqual(
   rows3('Linijki z arkusza', /^\| L\d /, SCENARIO_6).map((c) => [c[0], c[1], c[2]])
  );
 });

 it('scena', () => {
  const expected = rows3('Scena', undefined, SCENARIO_6).map(sceneLine);
  expect(ETAP_6.steps.filter((s) => !isTask6(s)).map((s) => s.text)).toEqual(expected);
 });

 it('zagadka: odpowiedzi i reakcje', () => {
  const quiz = ETAP_6.steps.find((s) => s.control.type === 'quiz')!;
  const options = quiz.control.type === 'quiz' ? quiz.control.options : [];
  const row = rows3('Scena', undefined, SCENARIO_6).find((c) => c[1] === '_zagadka_')!;
  expect(options.map((o) => o.text)).toEqual(row[2].split(/ (?=[AB]\) )/).slice(1));
  const start = SCENARIO_6.indexOf('Reakcje na zagadkę:');
  const reactions = [
   ...SCENARIO_6.slice(start, SCENARIO_6.indexOf('##', start)).matchAll(/^- [AB]: (.+)$/gm)
  ].map((m) => unquote(m[1]));
  expect(options.map((o) => o.feedback)).toEqual(reactions);
 });

 it('polecenia i reakcje na błąd', () => {
  const rows = rows3('Ćwiczenie', undefined, SCENARIO_6);
  expect(tasks.map((s) => s.text)).toEqual(rows.map((c) => c[1]));
  const reaction = (s: Step) =>
   s.view.type === 'sheet' && s.view.task?.kind === 'lines' ? s.view.task.wrong : wrongReaction(s);
  expect(tasks.map(reaction)).toEqual(rows.map((c) => unquote(c.at(-1)!)));
 });

 it('ćwiczenie 2: brak L2 i brak kilku linijek', () => {
  const view = tasks[1].view;
  const task = view.type === 'sheet' && view.task?.kind === 'lines' ? view.task : undefined;
  expect(task?.missingOne).toBe(quoteAfter('reakcja, gdy uczeń pominie tylko L2', SCENARIO_6));
  expect(task?.missingMore).toBe(quoteAfter('reakcja, gdy brakuje więcej', SCENARIO_6));
 });

 it('odpowiedzi do zadań 1, 3 i 4', () => {
  expect(optionsOf(tasks[0]).map((o) => o.text)).toEqual(answersOf(1));
  expect(optionsOf(tasks[2]).map((o) => o.text)).toEqual(answersOf(3));
  expect(optionsOf(tasks[3]).map((o) => o.text)).toEqual(answersOf(4));
 });

 it('notatki „Dla dociekliwych”', () => {
  expect(ETAP_6.notes).toEqual(notesOf(SCENARIO_6, 'Warstwa 6'));
 });
});

// --- Wiersz „gdzie jest Kuba” (PYT-104a): kolumna „Kuba (pod)” w scenariuszach 3–5 ---

describe('Kuba stoi tam, gdzie mówi scenariusz', () => {
 const DEVICE: Record<string, string | undefined> = {
  '—': undefined,
  serwer: 'serwer',
  stacja: 'stacja',
  ruter: 'ruter',
  przełącznik: 'przelacznik'
 };
 it.each([
  ['3', ETAP_3, SCENARIO_3],
  ['4', ETAP_4, SCENARIO_4],
  ['5', ETAP_5, SCENARIO_5],
  ['6', ETAP_6, SCENARIO_6]
 ] as const)('warstwa %s', (_layer, exercise, scenario) => {
  const head = rows3('Scena', /^\| # /, scenario)[0];
  const col = head.indexOf('Kuba (pod)');
  expect(col).toBeGreaterThan(0);
  const expected = rows3('Scena', undefined, scenario).map((c) => DEVICE[c[col]]);
  const scene = exercise.steps.filter((s) => s.speaker !== 'task');
  expect(scene.map((s) => (s.view.type === 'sheet' ? s.view.kuba : 'x'))).toEqual(expected);
  for (const s of exercise.steps.filter((st) => st.speaker === 'task')) {
   expect(s.view.type === 'sheet' && s.view.kubaRow).toBe(false);
  }
 });

 it('strzałka „przeglądarka” wychodzi spod sylwetki Kuby', () => {
  for (const ex of ARKUSZ.exercises) {
   for (const s of ex.steps) {
    if (s.view.type !== 'sheet' || !s.view.browse) continue;
    expect(SHEET_CARDS[s.view.browse.from].device).toBe(s.view.kuba);
   }
  }
 });
});

describe('nazwy urządzeń jak w arkuszu', () => {
 const steps = ARKUSZ.exercises.flatMap((ex) => ex.steps);
 /** Kwestie Oli i Kuby – mowa potoczna (PYT-075b: „komputer” wolno tylko tu). */
 const spoken = steps.filter((s) => s.speaker === 'ola' || s.speaker === 'kuba').map((s) => s.text);
 const written: string[] = [
  ARKUSZ_FIGURE.alt,
  ARKUSZ_FIGURE.caption,
  ...ARKUSZ.exercises.flatMap((ex) => (ex.notes ?? []).flatMap((n) => [n.q, n.a]))
 ].concat(
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
    if (v.lines) out.push(v.lines.title, ...v.lines.items.map((l) => l.text));
    if (v.task?.kind === 'lines') out.push(v.task.wrong, v.task.missingOne, v.task.missingMore);
    if (v.reservation) out.push(v.reservation.device.name, v.reservation.example);
    if (v.youAreOn) out.push(v.youAreOn);
    if (v.dhcp) out.push(v.dhcp.label);
    if (v.browse) out.push(v.browse.label);
    if (v.bubble) out.push(v.bubble);
    if (v.asks) out.push(...v.asks.map((x) => x.label ?? ''));
    if (v.lines) out.push(...v.lines.items.map((l) => l.where ?? ''));
    if (v.task?.kind === 'lines' && v.task.wrongBy) out.push(...Object.values(v.task.wrongBy));
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
