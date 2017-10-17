import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';

function selectMalSlice(state) {
    return state.data.mal;
}

function selectMalListeSlice(state) {
    return state.data.malListe;
}

function selectMalData(state) {
    return selectMalSlice(state).data;
}

function selectMalListeData(state) {
    return selectMalListeSlice(state).data;
}

export function selectMalStatus(state) {
    return selectMalSlice(state).status;
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
