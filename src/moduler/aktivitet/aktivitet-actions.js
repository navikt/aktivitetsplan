import * as Api from '../../api/aktivitetAPI';
import { doThenDispatch } from '../../api/utils';
import * as statuskoder from '../../constant';
import * as AT from './aktivitet-action-types';

export function hentAktiviteter() {
    return doThenDispatch(() => Api.hentAktiviteter(), {
        OK: AT.HENTET,
        FEILET: AT.HENTING_FEILET,
        PENDING: AT.HENTER,
    });
}

export function hentAktivitet(aktivitetId) {
    return doThenDispatch(() => Api.hentAktivitet(aktivitetId), {
        OK: AT.HENT_AKTIVITET_OK,
        FEILET: AT.HENT_AKTIVITET_FEILET,
        PENDING: AT.HENT_AKTIVITET,
    });
}

export function flyttAktivitet(aktivitet, status) {
    return (dispatch) => {
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

export function oppdaterAktivitetEtikett(aktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitetEtikett(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function oppdaterAktivitet(aktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitet(aktivitet), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function settAktivitetTilAvtalt(aktivitet, forhaandsorientering) {
    return doThenDispatch(() => Api.settAktivitetTilAvtalt(aktivitet.id, aktivitet.versjon, forhaandsorientering), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function markerForhaandsorienteringSomLest(aktivitet) {
    return doThenDispatch(() => Api.markerForhaandsorienteringSomLest(aktivitet.id, aktivitet.versjon), {
        OK: AT.OPPDATER_OK,
        FEILET: AT.OPPDATER_FEILET,
        PENDING: AT.OPPDATER,
    });
}

export function flyttAktivitetMedBegrunnelse(aktivitet, status, avsluttetKommentar) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, status);
}

export function avbrytAktivitet(aktivitet, avsluttetKommentar) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_AVBRUTT);
}

export function fullforAktivitet(aktivitet, avsluttetKommentar) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_FULLFOERT);
}

export function lagNyAktivitet(aktivitet) {
    return doThenDispatch(() => Api.lagNyAktivitet(aktivitet), {
        OK: AT.OPPRETTET,
        FEILET: AT.OPPRETT_FEILET,
        PENDING: AT.OPPRETT,
    });
}

export function oppdaterReferat(aktivitet) {
    return doThenDispatch(() => Api.oppdaterReferat(aktivitet), {
        OK: AT.OPPDATER_REFERAT_OK,
        FEILET: AT.OPPDATER_REFERAT_FEILET,
        PENDING: AT.OPPDATER_REFERAT,
    });
}

export function publiserReferat(aktivitet) {
    return doThenDispatch(() => Api.publiserReferat({ ...aktivitet, erReferatPublisert: true }), {
        OK: AT.PUBLISER_REFERAT_OK,
        FEILET: AT.PUBLISER_REFERAT_FEILET,
        PENDING: AT.PUBLISER_REFERAT,
    });
}
