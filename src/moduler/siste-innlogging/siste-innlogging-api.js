import { VEILARBLEST_BASE_URL } from '../../environment';
import { fetchToJson } from '../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function hentSisteInnlogging() {
    return fetchToJson(`${VEILARBLEST_BASE_URL}/aktivitetsplan/les`);
}
