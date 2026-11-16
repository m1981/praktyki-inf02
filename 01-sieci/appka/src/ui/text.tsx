// Teksty z `content/` to zwykłe napisy z miejscami do wypełnienia: „{dst} jest w mojej sieci”.
// Dzięki temu redakcja zdania nie wymaga czytania kodu (PYT-022a), a kod nie zawiera zdań.

import { Fragment, type ReactNode } from 'react';

type Values = Record<string, string | number>;

const SLOT = /\{(\w+)\}/g;

function valueOf(values: Values, name: string): string {
 if (!(name in values)) throw new Error(`Tekst ma pole {${name}}, którego kod nie wypełnia.`);
 return String(values[name]);
}

/** Wypełnia pola `{nazwa}` i zwraca jeden napis. */
export function fillText(template: string, values: Values): string {
 return template.replace(SLOT, (_, name: string) => valueOf(values, name));
}

/**
 * Wypełnia pola `{nazwa}` i zwraca osobne kawałki: tekst, wartość, tekst… Na ekranie wygląda to tak
 * samo jak `fillText`; różni się tylko podziałem na węzły tekstu (zgodnym z ekranem sprzed refaktoru).
 */
export function fillNodes(template: string, values: Values): ReactNode {
 return template
  .split(SLOT)
  .map((part, i) => <Fragment key={i}>{i % 2 === 1 ? valueOf(values, part) : part}</Fragment>);
}

/** Pokazuje napis, w którym `**tekst**` oznacza pogrubienie. */
export function Rich({ text }: { text: string }) {
 return text
  .split('**')
  .map((part, i) =>
   i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

/** Polska liczba mnoga: [1 bit, 2–4 bity, 5+ bitów]. */
export function plural(n: number, forms: readonly [string, string, string]): string {
 if (n === 1) return forms[0];
 return n >= 2 && n <= 4 ? forms[1] : forms[2];
}
