import createGenericSlice from '../../../../createGenericSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import postSjekkForPersonopplysninger, { notifiserTryggTekstOmLagretReferat } from '../../../../api/tryggTekstAPI';
import { RootState } from '../../../../store';

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

export const notifiserTryggTekstVedLagring = createAsyncThunk(
    `${tryggTekstSlice.name}/notifiserTryggTekstVedLagring`,
    async (tekst: string, { getState }) => {
        const state = getState() as RootState;
        const tryggTekstReferatId = state.data.tryggTekst.data?.tryggTekstReferatId;

        if (tryggTekstReferatId) {
            notifiserTryggTekstOmLagretReferat(tekst, tryggTekstReferatId).catch((error) => {
                console.error('TryggTekst: Feil ved notifisering om lagret referat', error);
            });
        }
    },
);

type PersonopplysningerSjekkResultat = Awaited<ReturnType<typeof postSjekkForPersonopplysninger>>;

export const { nullstillTryggTekst } = tryggTekstSlice.actions;
export const tryggTekstReducer = tryggTekstSlice.reducer;
