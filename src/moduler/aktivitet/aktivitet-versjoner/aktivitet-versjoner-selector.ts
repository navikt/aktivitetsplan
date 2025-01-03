import { RootState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';

const selectVersjonerSlice = (state: RootState) => state.data.versjoner;

const selectVersjonerData = (state: RootState) => selectVersjonerSlice(state).data;

export const selectVersjonerStatus = (state: RootState) => selectVersjonerSlice(state).status;

export const selectSorterteVersjoner = createSelector(selectVersjonerData, (readOnlyVersjoner) => {
    const versjoner = [...readOnlyVersjoner];
    return versjoner.sort((a, b) => b.endretDato.localeCompare(a.endretDato));
});
