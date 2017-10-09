import { OPPGAVE_BASE_URL, SITUASJON_PROXY_BASE_URL } from '../../../environment';
import { fetchToJson } from '../../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function hentInnstillingHistorikk() {
    return fetchToJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/innstillingsHistorikk`
    );
}

export function hentInnstillingOppgavehistorikk() {
    return fetchToJson(
        `${OPPGAVE_BASE_URL}/oppgavehistorikk`
    );
}
