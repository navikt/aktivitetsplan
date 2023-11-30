import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { Status } from '../../createGenericSlice';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { getFnrIfVeileder } from '../../utils/displayedUserSlice';
import { RootState } from '../../reducer';

const oppfolgingSlice = createGenericSlice({
    name: 'oppfolging',
    initialState: { data: undefined, status: Status.NOT_STARTED } as
        | { data: undefined; status: Status.NOT_STARTED | Status.ERROR | Status.RELOADING | Status.PENDING }
        | { data: OppfolgingStatus; status: Status.OK },
    reducers: {},
});

export const hentOppfolging = createAsyncThunk(`${oppfolgingSlice.name}/fetchOppfolging`, async (_, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.fetchOppfolging(fnr);
});

export const settDigital = createAsyncThunk(`${oppfolgingSlice.name}/settDigital`, async (_, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.settDigital(fnr);
});

export default oppfolgingSlice.reducer;
