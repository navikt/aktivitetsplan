import {
    API_BASE_URL,
    PERSON_BASE_URL,
    VEILEDER_BASE_URL,
    PORTEFOLJE_BASE_URL,
} from '~config'; // eslint-disable-line

import { fetchToJson, postAsJson, putAsJson } from './../ducks/utils';

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export function hentArbeidsliste(fnr) {
    return fetchToJson(`${PORTEFOLJE_BASE_URL}/arbeidsliste/${fnr}`);
}

export function lagreArbeidsliste(fnr, arbeidsliste) {
    return postAsJson(
        `${PORTEFOLJE_BASE_URL}/arbeidsliste/${fnr}`,
        arbeidsliste
    );
}

export function redigerArbeidsliste(fnr, arbeidsliste) {
    return putAsJson(
        `${PORTEFOLJE_BASE_URL}/arbeidsliste/${fnr}`,
        arbeidsliste
    );
}

export function slettArbeidsliste(fnr) {
    return fetchToJson(`${PORTEFOLJE_BASE_URL}/arbeidsliste/${fnr}`, {
        method: 'delete',
    });
}

export function hentVeieldereForEnhet(enhetid) {
    return fetchToJson(`${VEILEDER_BASE_URL}/enhet/${enhetid}/veiledere`);
}

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}
