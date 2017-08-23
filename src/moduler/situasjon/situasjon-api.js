import {
    API_BASE_URL,
    DIALOG_BASE_URL,
    AKTIVITET_PROXY_BASE_URL,
    SITUASJON_PROXY_BASE_URL,
    PERSON_BASE_URL,
} from '~config'; // eslint-disable-line
import { fetchToJson, postAsJson, putAsJson } from '../../ducks/utils';

export function hentIdentitet() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/me`);
}

export function hentSituasjon() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon`);
}

export function godtaVilkar(hash) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/godta/${hash}`);
}

export function avslaaVilkar(hash) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/avslaa/${hash}`);
}

export function hentVilkar() {
    return fetchToJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/vilkar`);
}

export function hentHistoriskeVilkar() {
    return fetchToJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/hentVilkaarStatusListe`
    );
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

export function startOppfolging() {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/startOppfolging`);
}

export function startEskalering(tilhorendeDialogId) {
    return putAsJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/startEskalering/${tilhorendeDialogId}`
    );
}

export function stoppEskalering() {
    return putAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/stoppEskalering/`);
}

export function kanAvslutte() {
    return fetchToJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/avslutningStatus`
    );
}

export function avsluttOppfolging(begrunnelse, veilederId) {
    return postAsJson(
        `${SITUASJON_PROXY_BASE_URL}/situasjon/avsluttOppfolging`,
        { begrunnelse, veilederId }
    );
}

export function settManuellOppfolging(begrunnelse, veilederId) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/settManuell`, {
        begrunnelse,
        veilederId,
    });
}

export function settDigitalOppfolging(begrunnelse, veilederId) {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/settDigital`, {
        begrunnelse,
        veilederId,
    });
}
