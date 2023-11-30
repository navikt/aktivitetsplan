import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';
import { getFnrIfVeileder } from '../../utils/displayedUserSlice';
import { RootState } from '../../reducer';

const malListeSlice = createGenericSlice({
    name: 'malListe',
    initialState: { data: [], status: Status.NOT_STARTED } as GenericState<Mal[]>,
    reducers: {},
});

export const hentMalListe = createAsyncThunk(`${malListeSlice.name}/fetchMalListe`, async (_, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.fetchMalListe(fnr);
});

export default malListeSlice.reducer;
