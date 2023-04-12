import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/dialogAPI';
import createGenericSlice from '../../createGenericSlice';
import { Eskaleringsvarsel } from '../../datatypes/dialogTypes';

const eskaleringsvarselSlice = createGenericSlice<Eskaleringsvarsel>({
    name: 'eskaleringsvarsel',
    reducers: {},
});

export const hentEskaleringsvarsel = createAsyncThunk(
    `${eskaleringsvarselSlice.name}/fetchEskaleringsvarsel`,
    async () => {
        return await Api.fetchEskaleringsvarsel();
    }
);

export default eskaleringsvarselSlice.reducer;
