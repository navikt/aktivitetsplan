import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/aktivitetAPI';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';

export const hentAktiviteterThunk = createAsyncThunk('aktivitet/hent', async () => {
    return await Api.hentAktiviteter();
});

export const hentAktivitetThunk = createAsyncThunk('aktivitet/hent_aktivitet', async (aktivitetId: string) => {
    return await Api.hentAktivitet(aktivitetId);
});

export const flyttAktivitetThunk = createAsyncThunk(
    'aktivitet/flytt',
    async ({ aktivitet, status }: { aktivitet: VeilarbAktivitet; status: AktivitetStatus }) => {
        return await Api.oppdaterAktivitetStatus({ ...aktivitet, status });
    }
);

export const oppdaterAktivitetEtikettThunk = createAsyncThunk(
    'aktivitet/oppdater',
    async (aktivitet: VeilarbAktivitet) => {
        return await Api.oppdaterAktivitetEtikett(aktivitet);
    }
);

export const oppdaterAktivitetThunk = createAsyncThunk('aktivitet/oppdater', async (aktivitet: VeilarbAktivitet) => {
    return await Api.oppdaterAktivitet(aktivitet);
});

export const settAktivitetTilAvtaltThunk = createAsyncThunk(
    'aktivitet/fho',
    async ({
        aktivitet,
        forhaandsorientering,
    }: {
        aktivitet: VeilarbAktivitet;
        forhaandsorientering: Forhaandsorientering;
    }) => {
        return await Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering);
    }
);

export const markerForhaandsorienteringSomLestThunk = createAsyncThunk(
    'aktivitet/fho/lest',
    async (aktivitet: VeilarbAktivitet) => {
        return await Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon);
    }
);

export function flyttAktivitetMedBegrunnelse(
    aktivitet: VeilarbAktivitet,
    status: AktivitetStatus,
    avsluttetKommentar: string
) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitetThunk({ aktivitet: nyAktivitet, status });
}

export function avbrytAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitetThunk({ aktivitet: nyAktivitet, status: AktivitetStatus.AVBRUTT });
}

export function fullforAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitetThunk({ aktivitet: nyAktivitet, status: AktivitetStatus.FULLFOERT });
}

export const oppdaterCVSvarThunk = createAsyncThunk(
    'aktivitet/oppdatercvsvar',
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
    }
);

export const oppdaterStillingFraNavSoknadsstatusThunk = createAsyncThunk(
    'aktivitet/oppdater',
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
    }
);

export const lagNyAktivitetThunk = createAsyncThunk('aktivitet/opprett', async (aktivitet: VeilarbAktivitet) => {
    return await Api.lagNyAktivitet(aktivitet);
});

export const oppdaterReferatThunk = createAsyncThunk(
    'referat/oppdater',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet) => {
        return await Api.oppdaterReferat(aktivitet);
    }
);

export const publiserReferatThunk = createAsyncThunk(
    'referat/publiser',
    async (aktivitet: SamtalereferatAktivitet | MoteAktivitet) => {
        return await Api.publiserReferat({ ...aktivitet, erReferatPublisert: true });
    }
);
