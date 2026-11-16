import { blockSize, broadcastOf, lastOctet, networkOf } from '../../lib/ipv4';
import { nameOf } from '../../model/glossary';
import { deviceIp } from '../../model/siec';
import { FenceLine, type FenceLineProps } from '../views/FenceLine';

/** Widok B: „ulica” adresów .0–.255 z płotami co rozmiar bloku. */
export function AddressLine({ src, dst, prefix, pins }: FenceLineProps) {
 const block = blockSize(prefix);
 const srcIp = deviceIp(src);
 const dstIp = deviceIp(dst);
 const srcStart = lastOctet(networkOf(srcIp, prefix));
 const dstStart = lastOctet(networkOf(dstIp, prefix));
 const srcLabel = nameOf(src);

 return (
  <section className="sim-panel">
   <h3>🏘️ Ulica adresów: gdzie stoją płoty</h3>
   <FenceLine src={src} dst={dst} prefix={prefix} pins={pins} />

   <table className="sim-table mk-small">
    <tbody>
     <tr>
      <th scope="row">Rozmiar bloku</th>
      <td>
       2<sup>32−{prefix}</sup> = <strong>{block}</strong> adresów → płot co {block}
      </td>
     </tr>
     <tr>
      <th scope="row">Działka: {srcLabel}</th>
      <td>
       <span className="mk-swatch mk-swatch--src" /> .{srcStart} – .
       {lastOctet(broadcastOf(srcIp, prefix))} (adres sieci .{srcStart}, Broadcast .
       {lastOctet(broadcastOf(srcIp, prefix))})
      </td>
     </tr>
     {dstStart !== srcStart && (
      <tr>
       <th scope="row">Działka: {nameOf(dst)}</th>
       <td>
        <span className="mk-swatch mk-swatch--dst" /> .{dstStart} – .
        {lastOctet(broadcastOf(dstIp, prefix))} – za płotem
       </td>
      </tr>
     )}
    </tbody>
   </table>
  </section>
 );
}
