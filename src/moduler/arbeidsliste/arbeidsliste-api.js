import { PORTEFOLJE_BASE_URL } from '~config'; //eslint-disable-line
import {
    deleteAsJson,
    fetchToJson,
    postAsJson,
    putAsJson,
} from '../../ducks/utils';

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
    return deleteAsJson(`${PORTEFOLJE_BASE_URL}/arbeidsliste/${fnr}`);
}
