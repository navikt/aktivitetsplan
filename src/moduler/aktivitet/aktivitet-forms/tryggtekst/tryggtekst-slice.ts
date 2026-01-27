import createGenericSlice from '../../../../createGenericSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import postSjekkForPersonopplysninger from '../../../../api/tryggTekstAPI';

const tryggTekstSlice = createGenericSlice<PersonopplysningerSjekkResultat>({
    name: 'trykkTekst',
    reducers: {
        nullstillTryggTekst: () => {
            return { status: 'NOT_STARTED' as const, data: undefined };
        }
    },
});

export const sjekkForPersonopplysninger = createAsyncThunk(
    `${tryggTekstSlice.name}/postSjekkForPersonopplysninger`,
    async ({ tekst, tryggTekstReferatId }: { tekst: string; tryggTekstReferatId?: string }) => {
        return await postSjekkForPersonopplysninger(tekst, tryggTekstReferatId);
    },
);

type PersonopplysningerSjekkResultat = Awaited<ReturnType<typeof postSjekkForPersonopplysninger>>;

export const { nullstillTryggTekst } = tryggTekstSlice.actions;
export const tryggTekstReducer = tryggTekstSlice.reducer;
