import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { createDefaultDataSelectors } from '../../ducks/rest-reducer';

const { selectStatus, selectData } = createDefaultDataSelectors('mal', {});

function selectMalData(state) {
    return selectData(state);
}

export function selectMalStatus(state) {
    return selectStatus(state);
}

function selectMalListeSlice(state) {
    return state.data.malListe;
}

function selectMalListeData(state) {
    return selectMalListeSlice(state).data;
}

export function selectMalListeStatus(state) {
    return selectMalListeSlice(state).status;
}

export function selectMalListe(state) {
    return selectMalListeData(state).filter(mal =>
        datoErIPeriode(mal.dato, state)
    );
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? selectMalData(state)
        : selectMalListe(state)[0];
}
