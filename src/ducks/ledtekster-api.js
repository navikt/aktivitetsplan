import { API_BASE_URL } from '~config'; // eslint-disable-line

import { fetchToJson } from './../ducks/utils';

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export default {};
