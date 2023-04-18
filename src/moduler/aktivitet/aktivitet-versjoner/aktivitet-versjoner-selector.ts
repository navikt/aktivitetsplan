import { RootState } from '../../../store';

const selectVersjonerSlice = (state: RootState) => state.data.versjoner;

const selectVersjonerData = (state: RootState) => selectVersjonerSlice(state).data;

export const selectVersjonerStatus = (state: RootState) => selectVersjonerSlice(state).status;

export const selectSorterteVersjoner = (state: RootState) => {
    const versjoner = [...selectVersjonerData(state)];
    return versjoner.sort((a, b) => b.endretDato.localeCompare(a.endretDato));
};
