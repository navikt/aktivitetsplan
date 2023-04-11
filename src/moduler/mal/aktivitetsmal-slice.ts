import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';

// TODO merge aktivitetsmal og malliste

const malSlice = createGenericSlice({
    name: 'mal',
    initialState: { data: {}, status: Status.NOT_STARTED } as GenericState<Mal>,
    reducers: {},
});

export const fetchMal = createAsyncThunk(`${malSlice.name}/fetchMal`, async (_, thunkAPI) => {
    return await Api.fetchMal();
});

export const oppdaterMal = createAsyncThunk(`${malSlice.name}/oppdaterMal`, async (mal: { mal: string }) => {
    return await Api.lagreMal(mal);
});

export default malSlice.reducer;
