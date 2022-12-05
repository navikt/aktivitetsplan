import * as Api from '../../api/aktivitetAPI';
import { doThenDispatch } from '../../api/utils';
import * as statuskoder from '../../constant';
import { AktivitetStatus, StillingFraNavSoknadsstatus } from '../../datatypes/aktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { SamtalereferatAktivitet, VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { ReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import * as AT from './aktivitet-action-types';

export function hentAktiviteter() {
    return doThenDispatch(() => Api.hentAktiviteter(), {
        OK: AT.HENTET,
        FEILET: AT.HENTING_FEILET,
        PENDING: AT.HENTER,
    });
}

export function hentAktivitet(aktivitetId: string) {
    return doThenDispatch(() => Api.hentAktivitet(aktivitetId), {
        OK: AT.HENT_AKTIVITET_OK,
        FEILET: AT.HENT_AKTIVITET_FEILET,
        PENDING: AT.HENT_AKTIVITET,
    });
}

export function flyttAktivitet(aktivitet: VeilarbAktivitet, status: AktivitetStatus) {
    return (dispatch: ReduxDispatch) => {
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

export function oppdaterAktivitetEtikett(aktivitet: VeilarbAktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitetEtikett(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function oppdaterAktivitet(aktivitet: VeilarbAktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitet(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function settAktivitetTilAvtalt(aktivitet: VeilarbAktivitet, forhaandsorientering: Forhaandsorientering) {
    return doThenDispatch(() => Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering), {
        OK: AT.FHO_BEKREFT_OK,
        FEILET: AT.FHO_BEKREFT_FEILET,
        PENDING: AT.FHO_BEKREFT,
    });
}

export function markerForhaandsorienteringSomLest(aktivitet: VeilarbAktivitet) {
    return doThenDispatch(() => Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon), {
        OK: AT.FHO_LEST_OK,
        FEILET: AT.FHO_LEST_FEILET,
        PENDING: AT.FHO_LEST,
    });
}

export function flyttAktivitetMedBegrunnelse(
    aktivitet: VeilarbAktivitet,
    status: AktivitetStatus,
    avsluttetKommentar: string
) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, status);
}

export function avbrytAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string | null) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_AVBRUTT);
}

export function fullforAktivitet(aktivitet: VeilarbAktivitet, avsluttetKommentar: string) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_FULLFOERT);
}

export function oppdaterCVSvar(aktivitetId: string, aktivitetVersjon: string, kanDeles: boolean, avtaltDato: string) {
    return doThenDispatch(() => Api.oppdaterCvKanDelesSvar(aktivitetId, aktivitetVersjon, kanDeles, avtaltDato), {
        OK: AT.OPPDATER_CV_SVAR_OK,
        PENDING: AT.OPPDATER_CV_SVAR_PENDING,
        FEILET: AT.OPPDATER_CV_SVAR_FEILET,
    });
}

export function oppdaterStillingFraNavSoknadsstatus(
    aktivitetId: string,
    aktivitetVersjon: string,
    soknadsstatus: StillingFraNavSoknadsstatus
) {
    return doThenDispatch(() => Api.oppdaterStillingFraNavSoknadsstatus(aktivitetId, aktivitetVersjon, soknadsstatus), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function lagNyAktivitet(aktivitet: Partial<VeilarbAktivitet>) {
    return doThenDispatch(() => Api.lagNyAktivitet(aktivitet), {
        OK: AT.OPPRETTET,
        FEILET: AT.OPPRETT_FEILET,
        PENDING: AT.OPPRETT,
    });
}

export function oppdaterReferat(aktivitet: SamtalereferatAktivitet) {
    return doThenDispatch(() => Api.oppdaterReferat(aktivitet), {
        OK: AT.OPPDATER_REFERAT_OK,
        FEILET: AT.OPPDATER_REFERAT_FEILET,
        PENDING: AT.OPPDATER_REFERAT,
    });
}

export function publiserReferat(aktivitet: SamtalereferatAktivitet) {
    return doThenDispatch(() => Api.publiserReferat({ ...aktivitet, erReferatPublisert: true }), {
        OK: AT.PUBLISER_REFERAT_OK,
        FEILET: AT.PUBLISER_REFERAT_FEILET,
        PENDING: AT.PUBLISER_REFERAT,
    });
}
