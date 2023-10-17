import { DEFAULT_CONFIG, fetchToJson, sjekkStatuskode, toJson } from './utils';
import { AKTIVITET_GRAPHQL_BASE_URL } from '../environment';
import { hentFraLocalStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';

const query: string = `
    query($fnr: String!) {
        perioder(fnr: $fnr) {
            id,
            aktiviteter {
                id
            },
        }
    }
`;
const queryBody = (fnr: string) => ({
    query,
    variables: {
        fnr,
    },
});
interface OppfolgingsPerioder {
    id: string;
    aktiviteter: VeilarbAktivitet[];
}
interface AktivitetsplanResponse {
    perioder: OppfolgingsPerioder[];
}

export const hentAktiviteterGraphql = async (): Promise<AktivitetsplanResponse> => {
    const fnr = hentFraLocalStorage(LocalStorageElement.FNR) || '';
    return fetch(AKTIVITET_GRAPHQL_BASE_URL, {
        ...DEFAULT_CONFIG,
        method: 'POST',
        body: JSON.stringify(queryBody(fnr)),
    })
        .then(sjekkStatuskode)
        .then(toJson);
};
