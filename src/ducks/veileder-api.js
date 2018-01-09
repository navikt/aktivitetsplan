import { VEILEDER_BASE_URL } from '../environment';
import { fetchToJson } from './../ducks/utils';

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}

export default {};
