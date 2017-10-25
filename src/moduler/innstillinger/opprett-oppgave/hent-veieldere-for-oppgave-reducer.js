import * as Api from '../../../ducks/api';

import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('hent_veiledere', []);

export default reducer;

export function hentVeiledereForEnhet(enhetid) {
    return action(() => Api.hentVeieldereForEnhet(enhetid));
}

// TODO: Fjern denne og fiks stedene den brukes slik at de henter data direkte
export function selectOppgaveVeiledere(state) {
    return state.data.oppgaveVeiledere;
}
