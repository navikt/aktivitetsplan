import { API_BASE_URL, VEILEDER_BASE_URL } from '~config'; // eslint-disable-line

import { fetchToJson } from './../ducks/utils';

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}
