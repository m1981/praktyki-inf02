import { firstThreeOctets, parseIp } from '../../lib/ipv4';

export interface CompareRow {
 label: string;
 ip: string;
}

/** Scena „moja sieć czy inna?”: pierwszy wiersz to wzór, kolejne odsłaniamy po jednym. */
export interface CompareSpec {
 type: 'compare';
 rows: readonly CompareRow[];
 /** Ile adresów (poza wzorem) już odsłonięto. */
 revealed: number;
}

/** Numer sieci przy masce /24 jako tekst: pierwsze trzy liczby adresu. */
const netOf = (ip: string) => firstThreeOctets(parseIp(ip));
const hostOf = (ip: string) => `.${ip.split('.')[3]}`;

/** Numer sieci (3 pierwsze liczby przy /24) obok części hosta. */
export function CompareView({ spec }: { spec: CompareSpec }) {
 const [reference, ...others] = spec.rows;
 const { revealed } = spec;
 return (
  <div className="sr-board">
   <table className="sr-compare">
    <thead>
     <tr>
      <th scope="col">Urządzenie</th>
      <th scope="col">numer sieci</th>
      <th scope="col">host</th>
      <th scope="col">wynik</th>
     </tr>
    </thead>
    <tbody>
     <tr className="sr-compare__ref">
      <th scope="row">{reference.label}</th>
      <td className="sr-net">{netOf(reference.ip)}</td>
      <td className="sr-host">{hostOf(reference.ip)}</td>
      <td>(wzór)</td>
     </tr>
     {others.map((row, i) => {
      const shown = i < revealed;
      const same = netOf(row.ip) === netOf(reference.ip);
      return (
       <tr key={row.label} className={i === revealed - 1 ? 'sr-compare__new' : undefined}>
        <th scope="row">{shown ? row.label : '?'}</th>
        <td className="sr-net">{shown ? netOf(row.ip) : ''}</td>
        <td className="sr-host">{shown ? hostOf(row.ip) : ''}</td>
        <td>{shown ? (same ? '✅ ta sama sieć' : '❌ inna sieć') : ''}</td>
       </tr>
      );
     })}
    </tbody>
   </table>
  </div>
 );
}
