import createGenericSlice, { Status } from '../../../createGenericSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../../api/aktivitetAPI';

interface Innsynsrett {
    foresatteHarInnsynsrett: boolean | undefined;
    status: Status;
}

const innsynsrettSlice = createGenericSlice<Innsynsrett>({
    name: 'innsynsrett',
    reducers: {},
});

export const hentInnsynsrett = createAsyncThunk(`${innsynsrettSlice.name}/fetchInnsynsrett`, async () => {
    return await Api.hentInnsynsrett();
});

export const innsynsrettInfoSkalVises = false;

export const innsynsrettReducer = innsynsrettSlice.reducer;
