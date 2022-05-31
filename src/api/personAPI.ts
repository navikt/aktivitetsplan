import { PERSON_BASE_URL } from '../environment';
import { fetchToJson, fetchToJsonPlain } from './utils';

export const hentPerson = (fnr: string) => fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person?fnr=${fnr}`);

export const hentHarNivaa4 = (fnr: string) => fetchToJson(`${PERSON_BASE_URL}/person/${fnr}/harNivaa4`);
