import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectMalSlice } from './aktivitetsmal-selector';

function selectMalListeSlice(state: RootState) {
    return state.data.malListe;
}

function selectMalListeData(state: RootState) {
    return selectMalListeSlice(state).data;
}

export function selectMalListeStatus(state: RootState) {
    return selectMalListeSlice(state).status;
}

export function selectMalListe(state: RootState) {
    return selectMalListeData(state).filter((mal) => selectDatoErIPeriode(mal.dato, state));
}

export function selectMalListeFeilmeldinger(state: RootState) {
    const malSlice = {
        mal: selectMalSlice(state),
        malListe: selectMalListeSlice(state),
    };
    return Object.keys(malSlice)
        .filter((key) => malSlice[key].status === Status.ERROR)
        .map((key) => malSlice[key].feil)
        .filter((x) => x);
}
