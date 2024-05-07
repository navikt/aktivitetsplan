import { RegoppslagDto } from '../datatypes/types';
import { PERSON_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export const hentPerson = (fnr: string) => {
    return postAsJson(`${PERSON_BASE_URL}/v3/hent-person`, { fnr, behandlingsnummer: 'B579' });
};

export const hentAdresse = (fnr: string): Promise<RegoppslagDto> =>
    postAsJson(`${PERSON_BASE_URL}/v3/person/hent-postadresse`, { fnr, behandlingsnummer: 'B579' });
