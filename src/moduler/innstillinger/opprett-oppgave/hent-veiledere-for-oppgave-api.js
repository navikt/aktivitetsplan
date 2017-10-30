import { VEILEDER_BASE_URL } from '~config'; //eslint-disable-line
import { fetchToJson } from '../../../ducks/utils';

export function hentVeieldereForEnhet(enhetid) {
    return fetchToJson(`${VEILEDER_BASE_URL}/enhet/${enhetid}/veiledere`);
}

export default {};
