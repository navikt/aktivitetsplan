import { selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { RootState } from '../../store/rootReducer';

function selectMalListeSlice(state: RootState) {
    return state.data.malListe;
}

function selectMalListeData(state: RootState) {
    return selectMalListeSlice(state).data;
}

export function selectMalListe(state: RootState) {
    return selectMalListeData(state)?.filter((mal) => (mal.dato ? selectDatoErIPeriode(mal.dato, state) : true)) || [];
}
