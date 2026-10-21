import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { Status } from '../../store/createGenericSlice';
import { hentFraSessionStorage, LocalStorageElement } from '../../mocks/demo/localStorage';
import { fetchOppfolging, OppfolgingStatusResponse } from '../../api/veilarboppfolging';

const oppfolgingSlice = createGenericSlice({
    name: 'oppfolging',
    initialState: { data: undefined, status: Status.NOT_STARTED } as
        | { data: undefined; status: Status.NOT_STARTED | Status.ERROR | Status.RELOADING | Status.PENDING }
        | { data: OppfolgingStatusResponse; status: Status.OK },
    reducers: {},
});

export const hentOppfolging = createAsyncThunk(`${oppfolgingSlice.name}/fetchOppfolging`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await fetchOppfolging(fnr ?? undefined);
});

export const settDigital = createAsyncThunk(`${oppfolgingSlice.name}/settDigital`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.settDigital(fnr ?? undefined);
});

export default oppfolgingSlice.reducer;
