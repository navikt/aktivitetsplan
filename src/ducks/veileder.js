import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';
import { storeForbokstaver } from '../utils';

// Actions
export const HENTER_VEILEDER_OK = 'veileder/henter/ok';
export const HENTER_VEILEDER_PENDING = 'veileder/henter/pending';
export const HENTER_VEILEDER_ERROR = 'veileder/henter/error';

const initalState = {
    data: {},
    status: STATUS.NOT_STARTED,
};

function mergeState(state, data) {
    const nyState = { ...state.data };
    nyState[data.ident] = storeForbokstaver(data.navn);
    return {
        status: STATUS.OK,
        data: { ...nyState },
    };
}

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTER_VEILEDER_OK:
            return mergeState(state, data);
        case HENTER_VEILEDER_ERROR:
            return { ...state, status: STATUS.ERROR, feil: data };
        default:
            return state;
    }
}

// Action creator
export function hentVeileder(veilederId) {
    return (dispatch, getState) => {
        const cached = getState().data.veiledere.data[veilederId];
        if (!cached) {
            doThenDispatch(() => Api.hentVeileder(veilederId), {
                OK: HENTER_VEILEDER_OK,
                PENDING: HENTER_VEILEDER_PENDING,
                FEILET: HENTER_VEILEDER_ERROR,
            })(dispatch);
        }
    };
}
