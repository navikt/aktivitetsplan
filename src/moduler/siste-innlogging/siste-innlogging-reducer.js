import * as Api from './siste-innlogging-api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
export const OK = 'sisteinnlogging/OK';
export const FEILET = 'sisteinnlogging/FEILET';
export const PENDING = 'sisteinnlogging/PENDING';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: {},
};

export default function reducer(state = initalState, action) {
    switch (action.type) {
        case OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: action.data,
            };
        case PENDING:
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

export function hentSisteInnlogging() {
    return doThenDispatch(() => Api.hentSisteInnlogging(), {
        OK,
        FEILET,
        PENDING,
    });
}
