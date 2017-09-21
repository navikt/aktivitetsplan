//  Actions
import { doThenDispatch, STATUS } from '../../../ducks/utils';
import * as Api from '../../../ducks/api';


export const HENT_BEHANDLENDE_ENHETER_OK = '/hent-behandlende-enheter/OK';
export const HENT_BEHANDLENDE_ENHETER_FEILET = '/hent-behandlende-enheter/FEILET';
export const HENT_BEHANDLENDE_ENHETER_PENDING = '/hent-behandlende-enheter/PENDING';
export const HENT_BEHANDLENDE_ENHETER_RESET = 'hent-behandlende-enheter/RESET';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

//  Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_BEHANDLENDE_ENHETER_OK:
            return {
                data: action.data,
                status: STATUS.OK,
            };
        case HENT_BEHANDLENDE_ENHETER_FEILET:
            return {
                data: action.data,
                status: STATUS.ERROR,
            };
        case HENT_BEHANDLENDE_ENHETER_PENDING:
            return {
                status: STATUS.PENDING,
            };
        case HENT_BEHANDLENDE_ENHETER_RESET:
            return initalState;
        default:
            return state;
    }
}

//  Action creator
export function hentBehandlendeEnheter(tema) {
    return doThenDispatch(() => Api.hentBehandlendeEnheter(tema), {
        OK: HENT_BEHANDLENDE_ENHETER_OK,
        FEILET: HENT_BEHANDLENDE_ENHETER_FEILET,
        PENDING: HENT_BEHANDLENDE_ENHETER_PENDING,
    });
}

// Selectors
export function selectBehandlendeEnheter(state) {
    return state.data.behandlendeEnheter;
}

export function resetEnheter() {
    return {
        type: HENT_BEHANDLENDE_ENHETER_RESET,
    };
}
