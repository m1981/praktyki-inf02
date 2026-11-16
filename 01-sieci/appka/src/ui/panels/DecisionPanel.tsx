import { broadcastOf, formatIp, lastOctet } from '../../lib/ipv4';
import { genitiveOf, nameOf } from '../../model/glossary';
import { deviceIp } from '../../model/siec';
import { GATEWAY, type Decision, type Outcome } from '../../net/mask';
import { fillNodes, fillText } from '../text';

/** Zdania panelu decyzji – z `content/`. Pola: `{dst}`, `{gateway}`, `{src}`. */
export interface DecisionTexts {
 /** Werdykt dla każdego wyniku decyzji. */
 verdict: Record<Outcome, string>;
 /** Faza „Z powrotem”, gdy zapytanie nie wyszło z Laptopa. */
 noReply: string;
}

interface DecisionPanelProps {
 decision: Decision;
 texts: DecisionTexts;
 /** Faza „Z powrotem”, gdy zapytanie nie wyszło z Laptopa. */
 noReply: boolean;
}

/** Decyzja nadawcy krok po kroku – to samo, co „myśli” karta sieciowa przed wysłaniem ramki. */
export function DecisionPanel({ decision: d, texts, noReply }: DecisionPanelProps) {
 const src = { label: nameOf(d.src), ip: deviceIp(d.src) };
 const dst = { label: nameOf(d.dst), ip: deviceIp(d.dst) };
 const local = d.outcome === 'direct';

 const verdict = fillText(texts.verdict[d.outcome], {
  dst: dst.label,
  gateway: formatIp(d.gateway)
 });

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
     {fillNodes(texts.noReply, { src: src.label })}
    </p>
   ) : (
    <p className={`mk-verdict mk-verdict--${d.outcome}`}>{verdict}</p>
   )}
  </section>
 );
}
