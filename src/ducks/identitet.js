import * as Api from './api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'identitet/OK';
export const FEILET = 'identitet/FEILET';
export const PENDING = 'identitet/PENDING';

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
export function hentIdentitet() {
    return (dispatch, getState) => {
        const status = getState().data.identitet.status;
        if(status == STATUS.NOT_STARTED || status == STATUS.ERROR){
            doThenDispatch(() => Api.hentIdentitet(), {
                OK,
                FEILET,
                PENDING
            })(dispatch);
        }
    }
}
