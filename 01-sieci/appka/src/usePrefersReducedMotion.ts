import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
 const mql = window.matchMedia(QUERY);
 mql.addEventListener('change', onChange);
 return () => mql.removeEventListener('change', onChange);
}

/** true, gdy użytkownik włączył w systemie „ogranicz animacje”. */
export function usePrefersReducedMotion(): boolean {
 return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches);
}
