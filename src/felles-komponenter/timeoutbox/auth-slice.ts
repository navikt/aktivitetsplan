import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/authAPI';
import createGenericSlice from '../../createGenericSlice';
import { AuthInfoResponse } from '../../datatypes/types';

const authSlice = createGenericSlice<AuthInfoResponse>({
    name: 'auth',
    reducers: {},
});

export const fetchAuthInfo = createAsyncThunk(`${authSlice.name}/fetchAuthInfo`, async () => {
    return await Api.fetchAuthInfo();
});

export default authSlice.reducer;
