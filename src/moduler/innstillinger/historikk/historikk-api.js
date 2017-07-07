import { SITUASJON_PROXY_BASE_URL } from '~config'; // eslint-disable-line
import { fetchToJson } from '../../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function hentInnstillingHistorikk() {
    return fetchToJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/innstillingsHistorikk`
    );
}
