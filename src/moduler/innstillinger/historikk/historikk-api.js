import {
    OPPGAVE_BASE_URL,
    OPPFOLGING_PROXY_BASE_URL,
} from '../../../environment';
import { fetchToJson } from '../../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function hentInnstillingHistorikk() {
    return fetchToJson(
        `${OPPFOLGING_PROXY_BASE_URL}/oppfolging/innstillingsHistorikk`
    );
}

export function hentInnstillingOppgavehistorikk() {
    return fetchToJson(`${OPPGAVE_BASE_URL}/oppgavehistorikk`);
}
