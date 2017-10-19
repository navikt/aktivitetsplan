import { VEILEDER_BASE_URL } from '~config'; //eslint-disable-line
import { fetchToJson } from '../../../ducks/utils';

export default function hentVeieldereForEnhet(enhetid) {
    return fetchToJson(`${VEILEDER_BASE_URL}/enhet/${enhetid}/veiledere`);
}
