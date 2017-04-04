import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const HENTER = 'dialog/hent';
export const HENTET = 'dialog/hent/ok';
export const HENTING_FEILET = 'dialog/hent/fail';

export const OPPRETT = 'dialog/opprett';
export const OPPRETTET = 'dialog/opprett/ok';
export const OPPRETT_FEILET = 'dialog/opprett/fail';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: []
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTET:
            return { ...state, data };
        case OPPRETTET:
            return { ...state, data: [...state.data, data] };
        default:
            return state;
    }
}

// Action creator
export function hentDialog() {
    return doThenDispatch(() => Api.hentDialog(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER
    });
}

export function nyDialog(dialog) {
    return doThenDispatch(() => Api.nyDialog(dialog), {
        OK: OPPRETTET,
        FEILET: OPPRETT_FEILET,
        PENDING: OPPRETT
    });
}

