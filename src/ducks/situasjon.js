import * as Api from './situasjon-api';
import { STATUS, doThenDispatch } from './utils';
import { SETT_DIGITAL_OK } from '../moduler/aktiver-digital-oppfolging/aktiver-digital-oppfolging-reducer';

// Actions
export const OK = 'situasjon/OK';
export const FEILET = 'situasjon/FEILET';
export const PENDING = 'situasjon/PENDING';

export const AVSLA_OK = 'situasjon/avsla/OK';
export const AVSLA_FEILET = 'situasjon/avsla/FEILET';
export const AVSLA_PENDING = 'situasjon/avsla/PENDING';

export const GODTA_OK = 'situasjon/godta/OK';
export const GODTA_FEILET = 'situasjon/godta/FEILET';
export const GODTA_PENDING = 'situasjon/godta/PENDING';

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
            return {
                ...state,
                status: STATUS.ERROR,
                data: action.data,
            };
        case PENDING:
        case GODTA_PENDING:
        case AVSLA_PENDING:
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
export function hentSituasjon() {
    return doThenDispatch(() => Api.hentSituasjon(), {
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
