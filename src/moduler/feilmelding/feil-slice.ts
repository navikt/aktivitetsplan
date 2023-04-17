import { createSlice, isAsyncThunkAction, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

import { SerializedError } from '../../api/utils';

type ErrorSliceType = Record<string, SerializedError>;

const errorSlice = createSlice({
    name: 'feil',
    initialState: {} as ErrorSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isRejected(action),
            (state, action) => {
                state[action.type] = { ...action.error, type: action.type };
            }
        );
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isFulfilled(action),
            (state, action) => {
                delete state[action.type];
            }
        );
    },
});

export default errorSlice.reducer;
