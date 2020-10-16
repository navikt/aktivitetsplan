import * as API from './malverk-api';
import { doThenDispatch, STATUS } from '../../ducks/utils';

// Actions
export const HENT_MALVERK_MED_TYPE_OK = 'malverk/hent_med_type/OK';
export const HENT_MALVERK_MED_TYPE_FEILET = 'malverk/hent_med_type/FEILET';
export const HENT_MALVERK_MED_TYPE_PENDING = 'malverk/hent_med_type/PENDING';

export const HENT_MALVERK_LISTE_OK = 'malverk/hent_liste/OK';
export const HENT_MALVERK_LISTE_FEILET = 'malverk/hent_liste/FEILET';
export const HENT_MALVERK_LISTE_PENDING = 'malverk/hent_liste/PENDING';

export const SETT_VALGT_MALVERK = 'malverk/sett_valgt_malverk';
export const SLETT_VALGT_MALVERK = 'malverk/slett_valgt_malverk';

const initialState = {
    data: [],
    status: STATUS.NOT_STARTED,
    valgtMalverk: {},
};

// Reducer
export default function reducer(state = initialState, action) {
    const { data } = action;

    switch (action.type) {
        case HENT_MALVERK_LISTE_OK:
        case HENT_MALVERK_MED_TYPE_OK:
            return {
                ...state,
                status: STATUS.OK,
                data,
            };
        case HENT_MALVERK_LISTE_FEILET:
        case HENT_MALVERK_MED_TYPE_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: data,
            };
        case HENT_MALVERK_LISTE_PENDING:
        case HENT_MALVERK_MED_TYPE_PENDING:
            return {
                ...state,
                status: state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING,
            };
        case SETT_VALGT_MALVERK:
        case SLETT_VALGT_MALVERK:
            return {
                ...state,
                valgtMalverk: data,
            };
        default:
            return state;
    }
}

// Action creators

export function hentMalverkMedType(type) {
    return doThenDispatch(() => API.hentMalverkMedType(type), {
        OK: HENT_MALVERK_MED_TYPE_OK,
        FEILET: HENT_MALVERK_MED_TYPE_FEILET,
        PENDING: HENT_MALVERK_MED_TYPE_PENDING,
    });
}

export function settValgtMalverk(mal) {
    return {
        type: SETT_VALGT_MALVERK,
        data: mal[0],
    };
}

export function slettValgtMalverk() {
    return {
        type: SLETT_VALGT_MALVERK,
        data: {},
    };
}
