import * as Api from './oppfolging-api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
export const OK = 'oppfolging/OK';
export const FEILET = 'oppfolging/FEILET';
export const PENDING = 'oppfolging/PENDING';

export const SETT_DIGITAL_OK = 'oppfolging/digital/OK';
export const SETT_DIGITAL_FEILET = 'oppfolging/digital/FEILET';
export const SETT_DIGITAL_PENDING = 'oppfolging/digital/PENDING';

export const AVSLA_OK = 'oppfolging/avsla/OK';
export const AVSLA_FEILET = 'oppfolging/avsla/FEILET';
export const AVSLA_PENDING = 'oppfolging/avsla/PENDING';

export const GODTA_OK = 'oppfolging/godta/OK';
export const GODTA_FEILET = 'oppfolging/godta/FEILET';
export const GODTA_PENDING = 'oppfolging/godta/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    brukerHarAvslatt: false,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case OK:
        case SETT_DIGITAL_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case GODTA_OK:
            return {
                ...state,
                status: STATUS.OK,
                brukerHarAvslatt: false,
                data: action.data,
            };
        case AVSLA_OK:
            return {
                ...state,
                status: STATUS.OK,
                brukerHarAvslatt: true,
                data: action.data,
            };
        case FEILET:
        case GODTA_FEILET:
        case AVSLA_FEILET:
        case SETT_DIGITAL_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: action.data,
            };
        case PENDING:
        case GODTA_PENDING:
        case AVSLA_PENDING:
        case SETT_DIGITAL_PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        default:
            return state;
    }
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function hentOppfolging() {
    return doThenDispatch(() => Api.hentOppfolging(), {
        OK,
        FEILET,
        PENDING,
    });
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function godtaVilkar(hash) {
    return doThenDispatch(() => Api.godtaVilkar(hash), {
        OK: GODTA_OK,
        FEILET: GODTA_FEILET,
        PENDING: GODTA_PENDING,
    });
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function avslaVilkar(hash) {
    return doThenDispatch(() => Api.avslaaVilkar(hash), {
        OK: AVSLA_OK,
        FEILET: AVSLA_FEILET,
        PENDING: AVSLA_PENDING,
    });
}

export function settDigital() {
    return doThenDispatch(() => Api.settDigital(), {
        OK: SETT_DIGITAL_OK,
        FEILET: SETT_DIGITAL_FEILET,
        PENDING: SETT_DIGITAL_PENDING,
    });
}
