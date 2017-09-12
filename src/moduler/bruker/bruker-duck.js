import * as Api from '../../ducks/api';
import { doThenDispatch, STATUS } from '../../ducks/utils';

// Actions
export const HENTER_BRUKER = 'bruker/hent';
export const HENTET_BRUKER = 'bruker/hent/ok';
export const HENTING_AV_BRUKER_FEILET = 'bruker/hent/fail';

const initalState = {
    data: {},
    status: STATUS.NOT_STARTED,
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTET_BRUKER:
            return {
                ...state,
                status: STATUS.OK,
                data,
            };
        case HENTING_AV_BRUKER_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        default:
            return state;
    }
}

export function hentBruker(fnr) {
    return doThenDispatch(() => Api.hentBruker(fnr), {
        OK: HENTET_BRUKER,
        FEILET: HENTING_AV_BRUKER_FEILET,
        PENDING: HENTER_BRUKER,
    });
}
