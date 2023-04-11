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
            // merk: hvis du har flere thunks, så vil siste dispatch overskrive staten
            builder.addMatcher(
                (action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/pending'),
                (state) => {
                    state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
                }
            );
            builder.addMatcher(
                (action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.data = action.payload || initialState.data;
                    state.status = Status.OK;
                }
            );
            builder.addMatcher(
                (action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/rejected'),
                (state) => {
                    state.status = Status.ERROR;
                }
            );
        },
    });
};

export default createGenericSlice;
