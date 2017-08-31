import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';

function slice(state) {
    return state.data.mal;
}

export function selectMalStatus(state) {
    return slice(state).status;
}

export function selectMalListe(state) {
    return slice(state).liste.filter(mal => datoErIPeriode(mal.dato, state));
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? slice(state).gjeldende
        : selectMalListe(state)[0];
}
