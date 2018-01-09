import { AKTIVITET_BASE_URL } from '../../environment';
import { fetchToJson } from './../../ducks/utils';

export default function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/etiketter`);
}
