import { Lest } from '../datatypes/lestTypes';
import { VEILARBLEST_BASE_URL } from '../environment';
import { fetchToJson, putAsJson } from './utils';

export const fetchSisteLest = (): Promise<Lest> => fetchToJson(`${VEILARBLEST_BASE_URL}/aktivitetsplan/les`);

export const postLest = (versjon: string): Promise<void> =>
    putAsJson(`${VEILARBLEST_BASE_URL}/informasjon/les?versjon=${versjon}`);
