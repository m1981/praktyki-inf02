import {
 firstThreeOctets,
 formatIp,
 lastOctet,
 maskOf,
 networkOf,
 octetBits,
 type Ip
} from '../net/ipMath';

interface BitRulerProps {
 srcLabel: string;
 srcIp: Ip;
 dstLabel: string;
 dstIp: Ip;
 /** Maska nadawcy. */
 prefix: number;
}

function bitsWord(n: number): string {
 if (n === 1) return 'bit';
 if (n >= 2 && n <= 4) return 'bity';
 return 'bitów';
}

/** Widok A: ostatni oktet w bitach. Bity sieci są kolorowe, różne bity sieci – czerwone. */
export function BitRuler({ srcLabel, srcIp, dstLabel, dstIp, prefix }: BitRulerProps) {
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
  verdict = `Maska /24 nie zabiera żadnego bitu z ostatniego oktetu. Liczą się tylko pierwsze 3 oktety (${shared}), a te są takie same → ta sama sieć.`;
 } else if (firstDiff >= 0) {
  verdict = `Bit nr ${firstDiff + 1} ostatniego oktetu jest różny (czerwony) → różne sieci.`;
 } else {
  verdict = `Wszystkie ${netBits} ${bitsWord(netBits)} sieci w ostatnim oktecie są takie same → ta sama sieć.`;
 }

 return (
  <section className="sim-panel">
   <h3>🔢 Bity: jak to liczy komputer</h3>
   <p className="sim-muted mk-small">
    {/* Jeden napis, a nie trzy kawałki: przeglądarka składa wtedy tekst tak samo jak przed zmianą. */}
    {`Pierwsze 3 oktety (${shared}) są takie same u wszystkich i w całości należą do sieci. Pokazujemy tylko ostatni oktet. Maska `}
    <strong>{formatIp(maskOf(prefix))}</strong>: jedynki = bity sieci (kolorowe), zera = bity hosta
    (szare).
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
