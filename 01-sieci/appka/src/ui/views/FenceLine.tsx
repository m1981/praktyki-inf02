import { blockSize, lastOctet, networkOf } from '../../lib/ipv4';
import { nameOf, shortNameOf } from '../../model/glossary';
import { deviceIp, type DeviceId } from '../../model/siec';

/** Urządzenie zaznaczone na osi adresów. */
export interface Pin {
 id: DeviceId;
 /** Etykiety na zmianę nad i pod osią, żeby się nie nachodziły na telefonie. */
 row: 'above' | 'below';
}

export interface FenceLineProps {
 src: DeviceId;
 dst: DeviceId;
 /** Maska nadawcy – to ON stawia płoty. */
 prefix: number;
 pins: readonly Pin[];
}

const pct = (octet: number) => `${(octet / 256) * 100}%`;

/** Oś adresów .0–.255 z płotami i działkami. Nowy płot „wyrasta” (animacja CSS). */
export function FenceLine({ src, dst, prefix, pins }: FenceLineProps) {
 const block = blockSize(prefix);
 const srcStart = lastOctet(networkOf(deviceIp(src), prefix));
 const dstStart = lastOctet(networkOf(deviceIp(dst), prefix));
 const fences = Array.from({ length: 256 / block + 1 }, (_, i) => i * block);
 const srcLabel = nameOf(src);

 return (
  <div className="mk-line" role="img" aria-label={`Oś adresów od .0 do .255 z płotami co ${block}`}>
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
    {pins.map((pin) => {
     const octet = lastOctet(deviceIp(pin.id));
     const edge = octet < 26 ? 'start' : octet > 230 ? 'end' : 'mid';
     const active = pin.id === src || pin.id === dst;
     return (
      <div
       key={pin.id}
       className={`mk-pin mk-pin--${pin.row} mk-pin--${edge}${active ? ' mk-pin--active' : ''}`}
       style={{ left: pct(octet + 0.5) }}
      >
       <span className="mk-pin__label">
        {shortNameOf(pin.id)} .{octet}
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
 );
}
