import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { DIALOG_GRAPHQL_BASE_URL } from '../environment';
import { DEFAULT_CONFIG, sjekkStatuskode, toJson } from './utils';
import { Dialog } from '../datatypes/dialogTypes';
import { GraphqlResponse, sjekkGraphqlFeil } from './graphql/graphqlResult';

const query = `
    query($fnr: String!, $bareMedAktiviteter: Boolean) {
        dialoger(fnr: $fnr, bareMedAktiviteter: $bareMedAktiviteter) {
            id,
            aktivitetId,
            oppfolgingsperiode,
            opprettetDato,
            egenskaper,
            lest,
            sisteDato,
            henvendelser {
                id,
                lest,
                avsender,
                avsenderId,
                dialogId,
                sendt,
                tekst
            }
        }
    }
`;

type DialogResponse = GraphqlResponse<{ dialoger: Dialog[] }>;

const queryBody = (fnr: string) => ({
    query,
    variables: {
        fnr,
        bareMedAktiviteter: false,
    },
});

export const hentDialogerGraphql = async (): Promise<DialogResponse> => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR) || '';
    return fetch(DIALOG_GRAPHQL_BASE_URL, {
        ...DEFAULT_CONFIG,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'aktivitetsplan',
        },
        body: JSON.stringify(queryBody(fnr)),
    })
        .then(sjekkStatuskode)
        .then(toJson)
        .then(sjekkGraphqlFeil<{ dialoger: Dialog[] }>);
};
