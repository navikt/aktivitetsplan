import { PERSON_BASE_URL } from '~config'; //eslint-disable-line
import { fetchToJson } from '../../ducks/utils';

export default function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}
