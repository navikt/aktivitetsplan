import { SliceCaseReducers, ValidateSliceCaseReducers, createSlice } from '@reduxjs/toolkit';

export enum Status {
    NOT_STARTED = 'NOT_STARTED',
    PENDING = 'PENDING',
    OK = 'OK',
    RELOADING = 'RELOADING',
    ERROR = 'ERROR',
}

export interface GenericState<T> {
    data?: T;
    status: Status;
    feil?: T;
}

const createGenericSlice = <
    T,
    Reducers extends SliceCaseReducers<GenericState<T>> = SliceCaseReducers<GenericState<T>>
>({
    name,
    initialState = { status: Status.NOT_STARTED },
    reducers,
}: {
    name: string;
    initialState?: GenericState<T>;
    reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>;
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            ...reducers,
        },
        extraReducers: (builder) => {
            builder.addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
                }
            );
            builder.addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.data = action.payload || initialState.data;
                    state.status = Status.OK;
                }
            );
            builder.addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.feil = action.payload;
                    state.status = Status.ERROR;
                }
            );
        },
    });
};

export default createGenericSlice;
