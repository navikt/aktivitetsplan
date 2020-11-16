import { fetchToJson, putAsJson } from '../../ducks/utils';
import { VEILARBLEST_BASE_URL } from '../../environment';

// eslint-disable-next-line import/prefer-default-export
export function hentSisteLest() {
    return fetchToJson(`${VEILARBLEST_BASE_URL}/aktivitetsplan/les`);
}

export function lesInformasjon(versjon) {
    return putAsJson(`${VEILARBLEST_BASE_URL}/informasjon/les?versjon=${versjon}`);
}
