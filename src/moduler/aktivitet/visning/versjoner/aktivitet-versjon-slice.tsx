import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { hentAktivitetsVersjonGraphql, TidligereReferatAktivitet } from '../../../../api/aktivitetsplanGraphql';
import { LoaderFunction } from 'react-router';
import { AktivitetsId, AktivitetsVersjon } from '../../../../datatypes/brandedTypes';
import { Dispatch } from '../../../../store/store';
import { RootState } from '../../../../store/rootReducer';
import { GraphqlResponse } from '../../../../api/graphql/graphqlResult';
import createGenericSlice, { GenericState, Status } from '../../../../store/createGenericSlice';

export const aktivitetVersjonSlice = createGenericSlice({
    name: 'aktivitetVersjonVisning',
    initialState: {
        data: undefined,
        status: Status.NOT_STARTED,
    } as GenericState<GraphqlResponse<{ aktivitet: TidligereReferatAktivitet }>>,
    reducers: {},
});

export const aktivitetVersjonSliceReducer = aktivitetVersjonSlice.reducer;

/*
 * Selectors
 * */
export function selectAktivitetVersjon(state: RootState) {
    return state.data.aktivitetVersjon?.data?.data.aktivitet;
}
export const selectAktivitetsVersjonLoading = (state: RootState) => {
    return (
        state.data.aktivitetVersjon.status === Status.PENDING ||
        state.data.aktivitetVersjon.status === Status.RELOADING ||
        state.data.aktivitetVersjon.status === Status.NOT_STARTED
    );
};
export const selectAktivitetsVersjonHasError = (state: RootState) => {
    return state.data.aktivitetVersjon.status === Status.ERROR;
};

/*
 * Thunks - only used in loader
 * */
const hentAktivitetsVersjon = createAsyncThunk(
    `${aktivitetVersjonSlice.name}/hent`,
    async ({ aktivitetId, versjon }: { aktivitetId: AktivitetsId; versjon: AktivitetsVersjon }) => {
        return hentAktivitetsVersjonGraphql(aktivitetId, versjon);
    },
);

/*
 * Loader (react-router)
 * */
export const aktivitetsVersjonVisningLoader =
    (dispatch: Dispatch): LoaderFunction =>
    ({
        params,
    }): {
        aktivitet: undefined | Promise<PayloadAction<GraphqlResponse<{ aktivitet: TidligereReferatAktivitet }>>>;
    } => {
        if (!params.id || !params.versjon)
            return {
                aktivitet: undefined,
            };
        const aktivitet = dispatch(
            hentAktivitetsVersjon({
                aktivitetId: params.id as AktivitetsId,
                versjon: params.versjon as AktivitetsVersjon,
            }),
        ) as unknown as Promise<PayloadAction<GraphqlResponse<{ aktivitet: TidligereReferatAktivitet }>>>;
        return { aktivitet };
    };
