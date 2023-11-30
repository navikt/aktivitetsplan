import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../reducer';

/* Fnr is available as a prop at first render, should only be set in preloadedState argument
 * This state used to make fnr available in thunks in addition to context  */
const { reducer } = createSlice({
    name: 'displayedUser',
    reducers: {},
    initialState: {
        fnr: undefined as string | undefined,
    },
});

export const displayedUser = reducer;

export const getFnrIfVeileder = (state: RootState): string | undefined => {
    return state.view.displayedUser.fnr;
};
