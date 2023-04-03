import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/dialogAPI';
import createGenericSlice from '../../createGenericSlice';
import { Eskaleringsvarsel } from '../../datatypes/dialogTypes';

const eskaleringsvarselSlice = createGenericSlice<Eskaleringsvarsel>({
    name: 'eskaleringsvarsel',
    reducers: {},
});

export const fetchEskaleringsvarsel = createAsyncThunk(`${eskaleringsvarselSlice.name}/fetchHarNivaa4`, async () => {
    return await Api.fetchEskaleringsvarsel();
});

const { reducer } = eskaleringsvarselSlice;

export default reducer;
