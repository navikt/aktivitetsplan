import * as Api from './api';
import { doThenDispatch } from './utils';

// Actions
export const HENTER = 'aktivitet/hent';
export const HENTET = 'aktivitet/hent/ok';
export const HENTING_FEILET = 'aktivitet/hent/fail';

export const FLYTTER = 'aktivitet/flytt';
export const FLYTT_OK = 'aktivitet/flytt/ok';
export const FLYTT_FAIL = 'aktivitet/flytt/fail';

export const OPPRETT = 'aktivitet/opprett';
export const OPPRETTET = 'aktivitet/opprett/ok';
export const OPPRETT_FEILET = 'aktivitet/opprett/fail';

export const OPPDATER = 'aktivitet/oppdater';
export const OPPDATER_OK = 'aktivitet/oppdater/ok';
export const OPPDATER_FEILET = 'aktivitet/oppdater/fail';

export const SLETT = 'aktivitet/slett';
export const SLETT_OK = 'aktivitet/slett/ok';
export const SLETT_FAIL = 'aktivitet/slett/fail';

const initalState = [];

function nyStateMedOppdatertAktivitet(state, aktivitet, aktivitetData) {
    const aktivitetIndex = state.findIndex((a) => a.id === aktivitet.id);
    const nyState = [...state];
    nyState[aktivitetIndex] = { ...aktivitet, ...aktivitetData };
    return nyState;
}

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTET:
            return data.aktiviteter;
        case OPPRETTET:
            return [...state, data];
        case FLYTTER:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, { nesteStatus: data.status });
        case FLYTT_OK:
        case OPPDATER_OK:
            return nyStateMedOppdatertAktivitet(state, data);
        case FLYTT_FAIL:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, { error: data.error });
        case SLETT_OK:
            return state.filter((a) => a.id !== data.id);
        case SLETT:
        case SLETT_FAIL:
        default:
            return state;
    }
}

// Action creator
export function hentAktiviteter() {
    return doThenDispatch(() => Api.hentAktiviteter(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER
    });
}

export function flyttAktivitet(aktivitet, status) {
    return (dispatch) => {
        dispatch({ type: FLYTTER, data: { aktivitet, status } });

        Api.oppdaterAktivitetStatus(aktivitet, status)
            .then((response) => dispatch({ type: FLYTT_OK, data: response }))
            .catch((error) => dispatch({ type: FLYTT_FAIL, data: { aktivitet, error } }));
    };
}

export function oppdaterAktivitet(aktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitet(aktivitet), {
        OK: OPPDATER_OK,
        FEILET: OPPDATER_FEILET,
        PENDING: OPPDATER
    });
}


export function lagNyAktivitet(aktivitet) {
    return doThenDispatch(() => Api.lagNyAktivitet(aktivitet), {
        OK: OPPRETTET,
        FEILET: OPPRETT_FEILET,
        PENDING: OPPRETT
    });
}


export function slettAktivitet(aktivitet) {
    return (dispatch) => {
        dispatch({ type: SLETT, data: aktivitet });

        Api.slettAktivitet(aktivitet)
            .then(() => dispatch({ type: SLETT_OK, data: aktivitet }))
            .catch(() => dispatch({ type: SLETT_FAIL, data: aktivitet }));
    };
}

