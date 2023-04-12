import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';

const oppfolgingSlice = createGenericSlice({
    name: 'oppfolging',
    initialState: { data: {}, status: Status.NOT_STARTED } as GenericState<OppfolgingStatus>,
    reducers: {},
});

export const hentOppfolging = createAsyncThunk(`${oppfolgingSlice.name}/fetchOppfolging`, async () => {
    return await Api.fetchOppfolging();
});

export const settDigital = createAsyncThunk(`${oppfolgingSlice.name}/settDigital`, async () => {
    return await Api.settDigital();
});

export default oppfolgingSlice.reducer;
