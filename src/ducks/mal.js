import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';


export const OK = 'mal/OK';
export const FEILET = 'mal/FEILET';
export const PENDING = 'mal/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {}
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return { ...state, status: STATUS.PENDING };
        case FEILET:
            return { ...state, status: STATUS.ERROR, data: action.data };
        case OK:
            return { ...state, status: STATUS.OK, data: action.data };
        default:
            return state;
    }
}

// Action creator
export function hentMal() {
    return doThenDispatch(() => Api.hentMal(), {
        OK,
        FEILET,
        PENDING
    });
}
