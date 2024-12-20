import { RootState } from '../../store';
import { selectMalListe } from './malliste-selector';
import { selectViserAktivPeriode } from '../oppfolging-status/oppfolging-selector';

export const selectMalSlice = (state: RootState) => state.data.mal;

const selectMalData = (state: RootState) => selectMalSlice(state).data;

export const selectMalStatus = (state: RootState) => selectMalSlice(state).status;

export function selectGjeldendeMal(state: RootState) {
    return selectViserAktivPeriode(state) ? selectMalData(state) : selectMalListe(state)[0];
}
