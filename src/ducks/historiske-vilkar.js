import * as Api from '../moduler/situasjon/situasjon-api';
import { STATUS, doThenDispatch } from './utils';
import { guid } from '../utils';

// Actions
export const HENT_HISTORISKE_PENDING = 'vilkar/hent-historiske/pending';
export const HENT_HISTORISKE_OK = 'vilkar/hent-historiske/ok';
export const HENT_HISTORISKE_FEILET = 'vilkar/hent-historiske/fail';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_HISTORISKE_PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        case HENT_HISTORISKE_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data.map(v => ({ ...v, guid: guid() })),
            };
        case HENT_HISTORISKE_FEILET:
            return { ...state, status: STATUS.ERROR };
        default:
            return state;
    }
}

// Action Creators
export function hentHistoriskeVilkar() {
    return doThenDispatch(() => Api.hentHistoriskeVilkar(), {
        OK: HENT_HISTORISKE_OK,
        FEILET: HENT_HISTORISKE_FEILET,
        PENDING: HENT_HISTORISKE_PENDING,
    });
}
