import { PERSON_BASE_URL } from '../environment';
import { fetchToJson } from './utils';

export const hentPerson = (fnr: string) => fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);

export const hentHarNivaa4 = (fnr: string) => fetchToJson(`${PERSON_BASE_URL}/person/${fnr}/harNivaa4`);
