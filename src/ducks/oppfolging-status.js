import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'oppfolgingStatus/OK';
export const FEILET = 'oppfolgingStatus/FEILET';
export const PENDING = 'oppfolgingStatus/PENDING';

export const AVSLAG = 'oppfolgingStatus/avslag';

export const GODTA_OK = 'oppfolgingStatus/godta/OK';
export const GODTA_FEILET = 'oppfolgingStatus/godta/FEILET';
export const GODTA_PENDING = 'oppfolgingStatus/godta/PNEDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {}
};


// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return { ...state, status: STATUS.PENDING };
        case FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case OK:
            return { ...state, status: STATUS.OK, data: action.data };
        case GODTA_OK:
            return { ...state, data: action.data };
        case AVSLAG:
            return { ...state, data: { ...state.data, avslag: true } };
        default:
            return state;
    }
}

// Action Creators
export function hentOppfolgingStatus() {
    return doThenDispatch(() => Api.hentOppfolgingStatus(), {
        OK,
        FEILET,
        PENDING
    });
}

export function godtaVilkar(hash) {
    return doThenDispatch(() => Api.godtaVilkar(hash), {
        OK: GODTA_OK,
        FEILET: GODTA_FEILET,
        PENDING: GODTA_PENDING
    });
}

export function avslaVilkar() {
    return (dipatch) => dipatch({ type: AVSLAG });
}

