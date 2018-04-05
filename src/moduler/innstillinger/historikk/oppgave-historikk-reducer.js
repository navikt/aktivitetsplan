import * as Api from './historikk-api';
import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, cashedAction } = createActionsAndReducer('oppgaveHistorikk');

export default reducer;

export function hentInnstillingOppgavehistorikk() {
    return cashedAction(() => Api.hentInnstillingOppgavehistorikk());
}
