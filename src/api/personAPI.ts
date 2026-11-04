import { Bruker } from '../datatypes/types';
import { PERSON_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export interface PersonNavn {
    navn: string;
}

export const fetchPersonNavn = async (fnr: string): Promise<PersonNavn> => {
    const person: Pick<Bruker, 'fornavn' | 'mellomnavn' | 'etternavn'> = await postAsJson(
        `${PERSON_BASE_URL}/v3/person/hent-navn`,
        { fnr },
        'fetchPersonNavn',
    );
    const navn = [person.fornavn, person.mellomnavn, person.etternavn]
        .map((del) => del?.trim())
        .filter(Boolean)
        .join(' ');
    if (!navn) throw new Error('Mangler navn i svaret fra veilarbperson');
    return { navn };
};
