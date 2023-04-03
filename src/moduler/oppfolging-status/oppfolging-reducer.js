import * as Api from '../../api/oppfolgingAPI';
import { doThenDispatch } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { UpdateTypes, widowEvent } from '../../utils/UpdateHandler';

// Actions
export const OK = 'oppfolging/OK';
export const FEILET = 'oppfolging/FEILET';
export const PENDING = 'oppfolging/PENDING';

export const SETT_DIGITAL_OK = 'oppfolging/digital/OK';
export const SETT_DIGITAL_FEILET = 'oppfolging/digital/FEILET';
export const SETT_DIGITAL_PENDING = 'oppfolging/digital/PENDING';

const initalState = {
    status: Status.NOT_STARTED,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case SETT_DIGITAL_OK:
            widowEvent(UpdateTypes.Oppfolging);
            return {
                ...state,
                status: Status.OK,
                data: action.data,
            };
        case OK:
            return {
                ...state,
                status: Status.OK,
                data: action.data,
            };
        case FEILET:
        case SETT_DIGITAL_FEILET:
            return {
                ...state,
                status: Status.ERROR,
                feil: action.data,
            };
        case PENDING:
        case SETT_DIGITAL_PENDING:
            return {
                ...state,
                status: state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING,
            };
        default:
            return state;
    }
}

export function hentOppfolging() {
    return doThenDispatch(() => Api.fetchOppfolging(), {
        OK,
        FEILET,
        PENDING,
    });
}

export function settDigital() {
    return doThenDispatch(() => Api.settDigital(), {
        OK: SETT_DIGITAL_OK,
        FEILET: SETT_DIGITAL_FEILET,
        PENDING: SETT_DIGITAL_PENDING,
    });
}
