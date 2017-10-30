import { AKTIVITET_PROXY_BASE_URL } from '../../environment';
import { fetchToJson } from './../../ducks/utils';

export default function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/etiketter`);
}
