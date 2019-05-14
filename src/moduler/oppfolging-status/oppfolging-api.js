import {OPPFOLGING_BASE_URL, VEILARBVEDTAKINFO_BASE_URL} from '../../environment';
import {
    fetchToJson,
    postAsJson,
    deleteAsJson,
    getCookie,
} from '../../ducks/utils';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

export function hentIdentitet() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/me`);
}

export function settDigital() {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settDigital`);
}

export function hentOppfolging() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging`);
}

export function hentMal() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`);
}

export function hentFremtidigSituasjon() {
    return fetchToJson(`${VEILARBVEDTAKINFO_BASE_URL}/fremtidigsituasjon`);
}

export function hentMalListe() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/malListe`);
}

export function lagreMal(mal) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`, mal);
}

export function slettMal() {
    return deleteAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`);
}

export function startOppfolging() {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/startOppfolging`);
}

export function startEskalering(dialogId, begrunnelse) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/startEskalering/`, {
        dialogId,
        begrunnelse,
    });
}

export function stoppEskalering(begrunnelse) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/stoppEskalering/`, {
        begrunnelse,
    });
}

export function kanAvslutte() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/avslutningStatus`);
}

export function avsluttOppfolging(begrunnelse, veilederId) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/avsluttOppfolging`, {
        begrunnelse,
        veilederId,
    });
}

export function settManuellOppfolging(begrunnelse, veilederId) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settManuell`, {
        begrunnelse,
        veilederId,
    });
}

export function settDigitalOppfolging(begrunnelse, veilederId) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settDigital`, {
        begrunnelse,
        veilederId,
    });
}

export function startKvpOppfolging(begrunnelse) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/startKvp`, {
        begrunnelse,
    });
}

export function stoppKvpOppfolging(begrunnelse) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/stoppKvp`, {
        begrunnelse,
    });
}

export function hentVeilederTilgang() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/veilederTilgang`);
}

export function doLesAktivitetsplan() {
    // Denne er fire-n-forget, så bruker ikke ikke `postAsJson` da denne forventer en response.
    const fnr = getFodselsnummer();
    return fetch(`${OPPFOLGING_BASE_URL}/${fnr}/lestaktivitetsplan`, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
            NAV_CSRF_PROTECTION: getCookie('NAV_CSRF_PROTECTION'), // eslint-disable-line quote-props
        }),
    });
}
