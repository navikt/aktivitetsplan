import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { Status } from '../../createGenericSlice';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { hentFraSessionStorage, LocalStorageElement } from '../../mocks/demo/localStorage';

const oppfolgingSlice = createGenericSlice({
    name: 'oppfolging',
    initialState: { data: undefined, status: Status.NOT_STARTED } as
        | { data: undefined; status: Status.NOT_STARTED | Status.ERROR | Status.RELOADING | Status.PENDING }
        | { data: OppfolgingStatus; status: Status.OK },
    reducers: {},
});

export const hentOppfolging = createAsyncThunk(`${oppfolgingSlice.name}/fetchOppfolging`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.fetchOppfolging(fnr ?? undefined);
});

export const settDigital = createAsyncThunk(`${oppfolgingSlice.name}/settDigital`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.settDigital(fnr ?? undefined);
});

export default oppfolgingSlice.reducer;
