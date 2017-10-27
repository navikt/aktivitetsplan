import { VEILEDER_BASE_URL } from '~config'; // eslint-disable-line

import { fetchToJson } from './../ducks/utils';

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}


export default {};
