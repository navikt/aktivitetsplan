import { RegoppslagDto } from '../datatypes/types';
import { PERSON_BASE_URL } from '../environment';
import { fetchToJsonPlain } from './utils';

export const hentPerson = (fnr: string) => fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person?fnr=${fnr}`);

export const hentAdresse = (fnr: string): Promise<RegoppslagDto> =>
    fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person/postadresse?fnr=${fnr}`);
