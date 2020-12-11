import { VEILARBLEST_BASE_URL } from '../environment';
import { fetchToJson, putAsJson } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function hentSisteLest() {
    return fetchToJson(`${VEILARBLEST_BASE_URL}/aktivitetsplan/les`);
}

export function lesInformasjon(versjon) {
    return putAsJson(`${VEILARBLEST_BASE_URL}/informasjon/les?versjon=${versjon}`);
}
