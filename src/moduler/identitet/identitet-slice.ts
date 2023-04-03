import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice from '../../createGenericSlice';
import { Me } from '../../datatypes/oppfolgingTypes';

const identitetSlice = createGenericSlice<Me>({
    name: 'identitet',
    reducers: {},
});

export const fetchIdentitet = createAsyncThunk(`${identitetSlice.name}/fetchIdentitet`, async () => {
    return await Api.fetchIdentitet();
});

const { reducer } = identitetSlice;

export default reducer;
