import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/aktivitetAPI';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { hentAktiviteterGraphql, hentAktivitetMedHistorikkGraphql } from '../../api/aktivitetsplanGraphql';

export const hentAktiviteter = createAsyncThunk('aktiviteter/hent', async () => {
    return await hentAktiviteterGraphql();
});

export const hentAktivitet = createAsyncThunk('aktivitet/hent', async (aktivitetId: string) => {
    return await hentAktivitetMedHistorikkGraphql(aktivitetId);
});

export const hentAktivitetMedHistorikk = createAsyncThunk('aktivitetMedHistorikk/hent', async (aktivitetId: string) => {
    return await hentAktivitetMedHistorikkGraphql(aktivitetId);
});

export const oppdaterAktivitetEtikett = createAsyncThunk(
    'aktivitet-etikett/oppdater',
    async (aktivitet: VeilarbAktivitet) => {
        return await Api.oppdaterAktivitetEtikett(aktivitet);
    },
);

export const oppdaterAktivitet = createAsyncThunk('aktivitet/oppdater', async (aktivitet: VeilarbAktivitet) => {
    return await Api.oppdaterAktivitet(aktivitet);
});

export const settAktivitetTilAvtalt = createAsyncThunk(
    'aktivitet/fho',
    async ({
        aktivitet,
        forhaandsorientering,
    }: {
        aktivitet: VeilarbAktivitet;
        forhaandsorientering: Forhaandsorientering;
    }) => {
        return await Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering);
    },
);

export const markerForhaandsorienteringSomLest = createAsyncThunk(
    'aktivitet/fho/lest',
    async (aktivitet: VeilarbAktivitet) => {
        return await Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon);
    },
);

export const flyttAktivitet = createAsyncThunk(
    'aktivitet/flytt',
    async ({ aktivitet, status }: { aktivitet: VeilarbAktivitet; status: AktivitetStatus }) => {
        return await Api.oppdaterAktivitetStatus({ ...aktivitet, status });
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
    async ({
        aktivitetId,
        aktivitetVersjon,
        kanDeles,
        avtaltDato,
    }: {
        aktivitetId: string;
        aktivitetVersjon: string;
        kanDeles: boolean;
        avtaltDato: string;
    }) => {
        return await Api.oppdaterCvKanDelesSvar(aktivitetId, aktivitetVersjon, kanDeles, avtaltDato);
    },
);

export const oppdaterStillingFraNavSoknadsstatus = createAsyncThunk(
    'aktivitet-stilling-fra-nav-status/oppdater',
    async ({
        aktivitetId,
        aktivitetVersjon,
        soknadsstatus,
    }: {
        aktivitetId: string;
        aktivitetVersjon: string;
        soknadsstatus: string;
    }) => {
        return await Api.oppdaterStillingFraNavSoknadsstatus(aktivitetId, aktivitetVersjon, soknadsstatus);
    },
);

export const lagNyAktivitet = createAsyncThunk(
    'aktivitet/opprett',
    async (payload: { aktivitet: VeilarbAktivitet; oppfolgingsPeriodeId: string }) => {
        return await Api.lagNyAktivitet(payload.aktivitet, payload.oppfolgingsPeriodeId);
    },
);

export const oppdaterReferat = createAsyncThunk(
    'referat/oppdater',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet) => {
        return await Api.oppdaterReferat(aktivitet);
    },
);

export const publiserReferat = createAsyncThunk(
    'referat/publiser',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet) => {
        return await Api.publiserReferat({ ...aktivitet, erReferatPublisert: true });
    },
);
