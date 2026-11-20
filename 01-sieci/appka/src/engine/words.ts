/** Limit słów w tekście kroku/lekcji (kryterium akceptacji z audytu, audyt.md rozdz. 7). */
export const MAX_STEP_WORDS = 40;

/** Limit słów jednej kwestii w stylu „rozmowa”: jedna myśl na oddech (scenariusze Laboratorium VLAN). */
export const MAX_LINE_WORDS = 12;

/** Liczy słowa; same znaki „–”, „→” itp. nie są słowami. */
export function countWords(text: string): number {
 return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
