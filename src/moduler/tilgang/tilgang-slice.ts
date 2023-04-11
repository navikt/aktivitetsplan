import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/personAPI';
import createGenericSlice from '../../createGenericSlice';
import { HarLoggetInnRespons } from '../../datatypes/types';

const tilgangSlice = createGenericSlice<HarLoggetInnRespons>({
    name: 'tilgang',
    reducers: {},
});

export const fetchNivaa4 = createAsyncThunk(`${tilgangSlice.name}/fetchHarNivaa4`, async (fnr: string) => {
    return await Api.hentHarNivaa4(fnr);
});

export default tilgangSlice.reducer;
