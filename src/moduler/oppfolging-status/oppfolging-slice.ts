import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { Status } from '../../createGenericSlice';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';

const oppfolgingSlice = createGenericSlice({
    name: 'oppfolging',
    initialState: { data: undefined, status: Status.NOT_STARTED } as
        | { data: undefined; status: Status.NOT_STARTED | Status.ERROR | Status.RELOADING | Status.PENDING }
        | { data: OppfolgingStatus; status: Status.OK },
    reducers: {},
});

export const hentOppfolging = createAsyncThunk(`${oppfolgingSlice.name}/fetchOppfolging`, async () => {
    return await Api.fetchOppfolging();
});

export const settDigital = createAsyncThunk(`${oppfolgingSlice.name}/settDigital`, async () => {
    return await Api.settDigital();
});

export default oppfolgingSlice.reducer;
