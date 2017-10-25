import * as Api from '../../../ducks/api';
import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('opprett_oppgave');

export default reducer;

export function opprettOppgaveForBruker(oppgave) {
    return action(() => Api.opprettOppgaveForBruker(oppgave));
}

// TODO: Fjern denne og fiks stedene den brukes slik at de henter data direkte
export function selectOpprettOppgave(state) {
    return state.data.opprettOppgave;
}
