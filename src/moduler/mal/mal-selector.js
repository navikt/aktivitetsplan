import { datoErIPeriode } from '../filter/filter-utils';
import { selectViserInneverendePeriode } from '../filter/filter-selector';

export function selectMalReducer(state) {
    return state.data.mal;
}

export function selectMalListe(state) {
    return selectMalReducer(state).liste.filter(mal =>
        datoErIPeriode(mal.dato, state)
    );
}

export function selectGjeldendeMal(state) {
    return selectViserInneverendePeriode(state)
        ? selectMalReducer(state).gjeldende
        : selectMalListe(state)[0];
}
