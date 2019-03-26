import * as Api from '../oppfolging-status/oppfolging-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { selectMalListe } from './aktivitetsmal-selector';

const {
    reducer,
    action,
    selectStatus,
    selectData,
    selectSlice,
} = createActionsAndReducer('mal');

export default reducer;

export function hentMal() {
    return action(() => Api.hentMal());
}

export function oppdaterMal(mal) {
    return action(() => Api.lagreMal(mal));
}

export function selectMalData(state) {
    return selectData(state);
}

export function selectMalSlice(state) {
    return selectSlice(state);
}

export function selectMalStatus(state) {
    return selectStatus(state);
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? selectMalData(state)
        : selectMalListe(state)[0];
}
