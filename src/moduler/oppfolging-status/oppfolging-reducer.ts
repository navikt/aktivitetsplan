import { ActionCreatorWithPayload, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import { RequestStatus, STATUS, doThenDispatch } from '../../api/utils';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { UpdateTypes, widowEvent } from '../../utils/UpdateHandler';

/*
// Actions
export const OK = 'oppfolging/OK';
export const FEILET = 'oppfolging/FEILET';
export const PENDING = 'oppfolging/PENDING';

export const SETT_DIGITAL_OK = 'oppfolging/digital/OK';
export const SETT_DIGITAL_FEILET = 'oppfolging/digital/FEILET';
export const SETT_DIGITAL_PENDING = 'oppfolging/digital/PENDING';
*/

interface OppfolgingSlice {
    status: RequestStatus;
    data: OppfolgingStatus;
    feil: Feil | undefined;
}

const initalState: OppfolgingSlice = {
    status: STATUS.NOT_STARTED,
    data: {} as any,
    feil: undefined as Feil | undefined,
};

interface Feil {}

interface DataAction<Data> {
    type: string;
    data: Data;
    payload: never;
}

const oppfolgingSlice = createSlice({
    name: 'oppfolging',
    initialState: initalState as OppfolgingSlice,
    reducers: {
        SETT_DIGITAL_OK(state, action: DataAction<OppfolgingStatus>) {
            widowEvent(UpdateTypes.Oppfolging);
            state.status = STATUS.OK;
            state.data = action.data;
        },
        OK(state, action: DataAction<OppfolgingStatus>) {
            state.status = STATUS.OK;
            state.data = action.data;
        },
        FEILET(state, action: DataAction<Feil>) {
            state.status = STATUS.ERROR;
            state.feil = action.data;
        },
        SETT_DIGITAL_FEILET(state, action: DataAction<Feil>) {
            state.status = STATUS.ERROR;
            state.feil = action.data;
        },
        PENDING(state) {
            state.status = state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING;
        },
        SETT_DIGITAL_PENDING(state) {
            state.status = state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING;
        },
    },
});

export const { SETT_DIGITAL_OK, FEILET, PENDING, SETT_DIGITAL_FEILET, SETT_DIGITAL_PENDING, OK } =
    oppfolgingSlice.actions;

export default oppfolgingSlice.reducer;

const actionType = (actionCreator: ActionCreatorWithPayload<any>) => actionCreator(null).type;

export function hentOppfolging() {
    return doThenDispatch(() => Api.fetchOppfolging(), {
        OK: actionType(OK),
        FEILET: actionType(FEILET),
        PENDING: actionType(PENDING),
    });
}

export function settDigital() {
    return doThenDispatch(() => Api.settDigital(), {
        OK: actionType(SETT_DIGITAL_OK),
        FEILET: actionType(SETT_DIGITAL_FEILET),
        PENDING: actionType(SETT_DIGITAL_PENDING),
    });
}
