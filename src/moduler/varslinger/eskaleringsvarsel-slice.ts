import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Eskaleringsvarsel } from '../../datatypes/dialogTypes';

const forhaandsVarselOmStansSlice = createSlice({
    name: 'eskaleringsvarsel',
    initialState: {
        data: undefined as undefined | Eskaleringsvarsel,
    },
    reducers: {
        setForhaandsVarselOmStans(state, action: PayloadAction<Eskaleringsvarsel>) {
            state.data = action.payload;
        },
    },
});

export const setForhaandsVarselOmStans = forhaandsVarselOmStansSlice.actions.setForhaandsVarselOmStans;
export default forhaandsVarselOmStansSlice.reducer;
