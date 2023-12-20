import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/aktivitetAPI';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { hentAktiviteterGraphql } from '../../api/aktivitetsplanGraphql';
import { getFnrIfVeileder } from '../../utils/displayedUserSlice';
import { RootState } from '../../reducer';
import { OppdaterCVKanDelesPayload } from '../../api/aktivitetAPI';

export const hentAktiviteter = createAsyncThunk('aktiviteter/hent', async (_, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await hentAktiviteterGraphql(fnr || '');
});

export const hentAktivitet = createAsyncThunk('aktivitet/hent', async (aktivitetId: string, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.hentAktivitet(aktivitetId, fnr);
});

export const oppdaterAktivitetEtikett = createAsyncThunk(
    'aktivitet-etikett/oppdater',
    async (aktivitet: VeilarbAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterAktivitetEtikett(aktivitet, fnr);
    },
);

export const oppdaterAktivitet = createAsyncThunk(
    'aktivitet/oppdater',
    async (aktivitet: VeilarbAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterAktivitet(aktivitet, fnr);
    },
);

export const settAktivitetTilAvtalt = createAsyncThunk(
    'aktivitet/fho',
    async (
        {
            aktivitet,
            forhaandsorientering,
        }: {
            aktivitet: VeilarbAktivitet;
            forhaandsorientering: Forhaandsorientering;
        },
        thunkAPI,
    ) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering, fnr);
    },
);

export const markerForhaandsorienteringSomLest = createAsyncThunk(
    'aktivitet/fho/lest',
    async (aktivitet: VeilarbAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon, fnr);
    },
);

export const flyttAktivitet = createAsyncThunk(
    'aktivitet/flytt',
    async ({ aktivitet, status }: { aktivitet: VeilarbAktivitet; status: AktivitetStatus }, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterAktivitetStatus({ ...aktivitet, status }, fnr);
    },
);

export function flyttAktivitetMedBegrunnelse(
    aktivitet: VeilarbAktivitet,
    status: AktivitetStatus,
    avsluttetKommentar: string,
) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet({ aktivitet: nyAktivitet, status });
}

export function avbrytAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet({ aktivitet: nyAktivitet, status: AktivitetStatus.AVBRUTT });
}

export function fullforAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet({ aktivitet: nyAktivitet, status: AktivitetStatus.FULLFOERT });
}

export const oppdaterCVSvar = createAsyncThunk(
    'aktivitet/oppdaterCvSvar',
    async ({ aktivitetId, aktivitetVersjon, kanDeles, avtaltDato }: OppdaterCVKanDelesPayload, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterCvKanDelesSvar(fnr, { aktivitetId, aktivitetVersjon, kanDeles, avtaltDato });
    },
);

export const oppdaterStillingFraNavSoknadsstatus = createAsyncThunk(
    'aktivitet-stilling-fra-nav-status/oppdater',
    async (
        {
            aktivitetId,
            aktivitetVersjon,
            soknadsstatus,
        }: {
            aktivitetId: string;
            aktivitetVersjon: string;
            soknadsstatus: string;
        },
        thunkAPI,
    ) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterStillingFraNavSoknadsstatus(aktivitetId, aktivitetVersjon, soknadsstatus, fnr);
    },
);

export const lagNyAktivitet = createAsyncThunk('aktivitet/opprett', async (aktivitet: VeilarbAktivitet, thunkAPI) => {
    const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
    return await Api.lagNyAktivitet(aktivitet, fnr);
});

export const oppdaterReferat = createAsyncThunk(
    'referat/oppdater',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.oppdaterReferat(aktivitet, fnr);
    },
);

export const publiserReferat = createAsyncThunk(
    'referat/publiser',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.publiserReferat({ ...aktivitet, erReferatPublisert: true }, fnr);
    },
);
