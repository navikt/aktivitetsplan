import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';
import { storeForbokstaver } from '../utils';

// Actions
export const HENTER_VEILEDER = 'veileder/hent';
export const HENTET_VEILEDER = 'veileder/hent/ok';
export const HENTING_AV_VEILEDER_FEILET = 'veileder/hent/fail';

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
        case HENTET_VEILEDER:
            return mergeState(state, data);
        case HENTING_AV_VEILEDER_FEILET:
            return { ...state, status: STATUS.ERROR };
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
                OK: HENTET_VEILEDER,
                FEILET: HENTING_AV_VEILEDER_FEILET,
                PENDING: HENTER_VEILEDER,
            })(dispatch);
        }
    };
}
