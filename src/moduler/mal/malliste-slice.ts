import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';
import { hentFraSessionStorage, LocalStorageElement } from '../../mocks/demo/localStorage';

const malListeSlice = createGenericSlice({
    name: 'malListe',
    initialState: { data: [], status: Status.NOT_STARTED } as GenericState<Mal[]>,
    reducers: {},
});

export const hentMalListe = createAsyncThunk(`${malListeSlice.name}/fetchMalListe`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.fetchMalListe(fnr ?? undefined);
});

export default malListeSlice.reducer;
