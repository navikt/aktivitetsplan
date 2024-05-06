import { HarLoggetInnRespons, RegoppslagDto } from '../datatypes/types';
import { PERSON_BASE_URL } from '../environment';
import { fetchToJson, fetchToJsonPlain, postAsJson } from './utils';

export const hentPerson = (fnr: string) => fetchToJsonPlain(`${PERSON_BASE_URL}/v2/person?fnr=${fnr}`);

export const hentAdresse = (fnr: string): Promise<RegoppslagDto> =>
    postAsJson(`${PERSON_BASE_URL}/v3/person/hent-postadresse`, { fnr, behandlingsnummer: 'B579' });

export const hentHarNivaa4 = (fnr: string): Promise<HarLoggetInnRespons> =>
    fetchToJson(`${PERSON_BASE_URL}/person/${fnr}/harNivaa4`);
