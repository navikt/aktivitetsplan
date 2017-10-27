import { datoErIPeriode } from '../filtrering/filter/filter-utils';

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
