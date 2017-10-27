import * as Api from './arbeidsliste-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action } = createActionsAndReducer('arbeidsliste');

export default reducer;

export function hentArbeidsliste(fnr) {
    return action(() => Api.hentArbeidsliste(fnr));
}

export function leggTilArbeidsliste(fnr, arbeidsliste) {
    return action(() => Api.lagreArbeidsliste(fnr, arbeidsliste));
}

export function slettArbeidsliste(fnr) {
    return action(() => Api.slettArbeidsliste(fnr));
}

export function redigerArbeidsliste(fnr, arbeidsliste) {
    return action(() => Api.redigerArbeidsliste(fnr, arbeidsliste));
}
