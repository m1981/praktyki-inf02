import { blockSize, broadcastOf, lastOctet, networkOf, type Ip } from './ipMath';
import { HOSTS, ROUTER_IP, type HostId } from './network';

interface AddressLineProps {
 src: HostId;
 dst: HostId;
 /** Maska nadawcy – to ON stawia płoty. */
 prefix: number;
}

interface Pin {
 id: string;
 label: string;
 ip: Ip;
 /** Etykiety na zmianę nad i pod osią, żeby się nie nachodziły na telefonie. */
 row: 'above' | 'below';
}

const PINS: Pin[] = [
 { id: 'router', label: 'Router', ip: ROUTER_IP, row: 'above' },
 { id: 'nas', label: 'NAS', ip: HOSTS.nas.ip, row: 'below' },
 { id: 'laptop', label: 'Laptop', ip: HOSTS.laptop.ip, row: 'above' },
 { id: 'printer', label: 'Drukarka', ip: HOSTS.printer.ip, row: 'below' },
 { id: 'camera', label: 'Kamera', ip: HOSTS.camera.ip, row: 'above' }
];

const pct = (octet: number) => `${(octet / 256) * 100}%`;

/** Widok B: „ulica” adresów .0–.255 z płotami co rozmiar bloku. */
export function AddressLine({ src, dst, prefix }: AddressLineProps) {
 const block = blockSize(prefix);
 const srcIp = HOSTS[src].ip;
 const dstIp = HOSTS[dst].ip;
 const srcStart = lastOctet(networkOf(srcIp, prefix));
 const dstStart = lastOctet(networkOf(dstIp, prefix));
 const fences = Array.from({ length: 256 / block + 1 }, (_, i) => i * block);
 const srcLabel = HOSTS[src].label;

 return (
  <section className="sim-panel">
   <h3>🏘️ Ulica adresów: gdzie stoją płoty</h3>
   <div
    className="mk-line"
    role="img"
    aria-label={`Oś adresów od .0 do .255 z płotami co ${block}`}
   >
    <div className="mk-track">
     <div
      className="mk-block mk-block--src"
      style={{ left: pct(srcStart), width: pct(block) }}
      title={`Sieć: ${srcLabel}`}
     />
     {dstStart !== srcStart && (
      <div className="mk-block mk-block--dst" style={{ left: pct(dstStart), width: pct(block) }} />
     )}
     {fences.map((f) => (
      <div key={f} className="mk-fence" style={{ left: pct(f) }} />
     ))}
     {PINS.map((pin) => {
      const octet = lastOctet(pin.ip);
      const edge = octet < 26 ? 'start' : octet > 230 ? 'end' : 'mid';
      const active = pin.id === src || pin.id === dst;
      return (
       <div
        key={pin.id}
        className={`mk-pin mk-pin--${pin.row} mk-pin--${edge}${active ? ' mk-pin--active' : ''}`}
        style={{ left: pct(octet + 0.5) }}
       >
        <span className="mk-pin__label">
         {pin.label} .{octet}
        </span>
       </div>
      );
     })}
    </div>
    <div className="mk-scale">
     {block >= 32 ? (
      fences.slice(0, -1).map((f) => (
       <span key={f} style={{ left: pct(f) }}>
        .{f}
       </span>
      ))
     ) : (
      <>
       <span style={{ left: '0%' }}>.0</span>
       <span style={{ left: '100%' }}>.255</span>
      </>
     )}
    </div>
   </div>

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
       <th scope="row">Działka: {HOSTS[dst].label}</th>
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
