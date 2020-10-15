import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { STATUS } from '../../ducks/utils';
import { selectMalSlice } from './aktivitetsmal-reducer';

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
    return selectMalListeData(state).filter((mal) => datoErIPeriode(mal.dato, state));
}

export function selectMalListeFeilmeldinger(state) {
    const malSlice = {
        mal: selectMalSlice(state),
        malListe: selectMalListeSlice(state),
    };
    return Object.keys(malSlice)
        .filter((key) => malSlice[key].status === STATUS.ERROR)
        .map((key) => malSlice[key].feil)
        .filter((x) => x);
}
