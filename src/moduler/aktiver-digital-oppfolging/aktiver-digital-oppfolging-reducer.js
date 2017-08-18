import * as Api from './aktiver-digital-oppfolging-api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
export const SETT_DIGITAL_PENDING = 'digital-oppfolging/sett/pending';
export const SETT_DIGITAL_OK = 'digital-oppfolging/sett/ok';
export const SETT_DIGITAL_FEILET = 'digital-oppfolging/sett/fail';

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
                feil: action.data,
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
