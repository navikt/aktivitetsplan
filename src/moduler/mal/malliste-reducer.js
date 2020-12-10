import * as Api from '../../api/oppfolgingAPI';
import { STATUS, doThenDispatch } from '../../api/utils';

export const LISTE_OK = 'malListe/OK';
export const LISTE_FEILET = 'malListe/FEILET';
export const LISTE_PENDING = 'malListe/PENDING';
export const LISTE_FJERN = 'malListe/FJERN';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case LISTE_FEILET:
            return { ...state, status: STATUS.ERROR, feil: action.data };
        case LISTE_PENDING:
            return { ...state, status: STATUS.PENDING };
        case LISTE_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case LISTE_FJERN:
            return { ...state, status: STATUS.OK, data: [] };
        default:
            return state;
    }
}

export function hentMalListe() {
    return doThenDispatch(() => Api.fetchMalListe(), {
        OK: LISTE_OK,
        FEILET: LISTE_FEILET,
        PENDING: LISTE_PENDING,
    });
}

export function fjernMalListe() {
    return (dispatch) => {
        dispatch({ type: LISTE_FJERN });
    };
}
