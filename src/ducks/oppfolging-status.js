import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'oppfolgingStatus/OK';
export const FEILET = 'oppfolgingStatus/FEILET';
export const PENDING = 'oppfolgingStatus/PENDING';

export const AVSLA_OK = 'oppfolgingStatus/avsla/OK';
export const AVSLA_FEILET = 'oppfolgingStatus/avsla/FEILET';
export const AVSLA_PENDING = 'oppfolgingStatus/avsla/PENDING';

export const GODTA_OK = 'oppfolgingStatus/godta/OK';
export const GODTA_FEILET = 'oppfolgingStatus/godta/FEILET';
export const GODTA_PENDING = 'oppfolgingStatus/godta/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    brukerHarAvslatt: false,
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
            return { ...state, status: STATUS.OK, brukerHarAvslatt: false, data: action.data };
        case GODTA_FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case GODTA_PENDING:
            return { ...state, status: STATUS.PENDING, data: action.data };
        case AVSLA_OK:
            return { ...state, status: STATUS.OK, brukerHarAvslatt: true, data: action.data };
        case AVSLA_FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case AVSLA_PENDING:
            return { ...state, status: STATUS.PENDING, data: action.data };
        default:
            return state;
    }
}

// Action Creators - NB! Disse brukes av aktivitetsplan
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

export function avslaVilkar(hash) {
    return doThenDispatch(() => Api.avslaaVilkar(hash), {
        OK: AVSLA_OK,
        FEILET: AVSLA_FEILET,
        PENDING: AVSLA_PENDING
    });
}

