import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'etiketter/OK';
export const FEILET = 'etiketter/FEILET';
export const PENDING = 'etiketter/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        case FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case OK: {
            return { ...state, status: STATUS.OK, data };
        }
        default:
            return state;
    }
}

// Action Creators
export function hentEtiketter() {
    return doThenDispatch(() => Api.hentEtiketter(), {
        OK,
        FEILET,
        PENDING,
    });
}
