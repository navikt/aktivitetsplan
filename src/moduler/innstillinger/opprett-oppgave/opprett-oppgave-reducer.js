import * as Api from '../../../ducks/api';
import { createActionsAndReducer } from '../../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer(
    'opprett_oppgave',
    'opprettOppgave'
);

export default reducer;

export function opprettOppgaveForBruker(oppgave) {
    return action(() => Api.opprettOppgaveForBruker(oppgave));
}

// TODO: Slutt å exporte denne og implementer heller en selectOpprettOppgevaData og Status
export function selectOpprettOppgave(state) {
    return state.data.opprettOppgave;
}
