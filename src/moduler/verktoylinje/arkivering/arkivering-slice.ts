import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../../api/arkivAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

interface ArkivState {
    status: Status;
}

const arkivSlice = createGenericSlice({
    name: 'arkiv',
    initialState: {
        status: Status.NOT_STARTED,
    } as ArkivState,
    reducers: {},
});

export const arkiver = createAsyncThunk(`${arkivSlice.name}/arkiver`, async () => {
    return await Api.arkiver();
});

export function selectArkivStatus(state: RootState) {
    return state.data.arkiv.status;
}

export const arkivReducer = arkivSlice.reducer;
