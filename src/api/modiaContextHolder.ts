import { postAsJson } from './utils';
import { MODIA_CONTEXT_BASE_URL } from '../environment';
import { ER_INTERN_FLATE } from '../constant';

export const lastAltPaaNyttMedNyBruker = async (fnr: string): Promise<void> => {
    if (!ER_INTERN_FLATE) return;
    return postAsJson(`${MODIA_CONTEXT_BASE_URL}/context`, { eventType: 'NY_AKTIV_BRUKER', verdi: fnr });
};
