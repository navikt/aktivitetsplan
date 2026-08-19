import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { hentAktivitetsVersjonGraphql } from '../../../../api/aktivitetsplanGraphql';
import { LoaderFunction } from 'react-router';
import { AktivitetsId, AktivitetsVersjon } from '../../../../datatypes/brandedTypes';
import { Dispatch } from '../../../../store/store';
import { RootState } from '../../../../store/rootReducer';

export const aktivitetVersjonSlice = createSlice({
    name: 'aktivitetVersjonVisning',
    initialState: {
        aktivitet: undefined as VeilarbAktivitet | undefined,
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
        return hentAktivitetsVersjonGraphql(aktivitetId, versjon).catch((err) => console.log(err));
    },
);

export const aktivitetsVersjonVisningLoader =
    (dispatch: Dispatch): LoaderFunction =>
    ({ params }) => {
        if (!params.id || !params.versjon)
            return {
                aktivitet: undefined,
            };
        return {
            aktivitet: dispatch(
                hentAktivitetsVersjon({
                    aktivitetId: params.id as AktivitetsId,
                    versjon: params.versjon as AktivitetsVersjon,
                }),
            ),
        };
    };
