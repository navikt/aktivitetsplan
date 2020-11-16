import { deleteAsJson, fetchToJson, postAsJson, putAsJson } from '../../ducks/utils';
import { AKTIVITET_BASE_URL } from '../../environment';

export function hentAktivitet(aktivitetId) {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitetId}`);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet`);
}

export function lagNyAktivitet(aktivitet) {
    return postAsJson(`${AKTIVITET_BASE_URL}/aktivitet/ny`, aktivitet);
}
export function oppdaterAktivitet(aktivitet) {
    return putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);
}

export function oppdaterAktivitetStatus(aktivitet) {
    return putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);
}

export function oppdaterAktivitetEtikett(aktivitet) {
    return putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet);
}

export function slettAktivitet(aktivitet) {
    return deleteAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`);
}

export function hentKanaler() {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/kanaler`);
}

export function publiserReferat(aktivitet) {
    return putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet);
}

export function oppdaterReferat(aktivitet) {
    return putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet);
}

export function hentArenaAktiviteter() {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/arena`);
}

export function hentVersjonerTilAktivitet(aktivitet) {
    return fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`);
}
