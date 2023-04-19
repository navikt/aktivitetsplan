import { RootState } from '../../store';
import { selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { selectMalListe } from './malliste-selector';

export const selectMalSlice = (state: RootState) => state.data.mal;

const selectMalData = (state: RootState) => selectMalSlice(state).data;

export const selectMalStatus = (state: RootState) => selectMalSlice(state).status;

export function selectGjeldendeMal(state: RootState) {
    return selectViserInneverendePeriode(state) ? selectMalData(state) : selectMalListe(state)[0];
}
