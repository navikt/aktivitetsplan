import * as Api from './aktivitet-api';
import { doThenDispatch } from '../../ducks/utils';
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
    return doThenDispatch(
        () => Api.oppdaterAktivitetStatus({ ...aktivitet, status }),
        {
            OK: AT.FLYTT_OK,
            FEILET: AT.FLYTT_FAIL,
            PENDING: AT.FLYTTER,
        }
    );
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

export function flyttAktivitetMedBegrunnelse(
    aktivitet,
    status,
    avsluttetKommentar
) {
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

export function slettAktivitet(aktivitet) {
    return dispatch => {
        dispatch({ type: AT.SLETT, data: aktivitet });

        Api.slettAktivitet(aktivitet)
            .then(() => dispatch({ type: AT.SLETT_OK, data: aktivitet }))
            .catch(() => dispatch({ type: AT.SLETT_FAIL, data: aktivitet }));
    };
}

export function settForrigeAktiveAktivitetId(id) {
    return {
        type: AT.SETT_FORRIGE_AKTIVE_AKTIVITET_ID,
        id,
    };
}

export function fjernForrigeAktiveAktivitetId() {
    return {
        type: AT.FJERN_FORRIGE_AKTIVE_AKTIVITET_ID,
    };
}
