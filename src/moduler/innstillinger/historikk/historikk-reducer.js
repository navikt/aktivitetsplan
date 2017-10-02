import * as Api from './historikk-api';
import { STATUS, doThenDispatch } from '../../../ducks/utils';

// Actions
export const HENT_HISTORIKK_OK = 'historikk/hent_historikk/OK';
export const HENT_HISTORIKK_FEILET = 'historikk/hent_historikk/FEILET';
export const HENT_HISTORIKK_PENDING = 'historikk/hent_historikk/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_HISTORIKK_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case HENT_HISTORIKK_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: action.data,
            };
        case HENT_HISTORIKK_PENDING:
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

// Action Creators
export function hentInnstillingHistorikk() {
    return doThenDispatch(() => Api.hentInnstillingHistorikk(), {
        OK: HENT_HISTORIKK_OK,
        FEILET: HENT_HISTORIKK_FEILET,
        PENDING: HENT_HISTORIKK_PENDING,
    });
}
