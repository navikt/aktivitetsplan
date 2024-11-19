import { postAsJson } from './utils';
import { MODIA_CONTEXT_BASE_URL, VEILARBLEST_BASE_URL } from '../environment';

export const lastAltPaaNyttMedNyBruker = (fnr: string): Promise<void> => postAsJson(`${MODIA_CONTEXT_BASE_URL}/context`, {eventType: "NY_AKTIV_BRUKER", verdi: fnr});
