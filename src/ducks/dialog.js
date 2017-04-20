import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const HENTER = 'dialog/hent';
export const HENTET = 'dialog/hent/ok';
export const HENTING_FEILET = 'dialog/hent/fail';

export const OPPRETTER_HENVENDELSE = 'dialog/henvendelse/opprett';
export const OPPRETTET_HENVENDELSE = 'dialog/henvendelse/opprett/ok';
export const OPPRETT_HENVENDELSE_FEILET = 'dialog/henvendelse/opprett/fail';

export const DIALOG_LEST = 'dialog/lest';
export const DIALOG_LEST_OK = 'dialog/lest/ok';
export const DIALOG_LEST_FEILET = 'dialog/lest/fail';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: []
};

function nyStateMedOppdatertDialog(state, dialog) {
    const data = state.data;
    const dialogIndeks = data.findIndex((d) => d.id === dialog.id);
    const nyData = [...data];
    if (dialogIndeks >= 0) {
        nyData[dialogIndeks] = dialog;
    } else {
        nyData.push(dialog);
    }
    return { ...state, data: nyData };
}

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTET:
            return { ...state, data };
        case OPPRETTET_HENVENDELSE:
        case DIALOG_LEST_OK:
            return nyStateMedOppdatertDialog(state, data);
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

export function nyHenvendelse(henvendelse) {
    return doThenDispatch(() => Api.nyHenvendelse(henvendelse), {
        OK: OPPRETTET_HENVENDELSE,
        FEILET: OPPRETT_HENVENDELSE_FEILET,
        PENDING: OPPRETTER_HENVENDELSE
    });
}

export function markerDialogSomLest(dialogId) {
    return doThenDispatch(() => Api.markerDialogSomLest(dialogId), {
        OK: DIALOG_LEST_OK,
        FEILET: DIALOG_LEST_FEILET,
        PENDING: DIALOG_LEST
    });
}
