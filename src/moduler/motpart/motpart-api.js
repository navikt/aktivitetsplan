import { PERSON_BASE_URL } from '../../environment';
import { fetchToJson } from '../../ducks/utils';

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export function hentHarNivaa4(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}/harNivaa4`);
}

export default {};
