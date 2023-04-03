import * as Api from '../../api/oppfolgingAPI';
import { doThenDispatch } from '../../api/utils';
import { Status } from '../../createGenericSlice';

export const LISTE_OK = 'malListe/OK';
export const LISTE_FEILET = 'malListe/FEILET';
export const LISTE_PENDING = 'malListe/PENDING';
export const LISTE_FJERN = 'malListe/FJERN';

const initalState = {
    status: Status.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case LISTE_FEILET:
            return { ...state, status: Status.ERROR, feil: action.data };
        case LISTE_PENDING:
            return { ...state, status: Status.PENDING };
        case LISTE_OK:
            return {
                ...state,
                status: Status.OK,
                data: action.data,
            };
        case LISTE_FJERN:
            return { ...state, status: Status.OK, data: [] };
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
