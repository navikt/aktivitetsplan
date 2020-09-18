import * as Api from '../oppfolging-status/oppfolging-api';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { selectMalListe } from './aktivitetsmal-selector';
import { doThenDispatch, STATUS } from '../../ducks/utils';
import { Mal } from '../../types';

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

const initialState = { data: {}, status: STATUS.NOT_STARTED };

function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status: state.status === STATUS.NOT_STARTED ? STATUS.PENDING : STATUS.RELOADING,
            };
        case OK:
            return {
                ...state,
                data: { ...action.data, ...state.data },
                status: STATUS.OK,
            };
        case FEILET:
            return {
                ...state,
                feil: action.data,
                status: STATUS.ERROR,
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
const selectSlice = (state: any) => state.data.mal;
const selectStatus = (state: any) => selectSlice(state).status;
const selectData = (state: any) => selectSlice(state).data;

export default reducer;

export function lesMal() {
    return { type: LES };
}

export function hentMal() {
    return action(() => Api.hentMal());
}

export function oppdaterMal(data: { mal: string }) {
    return action(() => Api.lagreMal(data));
}

export function selectMalData(state: any) {
    return selectData(state);
}

export function selectMalSlice(state: any) {
    return selectSlice(state);
}

export function selectMalStatus(state: any) {
    return selectStatus(state);
}

export function selectGjeldendeMal(state: any) {
    return selectViserInneverendePeriode(state) ? selectMalData(state) : selectMalListe(state)[0];
}
