import { OPPFOLGING_BASE_URL } from '../../environment';
import { fetchToJson, postAsJson, deleteAsJson } from '../../ducks/utils';

export function hentIdentitet() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/me`);
}

export function settDigital() {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settDigital`);
}

export function hentOppfolging() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging`);
}

export function godtaVilkar(hash) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/godta/${hash}`);
}

export function avslaaVilkar(hash) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/avslaa/${hash}`);
}

export function hentVilkar() {
    return fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/vilkar`);
}

export function hentHistoriskeVilkar() {
    return fetchToJson(
        `${OPPFOLGING_BASE_URL}/oppfolging/hentVilkaarStatusListe`
    );
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
