import * as Api from './hent-veiledere-for-oppgave-api';

import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer(
    'hent_veiledere',
    'veiledere',
    []
);

export default reducer;

export function hentVeiledereForEnhet(enhetid) {
    return action(() => Api.hentVeieldereForEnhet(enhetid));
}

// TODO: Slutt å exporte denne og implementer heller en selectOpprettOppgevaData og Status
export function selectOppgaveVeiledere(state) {
    return state.data.oppgaveVeiledere;
}
