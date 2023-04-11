import * as Api from '../../api/oppfolgingAPI';
import { doThenDispatch } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';

const PENDING = `MAL/PENDING`;
const OK = `MAL/OK`;
const FEILET = `MAL/FEILET`;
const LES = 'MAL/LEST';

interface Action {
    type: string;
    data: Mal;
}

interface State {
    data: Mal | {};
    status: string;
}

const initialState = { data: {}, status: Status.NOT_STARTED };

function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status: state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING,
            };
        case OK:
            return {
                ...state,
                data: { ...state.data, ...action.data },
                status: Status.OK,
            };
        case FEILET:
            return {
                ...state,
                feil: action.data,
                status: Status.ERROR,
            };
        case LES:
            return {
                ...state,
                data: { ...state.data, lest: true },
            };

        default:
            return state;
    }
}

const action = (fn: () => void) => doThenDispatch(fn, { PENDING, FEILET, OK });

export default reducer;

export function lesMal() {
    return { type: LES };
}

export function hentMal() {
    return action(() => Api.fetchMal());
}

export function oppdaterMal(data: { mal: string }) {
    return action(() => Api.lagreMal(data));
}
