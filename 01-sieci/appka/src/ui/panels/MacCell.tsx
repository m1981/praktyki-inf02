import { GLOSSARY } from '../../model/glossary';
import { deviceByMac } from '../../model/siec';
import { BROADCAST_MAC } from '../../net/frame';

/** Nazwa urządzenia dla adresu MAC – do podpisów w tabelach. */
function macOwner(mac: string): string | undefined {
 if (mac === BROADCAST_MAC) return 'Broadcast – do wszystkich';
 const owner = deviceByMac(mac);
 return owner && GLOSSARY[owner.kind].nom;
}

/** Adres MAC z dopiskiem, czyj to adres. */
export function MacCell({ mac }: { mac: string }) {
 const owner = macOwner(mac);
 return (
  <>
   <code>{mac}</code>
   {owner && <span className="sim-muted"> ({owner})</span>}
  </>
 );
}
