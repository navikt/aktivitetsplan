import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/lestAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Lest } from '../../datatypes/lestTypes';

const lestSlice = createGenericSlice({
    name: 'lest',
    initialState: { data: [], status: Status.NOT_STARTED } as GenericState<Lest[]>,
    reducers: {},
});

export const hentLest = createAsyncThunk(`${lestSlice.name}/fetchSisteLest`, async () => {
    return await Api.fetchSisteLest();
});

export default lestSlice.reducer;
