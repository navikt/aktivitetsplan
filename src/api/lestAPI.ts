import { Lest } from '../datatypes/lestTypes';
import { VEILARBLEST_BASE_URL } from '../environment';
import { fetchToJson, putAsJson } from './utils';

export const fetchSisteLest = (fnr: string | undefined): Promise<Lest[]> =>
    fetchToJson(fnr, `${VEILARBLEST_BASE_URL}/aktivitetsplan/les`);

export const postLest = (versjon: string, fnr: string | undefined): Promise<void> =>
    putAsJson(fnr, `${VEILARBLEST_BASE_URL}/informasjon/les?versjon=${versjon}`);
