import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Me } from '../../datatypes/oppfolgingTypes';

const identitetSlice = createGenericSlice({
    name: 'identitet',
    initialState: { data: {}, status: Status.NOT_STARTED } as GenericState<Me>,
    reducers: {},
});

export const fetchIdentitet = createAsyncThunk(`${identitetSlice.name}/fetchIdentitet`, async () => {
    return await Api.fetchIdentitet();
});

const { reducer } = identitetSlice;

export default reducer;
