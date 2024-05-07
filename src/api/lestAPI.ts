import { Lest } from '../datatypes/lestTypes';
import { VEILARBLEST_BASE_URL } from '../environment';
import { postAsJson, putAsJson } from './utils';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';

export const fetchSisteLest = (): Promise<Lest[]> => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return postAsJson(`${VEILARBLEST_BASE_URL}/aktivitetsplan/les`, { fnr });
};

export const postLest = (versjon: string): Promise<void> =>
    putAsJson(`${VEILARBLEST_BASE_URL}/informasjon/les?versjon=${versjon}`);
