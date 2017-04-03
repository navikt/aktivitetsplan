import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

export const GJELDENDE_OK = 'mal/OK';
export const GJELDENDE_FEILET = 'mal/FEILET';
export const GJELDENDE_PENDING = 'mal/PENDING';

export const LISTE_OK = 'malListe/OK';
export const LISTE_FEILET = 'malListe/FEILET';
export const LISTE_PENDING = 'malListe/PENDING';
export const LISTE_FJERN = 'malListe/FJERN';

export const OPPDATER_OK = 'oppdaterMall/OK';
export const OPPDATER_FEILET = 'oppdaterMall/FEILET';
export const OPPDATER_PENDING = 'oppdaterMall/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    gjeldende: {},
    liste: []
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case GJELDENDE_PENDING:
            return { ...state, status: STATUS.PENDING };
        case GJELDENDE_FEILET:
            return { ...state, status: STATUS.ERROR, gjeldende: action.data };
        case GJELDENDE_OK:
            return { ...state, status: STATUS.OK, gjeldende: action.data };
        case LISTE_PENDING:
            return { ...state, status: STATUS.PENDING };
        case LISTE_FEILET:
            return { ...state, status: STATUS.ERROR, liste: action.data };
        case LISTE_OK:
            return { ...state, status: STATUS.OK, liste: action.data };
        case LISTE_FJERN:
            return { ...state, status: STATUS.OK, liste: [] };
        case OPPDATER_FEILET:
            return { ...state, status: STATUS.PENDING };
        case OPPDATER_FEILET:
            return { ...state, status: STATUS.ERROR, gjeldende: action.data };
        case OPPDATER_FEILET:
            return { ...state, status: STATUS.OK, gjeldende: action.data };
        default:
            return state;
    }
}

// Action creator
export function hentMal() {
    return doThenDispatch(() => Api.hentMal(), {
        OK: GJELDENDE_OK,
        FEILET: GJELDENDE_FEILET,
        PENDING: GJELDENDE_PENDING
    });
}

export function hentMalListe() {
    return doThenDispatch(() => Api.hentMalListe(), {
        OK: LISTE_OK,
        FEILET: LISTE_FEILET,
        PENDING: LISTE_PENDING
    });
}

export function fjernMalListe() {
    return (dispatch) => { dispatch({ type: LISTE_FJERN }); };
}

export function oppdaterMal(mal) {
    return doThenDispatch(() => Api.hentMalListe(), {
        OK: OPPDATER_OK,
        FEILET: OPPDATER_FEILET,
        PENDING: OPPDATER_PENDING
    });
}
