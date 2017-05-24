import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const HENT = 'vilkar/hent';
export const HENT_OK = 'vilkar/hent/ok';
export const HENT_FEILET = 'vilkar/hent/fail';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {
        text: ''
    }
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT:
            return { ...state, status: state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING };
        case HENT_OK:
            return { ...state, status: STATUS.OK, data: action.data };
        case HENT_FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        default:
            return state;
    }
}

// Action Creators
export function hentVilkar() {
    return doThenDispatch(() => Api.hentVilkar(), {
        OK: HENT_OK,
        FEILET: HENT_FEILET,
        PENDING: HENT
    });
}

