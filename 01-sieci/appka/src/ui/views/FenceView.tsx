import { FenceLine, type FenceLineProps } from './FenceLine';

/** Scena „płot na ulicy”: sama oś adresów z płotami dla podanej maski. */
export interface FenceSpec extends FenceLineProps {
 type: 'fence';
}

export function FenceView({ spec }: { spec: FenceSpec }) {
 return (
  <div className="sr-board">
   <FenceLine src={spec.src} dst={spec.dst} prefix={spec.prefix} pins={spec.pins} />
  </div>
 );
}
