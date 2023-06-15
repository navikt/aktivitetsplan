import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/featureAPI';
import createGenericSlice, { GenericState, Status } from '../../createGenericSlice';
import { Features, VIS_SPRAKSJEKK } from './feature';

const initialFeatures: Features = {
    [VIS_SPRAKSJEKK]: false,
};

const featureSlice = createGenericSlice({
    name: 'feature',
    initialState: { data: initialFeatures, status: Status.NOT_STARTED } as GenericState<Features>,
    reducers: {},
});

export const hentFeatures = createAsyncThunk(`${featureSlice.name}/fetchFeatures`, async () => {
    return await Api.hentFeatures();
});

export default featureSlice.reducer;
