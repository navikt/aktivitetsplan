import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/lestAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Lest } from '../../datatypes/lestTypes';
import { getFnrIfVeileder } from '../../utils/displayedUserSlice';
import { RootState } from '../../reducer';

const lestSlice = createGenericSlice({
    name: 'lest',
    initialState: { data: [], status: Status.NOT_STARTED } as GenericState<Lest[]>,
    reducers: {},
});

export const hentLest = createAsyncThunk(`${lestSlice.name}/fetchSisteLest`, async (_, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.fetchSisteLest(fnr);
});

export default lestSlice.reducer;
