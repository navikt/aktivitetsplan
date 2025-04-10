import createGenericSlice from '../../../../createGenericSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import postSjekkForPersonopplysninger from '../../../../api/tryggTekstAPI';

const tryggTekstSlice = createGenericSlice<PersonopplysningerSjekkResultat>({
    name: 'trykkTekst',
    reducers: {},
});

export const sjekkForPersonopplysninger = createAsyncThunk(
    `${tryggTekstSlice.name}/postSjekkForPersonopplysninger`,
    async (tekst: string) => {
        return await postSjekkForPersonopplysninger(tekst);
    },
);

type PersonopplysningerSjekkResultat = Awaited<ReturnType<typeof postSjekkForPersonopplysninger>>;

export const tryggTekstReducer = tryggTekstSlice.reducer;
