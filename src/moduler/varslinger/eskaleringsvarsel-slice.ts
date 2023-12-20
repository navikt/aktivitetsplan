import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/dialogAPI';
import createGenericSlice from '../../createGenericSlice';
import { Eskaleringsvarsel } from '../../datatypes/dialogTypes';
import { getFnrIfVeileder } from '../../utils/displayedUserSlice';
import { RootState } from '../../reducer';

const eskaleringsvarselSlice = createGenericSlice<Eskaleringsvarsel>({
    name: 'eskaleringsvarsel',
    reducers: {},
});

export const hentEskaleringsvarsel = createAsyncThunk(
    `${eskaleringsvarselSlice.name}/fetchEskaleringsvarsel`,
    async (_, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.fetchEskaleringsvarsel(fnr);
    },
);

export default eskaleringsvarselSlice.reducer;
