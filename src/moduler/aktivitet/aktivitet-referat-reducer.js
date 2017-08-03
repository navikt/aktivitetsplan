import * as AT from './aktivitet-action-types';
import { doThenDispatch, STATUS } from '../../ducks/utils';
import * as Api from './aktivitet-api';

const initalState = {
    data: {},
    status: STATUS.OK,
};

export default function reducer(state = initalState, action) {
    switch (action.type) {
        case AT.OPPDATER_REFERAT:
        case AT.PUBLISER_REFERAT:
            return { ...state, status: STATUS.PENDING };
        case AT.OPPDATER_REFERAT_FEILET:
        case AT.PUBLISER_REFERAT_FEILET:
            return { ...state, status: STATUS.ERROR };
        case AT.OPPDATER_REFERAT_OK:
        case AT.PUBLISER_REFERAT_OK:
            return { ...state, status: STATUS.OK };
        default:
            return state;
    }
}

export function oppdaterReferat(aktivitet) {
    return doThenDispatch(() => Api.oppdaterReferat(aktivitet), {
        OK: AT.OPPDATER_REFERAT_OK,
        FEILET: AT.OPPDATER_REFERAT_FEILET,
        PENDING: AT.OPPDATER_REFERAT,
    });
}

export function publiserReferat(aktivitet) {
    return doThenDispatch(() => Api.publiserReferat(aktivitet.id), {
        OK: AT.PUBLISER_REFERAT_OK,
        FEILET: AT.PUBLISER_REFERAT_FEILET,
        PENDING: AT.PUBLISER_REFERAT,
    });
}

export function selectReferatReducer(state) {
    return state.data.referat;
}
