// Droga ramki po kablach. Liczymy ją z listy kabli, więc ramka nie może „przeskoczyć”
// między urządzeniami, których nic nie łączy.

export interface Wire<Id extends string> {
 a: Id;
 b: Id;
}

export interface Hop<Id extends string> {
 from: Id;
 to: Id;
 /** Numer skoku od nadawcy (0 = pierwszy kabel). */
 hop: number;
 /** Urządzenie, do którego ramka jest adresowana na tym odcinku (odbiorca MAC). */
 toward: Id;
}

function neighbours<Id extends string>(wires: readonly Wire<Id>[], of: Id): Id[] {
 return wires.flatMap((w) => (w.a === of ? [w.b] : w.b === of ? [w.a] : []));
}

/** Najkrótsza droga po kablach: lista urządzeń od `from` do `to` (przeszukiwanie wszerz). */
export function shortestPath<Id extends string>(
 wires: readonly Wire<Id>[],
 from: Id,
 to: Id
): Id[] {
 const previous = new Map<Id, Id>();
 const queue: Id[] = [from];
 for (const current of queue) {
  if (current === to) break;
  for (const next of neighbours(wires, current)) {
   if (next !== from && !previous.has(next)) {
    previous.set(next, current);
    queue.push(next);
   }
  }
 }
 if (from !== to && !previous.has(to)) {
  throw new Error(`Brak drogi po kablach między ${from} a ${to}.`);
 }
 const path: Id[] = [to];
 while (path[0] !== from) path.unshift(previous.get(path[0])!);
 return path;
}

/**
 * Droga ramki Unicast od `src` do `dst`. Z `via` (brama) ramka jedzie najpierw do bramy,
 * a dopiero brama przekazuje ją do celu – nawet gdy oba urządzenia wiszą na jednym Switchu.
 */
export function framePath<Id extends string>(
 wires: readonly Wire<Id>[],
 src: Id,
 dst: Id,
 via?: Id
): Hop<Id>[] {
 const stops = via === undefined ? [src, dst] : [src, via, dst];
 const hops: Hop<Id>[] = [];
 for (let leg = 0; leg + 1 < stops.length; leg++) {
  const path = shortestPath(wires, stops[leg], stops[leg + 1]);
  for (let i = 0; i + 1 < path.length; i++) {
   hops.push({ from: path[i], to: path[i + 1], hop: hops.length, toward: stops[leg + 1] });
  }
 }
 return hops;
}

/**
 * Droga ramki Broadcast: kopia idzie coraz dalej od nadawcy, ale dalej rozsyłają ją tylko urządzenia,
 * dla których `forwards` zwraca prawdę (Switche). Router i urządzenia końcowe ją odbierają i na tym
 * koniec – Broadcast nie przechodzi przez Router do innej sieci.
 * Kable w tej samej odległości od nadawcy mają ten sam numer skoku (lecą jednocześnie).
 */
export function floodPath<Id extends string>(
 wires: readonly Wire<Id>[],
 src: Id,
 forwards: (device: Id) => boolean
): Hop<Id>[] {
 const depth = new Map<Id, number>([[src, 0]]);
 const queue: Id[] = [src];
 const hops: Hop<Id>[] = [];
 for (const current of queue) {
  if (current !== src && !forwards(current)) continue;
  for (const next of neighbours(wires, current)) {
   if (depth.has(next)) continue;
   depth.set(next, depth.get(current)! + 1);
   queue.push(next);
   hops.push({ from: current, to: next, hop: depth.get(current)!, toward: next });
  }
 }
 return hops;
}
