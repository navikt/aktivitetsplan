import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../api/aktivitetAPI';
import { doThenDispatch } from '../../api/utils';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import * as AT from './aktivitet-action-types';

export function hentAktiviteter() {
    return doThenDispatch(() => Api.hentAktiviteter(), {
        OK: AT.HENTET,
        FEILET: AT.HENTING_FEILET,
        PENDING: AT.HENTER,
    });
}

export function hentAktivitet(aktivitetId: any) {
    return doThenDispatch(() => Api.hentAktivitet(aktivitetId), {
        OK: AT.HENT_AKTIVITET_OK,
        FEILET: AT.HENT_AKTIVITET_FEILET,
        PENDING: AT.HENT_AKTIVITET,
    });
}

export function flyttAktivitet(aktivitet: any, status: any) {
    return (dispatch: any) => {
        dispatch({ type: AT.FLYTTER, data: { aktivitet, status } });
        return Api.oppdaterAktivitetStatus({ ...aktivitet, status })
            .then((response) => {
                dispatch({ type: AT.FLYTT_OK, data: response });
                return Promise.resolve(response);
            })
            .catch((error) => {
                dispatch({ type: AT.FLYTT_FAIL, data: { aktivitet, error } });
                return Promise.reject(error);
            });
    };
}

export const flyttAktivitetThunk = createAsyncThunk(
    'aktivitet/flytt',
    async ({ aktivitet, status }: { aktivitet: VeilarbAktivitet; status: AktivitetStatus }) => {
        return await Api.oppdaterAktivitetStatus({ ...aktivitet, status });
    }
);

export function oppdaterAktivitetEtikett(aktivitet: any) {
    return doThenDispatch(() => Api.oppdaterAktivitetEtikett(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export const oppdaterAktivitetEtikettThunk = createAsyncThunk(
    'aktivitet/oppdater',
    async ({ aktivitet }: { aktivitet: VeilarbAktivitet }) => {
        return await Api.oppdaterAktivitetEtikett(aktivitet);
    }
);

export function oppdaterAktivitet(aktivitet: any) {
    return doThenDispatch(() => Api.oppdaterAktivitet(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export const oppdaterAktivitetThunk = createAsyncThunk(
    'aktivitet/oppdater',
    async ({ aktivitet }: { aktivitet: VeilarbAktivitet }) => {
        return await Api.oppdaterAktivitet(aktivitet);
    }
);

export function settAktivitetTilAvtalt(aktivitet: any, forhaandsorientering: any) {
    return doThenDispatch(() => Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering), {
        OK: AT.FHO_BEKREFT_OK,
        FEILET: AT.FHO_BEKREFT_FEILET,
        PENDING: AT.FHO_BEKREFT,
    });
}

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

export function markerForhaandsorienteringSomLest(aktivitet) {
    return doThenDispatch(() => Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon), {
        OK: AT.FHO_LEST_OK,
        FEILET: AT.FHO_LEST_FEILET,
        PENDING: AT.FHO_LEST,
    });
}

export const markerForhaandsorienteringSomLestThunk = createAsyncThunk(
    'aktivitet/fho/lest',
    async ({ aktivitet }: { aktivitet: VeilarbAktivitet }) => {
        return await Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon);
    }
);

export function flyttAktivitetMedBegrunnelse(aktivitet: any, status: any, avsluttetKommentar: any) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, status);
}

export function avbrytAktivitet(aktivitet: any, avsluttetKommentar: any) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, AktivitetStatus.AVBRUTT);
}

export function fullforAktivitet(aktivitet: any, avsluttetKommentar: any) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, AktivitetStatus.FULLFOERT);
}

export function oppdaterCVSvar(aktivitetId: any, aktivitetVersjon: any, kanDeles: any, avtaltDato: any) {
    return doThenDispatch(() => Api.oppdaterCvKanDelesSvar(aktivitetId, aktivitetVersjon, kanDeles, avtaltDato), {
        OK: AT.OPPDATER_CV_SVAR_OK,
        PENDING: AT.OPPDATER_CV_SVAR_PENDING,
        FEILET: AT.OPPDATER_CV_SVAR_FEILET,
    });
}

export function oppdaterStillingFraNavSoknadsstatus(aktivitetId: any, aktivitetVersjon: any, soknadsstatus: any) {
    return doThenDispatch(() => Api.oppdaterStillingFraNavSoknadsstatus(aktivitetId, aktivitetVersjon, soknadsstatus), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

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

export function lagNyAktivitet(aktivitet: any) {
    return doThenDispatch(() => Api.lagNyAktivitet(aktivitet), {
        OK: AT.OPPRETTET,
        FEILET: AT.OPPRETT_FEILET,
        PENDING: AT.OPPRETT,
    });
}

export function oppdaterReferat(aktivitet: any) {
    return doThenDispatch(() => Api.oppdaterReferat(aktivitet), {
        OK: AT.OPPDATER_REFERAT_OK,
        FEILET: AT.OPPDATER_REFERAT_FEILET,
        PENDING: AT.OPPDATER_REFERAT,
    });
}

export const oppdaterReferatThunk = createAsyncThunk(
    'referat/oppdater',
    async ({ aktivitet }: { aktivitet: SamtalereferatAktivitet | MoteAktivitet }) => {
        return await Api.oppdaterReferat(aktivitet);
    }
);

export function publiserReferat(aktivitet: any) {
    return doThenDispatch(() => Api.publiserReferat({ ...aktivitet, erReferatPublisert: true }), {
        OK: AT.PUBLISER_REFERAT_OK,
        FEILET: AT.PUBLISER_REFERAT_FEILET,
        PENDING: AT.PUBLISER_REFERAT,
    });
}

export const publiserReferatThunk = createAsyncThunk(
    'referat/publiser',
    async ({ aktivitet }: { aktivitet: SamtalereferatAktivitet | MoteAktivitet }) => {
        return await Api.publiserReferat({ ...aktivitet, erReferatPublisert: true });
    }
);

// export const OppdaterAktivitetThunksFulfilled = isAnyOf(
//     oppdaterAktivitetEtikettThunk.fulfilled,
//     oppdaterAktivitetThunk.fulfilled,
//     oppdaterStillingFraNavSoknadsstatusThunk.fulfilled
// );
