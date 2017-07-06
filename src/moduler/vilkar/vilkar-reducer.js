import * as Api from '../../ducks/situasjon-api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
export const HENT_PENDING = 'vilkar/hent/pending';
export const HENT_OK = 'vilkar/hent/ok';
export const HENT_FEILET = 'vilkar/hent/fail';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {
        tekst: '',
    },
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
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
        PENDING: HENT_PENDING,
    });
}
