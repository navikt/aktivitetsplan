import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Status } from '../../createGenericSlice';
import { Dialog } from '../../datatypes/dialogTypes';
import { hentDialogerGraphql } from '../../api/dialogGraphql';
import { setForhaandsVarselOmStans } from '../varslinger/eskaleringsvarsel-slice';

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
            state.data = action.payload.data.dialoger;
            state.status = Status.OK;
            state.sistOppdatert = new Date().toISOString();
        });
        builder.addCase(hentDialoger.rejected, (state, action) => {
            state.status = Status.ERROR;
        });
    },
});

export const hentDialoger = createAsyncThunk(`${dialogSlice.name}/fetchDialoger`, async (_, thunkAPI) => {
    const dialogerOgVarsel = await hentDialogerGraphql();
    if (dialogerOgVarsel?.data?.stansVarsel) {
        thunkAPI.dispatch(setForhaandsVarselOmStans(dialogerOgVarsel.data.stansVarsel));
    }
    return dialogerOgVarsel;
});

export default dialogSlice.reducer;
