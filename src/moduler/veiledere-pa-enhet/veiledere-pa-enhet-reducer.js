import { createActionsAndReducer } from '../../ducks/rest-reducer';
import * as Api from './veiledere-pa-enhet-api';

const { reducer, cashedAction } = createActionsAndReducer('veilederePaEnhet');

export default reducer;

export function hentVeiledereForEnhet(enhetId) {
    return cashedAction(() => Api.hentVeieldereForEnhet(enhetId));
}

export function selectVeilederStatus(state) {
    return state.data.veilederePaEnhet.status;
}

export function selectVeilederListe(state) {
    return state.data.veilederePaEnhet.data.veilederListe;
}
