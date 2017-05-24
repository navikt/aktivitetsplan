import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const OK = 'endringslogg/OK';
export const FEILET = 'endringslogg/FEILET';
export const PENDING = 'endringslogg/PENDING';

export const FJERN = 'endringslogg/fjern';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: []
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return { ...state, status: state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING };
        case FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case OK:
            return { ...state, status: STATUS.OK, data: action.data };
        case FJERN:
            return initalState;
        default:
            return state;
    }
}

// Action creator
export function hentEndringsloggForAktivtet(aktivitet) {
    return doThenDispatch(() => Api.hentEndringsloggTilAktivitet(aktivitet), {
        OK,
        FEILET,
        PENDING
    });
}

export function fjernEndringsLogg() {
    return (dispatch) => { dispatch({ type: FJERN }); };
}

