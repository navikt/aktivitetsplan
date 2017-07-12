import * as Api from './sett-digital-api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
export const SETT_DIGITAL_PENDING = 'vilkar/hent/pending';
export const SETT_DIGITAL_OK = 'vilkar/hent/ok';
export const SETT_DIGITAL_FEILET = 'vilkar/hent/fail';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case SETT_DIGITAL_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case SETT_DIGITAL_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                data: action.data,
            };
        case SETT_DIGITAL_PENDING:
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
export function settDigital() {
    return doThenDispatch(() => Api.settDigital(), {
        OK: SETT_DIGITAL_OK,
        FEILET: SETT_DIGITAL_FEILET,
        PENDING: SETT_DIGITAL_PENDING,
    });
}
