import {
 firstThreeOctets,
 formatIp,
 lastOctet,
 maskOf,
 networkOf,
 octetBits,
 type Ip
} from '../../lib/ipv4';
import { fillText, plural, Rich } from '../text';

/** Zdania panelu bitów – z `content/`. */
export interface BitTexts {
 /** Wstęp nad tabelą. Pola: `{shared}`, `{mask}`; `**…**` = pogrubienie. */
 intro: string;
 /** Maska nie zabiera bitów z ostatniego oktetu. Pole: `{shared}`. */
 noNetBits: string;
 /** Pierwszy różny bit sieci. Pole: `{bit}`. */
 different: string;
 /** Wszystkie bity sieci takie same. Pola: `{count}`, `{bits}`. */
 same: string;
 /** Odmiana słowa „bit”: 1, 2–4, 5 i więcej. */
 bitForms: readonly [string, string, string];
}

interface BitRulerProps {
 srcLabel: string;
 srcIp: Ip;
 dstLabel: string;
 dstIp: Ip;
 /** Maska nadawcy. */
 prefix: number;
 texts: BitTexts;
}

/** Widok A: ostatni oktet w bitach. Bity sieci są kolorowe, różne bity sieci – czerwone. */
export function BitRuler({ srcLabel, srcIp, dstLabel, dstIp, prefix, texts }: BitRulerProps) {
 const netBits = prefix - 24; // ile bitów ostatniego oktetu należy do sieci
 const src = octetBits(lastOctet(srcIp));
 const dst = octetBits(lastOctet(dstIp));
 // Urządzenia biura różnią się tylko ostatnim oktetem – trzy pierwsze są wspólne.
 const shared = firstThreeOctets(srcIp);
 const firstDiff = src.findIndex((b, i) => i < netBits && b !== dst[i]);

 const rows: { name: string; value: number; compare?: boolean }[] = [
  { name: `IP: ${srcLabel}`, value: lastOctet(srcIp) },
  { name: `IP: ${dstLabel}`, value: lastOctet(dstIp), compare: true },
  { name: `Maska /${prefix}`, value: lastOctet(maskOf(prefix)) },
  { name: `Sieć: ${srcLabel}`, value: lastOctet(networkOf(srcIp, prefix)) },
  { name: `Sieć: ${dstLabel}`, value: lastOctet(networkOf(dstIp, prefix)), compare: true }
 ];

 let verdict: string;
 if (netBits === 0) {
  verdict = fillText(texts.noNetBits, { shared });
 } else if (firstDiff >= 0) {
  verdict = fillText(texts.different, { bit: firstDiff + 1 });
 } else {
  verdict = fillText(texts.same, { count: netBits, bits: plural(netBits, texts.bitForms) });
 }

 return (
  <section className="sim-panel">
   <h3>🔢 Bity: jak to liczy komputer</h3>
   <p className="sim-muted mk-small">
    <Rich text={fillText(texts.intro, { shared, mask: formatIp(maskOf(prefix)) })} />
   </p>
   <div className="mk-scroll">
    <table className="mk-bits">
     <tbody>
      {rows.map((row) => {
       const bits = octetBits(row.value);
       return (
        <tr key={row.name}>
         <th scope="row">{row.name}</th>
         {bits.map((bit, i) => {
          const isNet = i < netBits;
          const isDiff = row.compare && isNet && bit !== src[i];
          const cls = isDiff ? 'mk-bit mk-bit--diff' : isNet ? 'mk-bit mk-bit--net' : 'mk-bit';
          return (
           <td key={i} className={cls}>
            {bit}
           </td>
          );
         })}
         <td className="mk-bits__dec">.{row.value}</td>
        </tr>
       );
      })}
     </tbody>
    </table>
   </div>
   <p className="mk-small">
    <strong>Wynik:</strong> {verdict}
   </p>
  </section>
 );
}
