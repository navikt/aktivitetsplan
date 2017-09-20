import {
    API_BASE_URL,
    DIALOG_BASE_URL,
    AKTIVITET_PROXY_BASE_URL,
    SITUASJON_PROXY_BASE_URL,
    PERSON_BASE_URL,
    VEILEDER_BASE_URL,
    PORTEFOLJE_BASE_URL,
    OPPGAVE_BASE_URL,
} from '~config'; // eslint-disable-line

import { fetchToJson, postAsJson, putAsJson } from './../ducks/utils';

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`);
}

export function hentVeileder(veilederId) {
    return fetchToJson(`${VEILEDER_BASE_URL}/veileder/${veilederId}`);
}

export function hentPerson(fnr) {
    return fetchToJson(`${PERSON_BASE_URL}/person/${fnr}`);
}

export function hentDialog() {
    return fetchToJson(`${DIALOG_BASE_URL}/dialog`);
}

export function nyHenvendelse(henvendelse) {
    return postAsJson(`${DIALOG_BASE_URL}/dialog`, henvendelse);
}

export function markerDialogSomLest(dialogId) {
    return putAsJson(`${DIALOG_BASE_URL}/dialog/${dialogId}/les`);
}

export function oppdaterFerdigbehandlet(dialogId, erFerdigbehandlet) {
    return putAsJson(
        `${DIALOG_BASE_URL}/dialog/${dialogId}/ferdigbehandlet/${erFerdigbehandlet}`
    );
}

export function oppdaterVenterPaSvar(dialogId, venterPaSvar) {
    return putAsJson(
        `${DIALOG_BASE_URL}/dialog/${dialogId}/venter_pa_svar/${venterPaSvar}`
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

export function hentBehandlendeEnheter(tema, fnr) {
    return fetchToJson(`${OPPGAVE_BASE_URL}/enheter/?fnr=${fnr}&tema=${tema}`);
}

export function hentVeieldereForEnhet(enhetid) {
    return fetchToJson(`${VEILEDER_BASE_URL}/enhet/${enhetid}/veiledere`);
}

export function opprettOppgaveForBruker(body) {
    return postAsJson(`${OPPGAVE_BASE_URL}/oppgave`, body);
}
