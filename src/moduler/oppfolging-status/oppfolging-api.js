import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { fetchToJson, getCookie, postAsJson } from '../../ducks/utils';
import { OPPFOLGING_BASE_URL } from '../../environment';

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

export function hentMalListe() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/malListe`);
}

export function lagreMal(mal) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`, mal);
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
