import * as Api from '../../api/dialogAPI';
import { STATUS, doThenDispatch } from '../../api/utils';
import { UpdateTypes, widowEvent } from '../../utils/UpdateHandler';

// Actions
export const HENTER = 'dialog/hent';
export const HENTET = 'dialog/hent/ok';
export const HENTING_FEILET = 'dialog/hent/fail';

export const ESKALERINGS_FILTER_TYPE = 'dialog/eskalering';

export const SEND_FORHANDSORIENTERING_OK = 'dialog/forhandsorientering/ok';
export const SEND_FORHANDSORIENTERING_FEILET = 'dialog/forhandsorientering/fail';
export const SEND_FORHANDSORIENTERING = 'dialog/forhandsorientering';

const initalState = {
    status: STATUS.NOT_STARTED,
    data: [],
    esklaringsFilter: false,
    sistOppdatert: new Date().toISOString(),
};

function nyStateMedOppdatertDialog(state, dialog) {
    const { data } = state;
    const dialogIndeks = data.findIndex((d) => d.id === dialog.id);
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
    const { data } = action;
    switch (action.type) {
        case HENTET:
            return {
                ...state,
                status: STATUS.OK,
                sistOppdatert: new Date().toISOString(),
                data,
            };
        case ESKALERINGS_FILTER_TYPE:
            return {
                ...state,
                esklaringsFilter: !state.esklaringsFilter,
            };
        case HENTING_FEILET:
        case SEND_FORHANDSORIENTERING_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case SEND_FORHANDSORIENTERING_OK:
            widowEvent(UpdateTypes.Dialog);
            return nyStateMedOppdatertDialog(state, data);
        default:
            return state;
    }
}

// Action creator
export function hentDialog() {
    return doThenDispatch(() => Api.fetchDialoger(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER,
    });
}
