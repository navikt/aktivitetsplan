import * as Api from './historikk-api';
import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer(
    'oppfolgingHistorikk'
);

export default reducer;

export function hentInnstillingHistorikk() {
    return cashedAction(() => Api.hentInnstillingHistorikk());
}
