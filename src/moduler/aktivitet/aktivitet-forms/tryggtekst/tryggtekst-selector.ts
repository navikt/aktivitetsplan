import { RootState } from '../../../../store';
import { createSelector } from '@reduxjs/toolkit';

const selectTryggTekst = (state: RootState) => state.data.tryggTekst;

export const selectPersonopplusningSjekk = createSelector(selectTryggTekst, (tryggTekstSlice) => {
    return {
        status: tryggTekstSlice.status,
        data: tryggTekstSlice.data,
    };
});
