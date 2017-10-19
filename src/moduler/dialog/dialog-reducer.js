import * as Api from './dialog-api';
import { doThenDispatch, STATUS } from '../../ducks/utils';

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

export const OPPDATER_DIALOG = 'dialog/oppdater';
export const OPPDATER_DIALOG_OK = 'dialog/oppdater/ok';
export const OPPDATER_DIALOG_FEILET = 'dialog/oppdater/fail';
export const ESKALERINGS_FILTER_TYPE = 'dialog/eskalering';
export const ESKALERINGS_FILTER = { type: ESKALERINGS_FILTER_TYPE };

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
    sisteHenvendelseData: null,
    esklaringsFilter: false,
};

function nyStateMedOppdatertDialog(state, dialog) {
    const data = state.data;
    const dialogIndeks = data.findIndex(d => d.id === dialog.id);
    const nyData = [...data];
    if (dialogIndeks >= 0) {
        nyData[dialogIndeks] = dialog;
    } else {
        nyData.unshift(dialog); // prepend
    }
    return { ...state, status: STATUS.OK, data: nyData };
}

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case OPPRETTER_HENVENDELSE:
            return { ...state, status: STATUS.RELOADING };
        case HENTET:
            return {
                ...state,
                status: STATUS.OK,
                data,
            };
        case ESKALERINGS_FILTER_TYPE:
            return {
                ...state,
                esklaringsFilter: !state.esklaringsFilter,
            };
        case HENTING_FEILET:
        case OPPRETT_HENVENDELSE_FEILET:
        case DIALOG_LEST_FEILET:
        case OPPDATER_DIALOG_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case OPPRETTET_HENVENDELSE:
            return {
                ...nyStateMedOppdatertDialog(state, data),
                sisteHenvendelseData: data,
            };
        case DIALOG_LEST_OK:
        case OPPDATER_DIALOG_OK:
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
        PENDING: HENTER,
    });
}

export function nyHenvendelse(henvendelse) {
    return doThenDispatch(() => Api.nyHenvendelse(henvendelse), {
        OK: OPPRETTET_HENVENDELSE,
        FEILET: OPPRETT_HENVENDELSE_FEILET,
        PENDING: OPPRETTER_HENVENDELSE,
    });
}

export function markerDialogSomLest(dialogId) {
    return doThenDispatch(() => Api.markerDialogSomLest(dialogId), {
        OK: DIALOG_LEST_OK,
        FEILET: DIALOG_LEST_FEILET,
        PENDING: DIALOG_LEST,
    });
}

export function oppdaterFerdigbehandlet(dialogId, erFerdigbehandlet) {
    return doThenDispatch(
        () => Api.oppdaterFerdigbehandlet(dialogId, erFerdigbehandlet),
        {
            OK: OPPDATER_DIALOG_OK,
            FEILET: OPPDATER_DIALOG_FEILET,
            PENDING: OPPDATER_DIALOG,
        }
    );
}

export function oppdaterVenterPaSvar(dialogId, venterPaSvar) {
    return doThenDispatch(
        () => Api.oppdaterVenterPaSvar(dialogId, venterPaSvar),
        {
            OK: OPPDATER_DIALOG_OK,
            FEILET: OPPDATER_DIALOG_FEILET,
            PENDING: OPPDATER_DIALOG,
        }
    );
}
