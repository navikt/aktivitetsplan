import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hentAktivitetsVersjonGraphql, TidligereReferatAktivitet } from '../../../../api/aktivitetsplanGraphql';
import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { AktivitetsId, AktivitetsVersjon } from '../../../../datatypes/brandedTypes';
import { Dispatch } from '../../../../store/store';
import { RootState } from '../../../../store/rootReducer';
import { GraphqlResponse } from '../../../../api/graphql/graphqlResult';

export const aktivitetVersjonSlice = createSlice({
    name: 'aktivitetVersjonVisning',
    initialState: {
        aktivitet: undefined as TidligereReferatAktivitet | undefined,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentAktivitetsVersjon.fulfilled, (state, action) => {
            return {
                aktivitet: action.payload.data.aktivitet,
            };
        });
    },
});

export const aktivitetVersjonSliceReducer = aktivitetVersjonSlice.reducer;

export function selectAktivitetVersjon(state: RootState) {
    return state.data.aktivitetVersjon?.aktivitet;
}

const hentAktivitetsVersjon = createAsyncThunk(
    'aktivitetsVersjon/hent',
    async ({ aktivitetId, versjon }: { aktivitetId: AktivitetsId; versjon: AktivitetsVersjon }) => {
        return hentAktivitetsVersjonGraphql(aktivitetId, versjon);
    },
);

export type AktivitetsVersjonPromise = Promise<ReturnType<ReturnType<typeof aktivitetsVersjonVisningLoader>>>;
export const useAktivitetsVersjonVisningLoaderData: () => {
    aktivitet: AktivitetsVersjonPromise;
} = () => {
    return useRouteLoaderData('aktivitetsVersjonVisning') as {
        aktivitet: AktivitetsVersjonPromise;
    };
};

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
