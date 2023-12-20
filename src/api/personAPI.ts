import { HarLoggetInnRespons, RegoppslagDto } from '../datatypes/types';
import { PERSON_BASE_URL } from '../environment';
import { fetchToJson, fetchToJsonPlain } from './utils';

export const hentPerson = (fnr: string) => fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person?fnr=${fnr}`);

export const hentAdresse = (fnr: string): Promise<RegoppslagDto> =>
    fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person/postadresse?fnr=${fnr}`);

export const hentHarNivaa4 = (fnr: string): Promise<HarLoggetInnRespons> =>
    fetchToJson(fnr, `${PERSON_BASE_URL}/person/${fnr}/harNivaa4`);
