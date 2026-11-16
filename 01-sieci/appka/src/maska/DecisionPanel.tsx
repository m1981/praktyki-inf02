import { genitiveOf } from '../model/glossary';
import { broadcastOf, formatIp, lastOctet } from '../net/ipMath';
import { GATEWAY, HOSTS, type Decision } from './network';

interface DecisionPanelProps {
 decision: Decision;
 /** Faza „Z powrotem”, gdy zapytanie nie wyszło z Laptopa. */
 noReply: boolean;
}

/** Decyzja nadawcy krok po kroku – to samo, co „myśli” karta sieciowa przed wysłaniem ramki. */
export function DecisionPanel({ decision: d, noReply }: DecisionPanelProps) {
 const src = HOSTS[d.src];
 const dst = HOSTS[d.dst];
 const local = d.outcome === 'direct';

 const verdict = {
  direct: `${dst.label} jest w mojej sieci → wysyłam ramkę bezpośrednio, przez sam Switch.`,
  'via-router': `${dst.label} jest poza moją siecią → oddaję ramkę bramie (Routerowi). Oba urządzenia wiszą na tym samym Switchu, a mimo to ramka robi objazd.`,
  'gateway-outside': `${dst.label} jest poza moją siecią, a moja brama ${formatIp(d.gateway)} też jest poza nią → nie mam komu oddać ramki. Nic nie wychodzi z karty sieciowej.`
 }[d.outcome];

 return (
  <section className="sim-panel">
   <h3>🧠 Decyzja nadawcy: {src.label}</h3>
   <table className="sim-table">
    <tbody>
     <tr>
      <th scope="row">Nadawca</th>
      <td>
       {src.label} <code>{`${formatIp(src.ip)}/${d.prefix}`}</code>
      </td>
     </tr>
     <tr>
      <th scope="row">Moja sieć</th>
      <td>
       <code>{formatIp(d.srcNet)}</code>{' '}
       <span className="sim-muted">
        (.{lastOctet(d.srcNet)}–.{lastOctet(broadcastOf(d.srcNet, d.prefix))})
       </span>
      </td>
     </tr>
     <tr>
      <th scope="row">Cel</th>
      <td>
       {dst.label} <code>{formatIp(dst.ip)}</code>
      </td>
     </tr>
     <tr>
      <th scope="row">Sieć celu (liczona moją maską)</th>
      <td>
       <code>{formatIp(d.dstNet)}</code>
      </td>
     </tr>
     <tr>
      <th scope="row">Wynik</th>
      <td>{local ? '✅ ta sama sieć' : '❌ inna sieć'}</td>
     </tr>
     {!local && (
      <tr>
       <th scope="row">Moja brama</th>
       <td>
        <code>{formatIp(d.gateway)}</code>{' '}
        {d.gatewayInside ? '✅ w mojej sieci' : '⛔ poza moją siecią'}
       </td>
      </tr>
     )}
     <tr>
      <th scope="row">ARP pyta o</th>
      <td>
       {local
        ? `MAC ${genitiveOf(d.dst)}`
        : d.gatewayInside
          ? `MAC ${genitiveOf(GATEWAY)}`
          : '— (nie ma kogo zapytać)'}
      </td>
     </tr>
    </tbody>
   </table>
   {noReply ? (
    <p className="mk-verdict mk-verdict--gateway-outside">
     Brak odpowiedzi: zapytanie w ogóle nie wyszło z Laptopa (zobacz kierunek „Tam”). Pokazujemy
     tylko, co zrobiłby {src.label}.
    </p>
   ) : (
    <p className={`mk-verdict mk-verdict--${d.outcome}`}>{verdict}</p>
   )}
  </section>
 );
}
