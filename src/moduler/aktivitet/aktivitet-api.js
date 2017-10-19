import { AKTIVITET_PROXY_BASE_URL } from '../../environment';
import { fetchToJson, postAsJson, putAsJson } from './../../ducks/utils';

export function hentAktivitet(aktivitetId) {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitetId}`);
}

export function hentAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet`);
}

export function lagNyAktivitet(aktivitet) {
    return postAsJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/ny`, aktivitet);
}
export function oppdaterAktivitet(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`,
        aktivitet
    );
}

export function oppdaterAktivitetStatus(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/status`,
        aktivitet
    );
}

export function oppdaterAktivitetEtikett(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/etikett`,
        aktivitet
    );
}

export function slettAktivitet(aktivitet) {
    return fetchToJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}`,
        { method: 'delete' }
    );
}

export function hentKanaler() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/kanaler`);
}

export function publiserReferat(aktivitetId) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitetId}/referat/publiser`
    );
}

export function oppdaterReferat(aktivitet) {
    return putAsJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/referat`,
        aktivitet
    );
}

export function hentArenaAktiviteter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/arena`);
}

export function hentVersjonerTilAktivitet(aktivitet) {
    return fetchToJson(
        `${AKTIVITET_PROXY_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`
    );
}

export function hentEtiketter() {
    return fetchToJson(`${AKTIVITET_PROXY_BASE_URL}/aktivitet/etiketter`);
}
