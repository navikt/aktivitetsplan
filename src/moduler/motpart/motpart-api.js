import { PERSON_BASE_URL } from '../../environment';
import { fetchToJson } from '../../ducks/utils';

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export default {};
