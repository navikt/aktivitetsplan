import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Me } from '../../datatypes/oppfolgingTypes';

const identitetSlice = createGenericSlice({
    name: 'identitet',
    initialState: { data: {}, status: Status.NOT_STARTED } as GenericState<Me>,
    reducers: {},
});

export const hentIdentitet = createAsyncThunk(`${identitetSlice.name}/fetchIdentitet`, async () => {
    return await Api.fetchIdentitet();
});

export default identitetSlice.reducer;
