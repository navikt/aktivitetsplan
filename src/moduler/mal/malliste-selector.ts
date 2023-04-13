import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeilSlice } from '../feilmelding/feil-slice';
import { selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectMalSlice } from './aktivitetsmal-selector';
import { hentMal } from './aktivitetsmal-slice';
import { hentMalListe } from './malliste-slice';

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
    return selectMalListeData(state)?.filter((mal) => (mal.dato ? selectDatoErIPeriode(mal.dato, state) : true)) || [];
}

const exists = (error: any) => !!error;
export function selectMalListeFeilmeldinger(state: RootState) {
    const { feilSlice, mal, malListe } = {
        mal: selectMalSlice(state),
        malListe: selectMalListeSlice(state),
        feilSlice: selectFeilSlice(state),
    };
    return [
        mal.status === Status.ERROR && feilSlice[hentMal.rejected.type],
        malListe.status === Status.ERROR && feilSlice[hentMalListe.rejected.type],
    ].filter(exists);
}
