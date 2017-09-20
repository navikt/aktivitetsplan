import { doThenDispatch, STATUS } from '../../../ducks/utils';
import * as Api from '../../../ducks/api';

// Actions
export const OPPRETT_OPPGAVE_OK = 'opprett-oppgave/OK';
export const OPPRETT_OPPGAVE_FEILET = 'opprett-oppgave/FEILET';
export const OPPRETT_OPPGAVE_PENDING = 'opprett-oppgave/PENDING';

const initialState = {
    status: STATUS.OK,
};

// reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case OPPRETT_OPPGAVE_OK: {
            return { status: STATUS.OK };
        }
        case OPPRETT_OPPGAVE_PENDING: {
            return { status: STATUS.PENDING };
        }
        case OPPRETT_OPPGAVE_FEILET: {
            return { status: STATUS.OK };
        }
        default:
            return state;
    }
}

export function opprettOppgaveForBruker(oppgave) {
    return doThenDispatch(() => Api.opprettOppgaveForBruker(oppgave), {
        OK: OPPRETT_OPPGAVE_OK,
        FEILET: OPPRETT_OPPGAVE_FEILET,
        PENDING: OPPRETT_OPPGAVE_PENDING,
    });
}
