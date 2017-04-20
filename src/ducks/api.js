import { API_BASE_URL, DIALOG_BASE_URL, AKTIVITET_PROXY_BASE_URL, SITUASJON_PROXY_BASE_URL } from '~config'; // eslint-disable-line
import { fetchToJson, postAsJson, putAsJson } from './../ducks/utils';

export function hentLedetekster() { // eslint-disable-line  import/prefer-default-export
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentOppfolgingStatus() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon`);
}

export function godtaVilkar(hash) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/godta/${hash}`);
}

export function hentVilkar() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/vilkar`);
}

export function hentDialog() {
    return fetchToJson(`${DIALOG_BASE_URL}/dialog`);
}

export function nyDialog(dialog) {
    return postAsJson(`${DIALOG_BASE_URL}/dialog`, dialog);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet`);
}

export function hentEndringsloggTilAktivitet(aktivitet) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/endringslogg`);
}

export function lagNyAktivitet(aktivitet) {
    return postAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/ny`, aktivitet);
}
export function oppdaterAktivitet(aktivitet) {
    return putAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);
}

export function oppdaterAktivitetStatus(aktivitet, status) {
    return putAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);
}

export function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/etiketter`);
}

export function slettAktivitet(aktivitet) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`, { method: 'delete' });
}

export function hentMal() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/mal`);
}

export function hentMalListe() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/malListe`);
}

export function lagreMal(mal) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/mal`, mal);
}
