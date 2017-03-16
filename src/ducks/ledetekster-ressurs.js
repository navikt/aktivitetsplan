import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'ledetekster/OK';
export const FEILET = 'ledetekster/FEILET';
export const PENDING = 'ledetekster/PENDING';

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
        case OK: {
            return { ...state, status: STATUS.OK, data: action.data };
        }
        default:
            return state;
    }
}

// Action Creators
export function hentLedetekster() {
    return doThenDispatch(() => Api.hentLedetekster(), {
        OK,
        FEILET,
        PENDING
    });
}
