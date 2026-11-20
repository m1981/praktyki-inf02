// Nazwy urządzeń ze Słownika pojęć – jedyne miejsce, w którym są wpisane.
// Kod bierze stąd etykiety kart, podpisy ramek („do Drukarki”) i wiersze tabel.
// Zdania dla ucznia (teksty kroków) piszemy normalnie, ale tylko tymi nazwami (audyt.md, kryt. 12).

import { device, type DeviceId, type DeviceKind } from './siec';

interface Name {
 /** Mianownik: „Serwer NAS”. */
 nom: string;
 /** Dopełniacz: „MAC Serwera NAS”, „do Serwera NAS”. */
 gen: string;
 /** Krótka forma tam, gdzie brakuje miejsca (oś adresów). Domyślnie mianownik. */
 short?: string;
}

export const GLOSSARY: Record<DeviceKind, Name> = {
 laptop: { nom: 'Laptop', gen: 'Laptopa' },
 switch: { nom: 'Switch', gen: 'Switcha' },
 router: { nom: 'Router (Brama)', gen: 'Routera', short: 'Router' },
 nas: { nom: 'Serwer NAS', gen: 'Serwera NAS', short: 'NAS' },
 printer: { nom: 'Drukarka', gen: 'Drukarki' },
 camera: { nom: 'Kamera', gen: 'Kamery' },
 server: { nom: 'Serwer WWW', gen: 'Serwera WWW' }
};

export const nameOf = (id: DeviceId): string => GLOSSARY[device(id).kind].nom;
export const genitiveOf = (id: DeviceId): string => GLOSSARY[device(id).kind].gen;
export const shortNameOf = (id: DeviceId): string => {
 const name = GLOSSARY[device(id).kind];
 return name.short ?? name.nom;
};
