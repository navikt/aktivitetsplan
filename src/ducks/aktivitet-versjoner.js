import * as Api from './api';
import { OPPDATER_OK, FLYTT_OK } from './aktiviteter';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const OK = 'versjoner/OK';
export const FEILET = 'versjoner/FEILET';
export const PENDING = 'versjoner/PENDING';

export const FJERN = 'versjoner/fjern';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status: state.status === STATUS.NOT_STARTED
                    ? STATUS.PENDING
                    : STATUS.RELOADING,
            };
        case FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case OPPDATER_OK:
        case FLYTT_OK:
            if (state.status === STATUS.NOT_STARTED) {
                return state;
            }
            return { ...state, data: [action.data, ...state.data] };
        case OK:
            return { ...state, status: STATUS.OK, data: action.data };
        case FJERN:
            return initalState;
        default:
            return state;
    }
}

// Action creator
export function hentVersjonerForAktivtet(aktivitet) {
    return doThenDispatch(() => Api.hentVersjonerTilAktivitet(aktivitet), {
        OK,
        FEILET,
        PENDING,
    });
}

export function fjernVersjoner() {
    return dispatch => {
        dispatch({ type: FJERN });
    };
}
