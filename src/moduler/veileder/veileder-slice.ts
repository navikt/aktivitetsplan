import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/veilederAPI';
import createGenericSlice from '../../createGenericSlice';
import { VeilederInfo } from '../../datatypes/types';

const veilederSlice = createGenericSlice<VeilederInfo>({
    name: 'veileder',
    reducers: {},
});

export const hentVeilederInfo = createAsyncThunk(`${veilederSlice.name}/fetchVeilederInfo`, async () => {
    return await Api.fetchVeilederInfo();
});

export default veilederSlice.reducer;
