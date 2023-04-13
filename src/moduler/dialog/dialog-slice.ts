import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../api/dialogAPI';
import { Status } from '../../createGenericSlice';
import { Dialog } from '../../datatypes/dialogTypes';

interface DialogState {
    data: Dialog[];
    status: Status;
    sistOppdatert: string;
}

const initialState: DialogState = {
    data: [],
    status: Status.NOT_STARTED,
    sistOppdatert: new Date().toISOString(),
};

const dialogSlice = createSlice({
    name: 'dialog',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentDialoger.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = Status.OK;
            state.sistOppdatert = new Date().toISOString();
        });
        builder.addCase(hentDialoger.rejected, (state, action) => {
            console.log(action);
            state.status = Status.ERROR;
        });
    },
});

export const hentDialoger = createAsyncThunk(`${dialogSlice.name}/fetchDialoger`, async (_, thunkAPI) => {
    return await Api.fetchDialoger();
});

export default dialogSlice.reducer;
