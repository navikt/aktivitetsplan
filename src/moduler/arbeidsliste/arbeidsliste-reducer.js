import * as Api from '../../ducks/api';
import { STATUS, doThenDispatch } from '../../ducks/utils';

// Actions
const HENT_ARBEIDSLISTE_OK = 'arbeidsliste/hent_arbeidsliste/OK';
const HENT_ARBEIDSLISTE_FEILET = 'arbeidsliste/hent_arbeidsliste/FEILET';
const HENT_ARBEIDSLISTE_PENDING = 'arbeidsliste/hent_arbeidsliste/PENDING';

const LAGRE_ARBEIDSLISTE_OK = 'veilarbportefolje/lagre_arbeidsliste/OK';
const LAGRE_ARBEIDSLISTE_FEILET = 'veilarbportefolje/lagre_arbeidsliste/FEILET';
const LAGRE_ARBEIDSLISTE_PENDING =
    'veilarbportefolje/lagre_arbeidsliste/PENDING';

const SLETT_ARBEIDSLISTE_OK = 'veilarbportefolje/slett_arbeidsliste/OK';
const SLETT_ARBEIDSLISTE_FEILET = 'veilarbportefolje/slett_arbeidsliste/FEILET';
const SLETT_ARBEIDSLISTE_PENDING =
    'veilarbportefolje/slett_arbeidsliste/PENDING';

const REDIGER_ARBEIDSLISTE_OK = 'veilarbportefolje/rediger_arbeidsliste/OK';
const REDIGER_ARBEIDSLISTE_FEILET =
    'veilarbportefolje/rediger_arbeidsliste/FEILET';
const REDIGER_ARBEIDSLISTE_PENDING =
    'veilarbportefolje/rediger_arbeidsliste/PENDING';

const initialState = {
    data: {},
};

//  Reducer
export default function reducer(state = initialState, action) {
    const data = action.data;
    switch (action.type) {
        case HENT_ARBEIDSLISTE_OK:
        case LAGRE_ARBEIDSLISTE_OK:
        case REDIGER_ARBEIDSLISTE_OK:
            return { ...state, status: STATUS.OK, data };
        case SLETT_ARBEIDSLISTE_OK:
            return { ...state, status: STATUS.OK, data };
        case HENT_ARBEIDSLISTE_FEILET:
        case LAGRE_ARBEIDSLISTE_FEILET:
        case SLETT_ARBEIDSLISTE_FEILET:
        case REDIGER_ARBEIDSLISTE_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case HENT_ARBEIDSLISTE_PENDING:
        case LAGRE_ARBEIDSLISTE_PENDING:
        case SLETT_ARBEIDSLISTE_PENDING:
        case REDIGER_ARBEIDSLISTE_PENDING:
            return { ...state, status: STATUS.PENDING };
        default:
            return state;
    }
}

// Action Creators
export function hentArbeidsliste(fnr) {
    return doThenDispatch(() => Api.hentArbeidsliste(fnr), {
        OK: HENT_ARBEIDSLISTE_OK,
        FEILET: HENT_ARBEIDSLISTE_FEILET,
        PENDING: HENT_ARBEIDSLISTE_PENDING,
    });
}

export function leggTilArbeidsliste(fnr, arbeidsliste) {
    return doThenDispatch(() => Api.lagreArbeidsliste(fnr, arbeidsliste), {
        OK: LAGRE_ARBEIDSLISTE_OK,
        FEILET: LAGRE_ARBEIDSLISTE_FEILET,
        PENDING: LAGRE_ARBEIDSLISTE_PENDING,
    });
}

export function slettArbeidsliste(fnr) {
    return doThenDispatch(() => Api.slettArbeidsliste(fnr), {
        OK: SLETT_ARBEIDSLISTE_OK,
        FEILET: SLETT_ARBEIDSLISTE_FEILET,
        PENDING: SLETT_ARBEIDSLISTE_PENDING,
    });
}

export function redigerArbeidsliste(fnr, arbeidsliste) {
    return doThenDispatch(() => Api.redigerArbeidsliste(fnr, arbeidsliste), {
        OK: REDIGER_ARBEIDSLISTE_OK,
        FEILET: REDIGER_ARBEIDSLISTE_FEILET,
        PENDING: REDIGER_ARBEIDSLISTE_PENDING,
    });
}
