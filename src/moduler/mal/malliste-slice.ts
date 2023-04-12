import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';

const malListeSlice = createGenericSlice({
    name: 'malListe',
    initialState: { data: [], status: Status.NOT_STARTED } as GenericState<Mal[]>,
    reducers: {},
});

export const hentMalListe = createAsyncThunk(`${malListeSlice.name}/fetchMalListe`, async () => {
    return await Api.fetchMalListe();
});

export default malListeSlice.reducer;
