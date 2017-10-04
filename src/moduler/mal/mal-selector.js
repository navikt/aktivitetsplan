import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';

export function selectMalSlice(state) {
    return state.data.mal;
}

export function selectMalStatus(state) {
    return selectMalSlice(state).status;
}

export function selectMalListe(state) {
    return selectMalSlice(state).liste.filter(mal =>
        datoErIPeriode(mal.dato, state)
    );
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? selectMalSlice(state).gjeldende
        : selectMalListe(state)[0];
}
