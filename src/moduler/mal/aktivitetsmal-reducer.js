import * as Api from '../oppfolging-status/oppfolging-api';
import { doThenDispatch, STATUS } from '../../ducks/utils';
import { hentMalListe } from './malliste-reducer';

export const GJELDENDE_OK = 'mal/OK';
export const GJELDENDE_FEILET = 'mal/FEILET';
export const GJELDENDE_PENDING = 'mal/PENDING';

export const OPPDATER_OK = 'oppdaterMal/OK';
export const OPPDATER_FEILET = 'oppdaterMal/FEILET';
export const OPPDATER_PENDING = 'oppdaterMal/PENDING';

export const SLETT_MAL_OK = 'slettMal/OK';
export const SLETT_MAL_FEILET = 'slettMal/FEILET';
export const SLETT_MAL_PENDING = 'slettMal/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case GJELDENDE_FEILET:
        case OPPDATER_FEILET:
            return { ...state, status: STATUS.ERROR, feil: action.data };
        case GJELDENDE_PENDING:
        case OPPDATER_PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        case GJELDENDE_OK:
        case OPPDATER_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case SLETT_MAL_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: {},
            };
        default:
            return state;
    }
}

// Action creator
export function hentMal() {
    return doThenDispatch(() => Api.hentMal(), {
        OK: GJELDENDE_OK,
        FEILET: GJELDENDE_FEILET,
        PENDING: GJELDENDE_PENDING,
    });
}

export function oppdaterMal(mal) {
    return doThenDispatch(() => Api.lagreMal(mal), {
        OK: OPPDATER_OK,
        FEILET: OPPDATER_FEILET,
        PENDING: OPPDATER_PENDING,
    });
}

export function slettMal() {
    return dispatch => {
        const slettMalAction = doThenDispatch(() => Api.slettMal(), {
            OK: SLETT_MAL_OK,
            FEILET: SLETT_MAL_FEILET,
            PENDING: SLETT_MAL_PENDING,
        });
        return dispatch(slettMalAction).then(data => {
            dispatch(hentMalListe());
            return data;
        });
    };
}
