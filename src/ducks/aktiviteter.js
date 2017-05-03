import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';
import * as statuskoder from '../constant';

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


const initalState = {
    data: [],
    status: STATUS.NOT_STARTED
};


function nyStateMedOppdatertAktivitet(state, aktivitet, aktivitetData) {
    const aktivitetIndex = state.data.findIndex((a) => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = { ...aktivitet, ...aktivitetData };
    return { ...state, data: nyState };
}

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case HENTET:
            return { status: STATUS.OK, data: data.aktiviteter };
        case HENTING_FEILET:
            return { ...state, status: STATUS.ERROR };
        case OPPRETTET:
            return { ...state, data: [...state.data, data] };
        case FLYTTER:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, { nesteStatus: data.status });
        case OPPDATER:
            return { ...state, status: STATUS.PENDING };
        case OPPDATER_OK:
        case FLYTT_OK:
            return nyStateMedOppdatertAktivitet({ ...state, status: STATUS.OK }, data);
        case OPPDATER_FEILET:
            return { ...state, status: STATUS.ERROR };
        case FLYTT_FAIL:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, { error: data.error });
        case SLETT_OK:
            return { ...state, data: state.data.filter((a) => a.id !== data.id) };
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
        // TODO kan vi bruke oppdaterAktivitet?
        return Api.oppdaterAktivitetStatus({ ...aktivitet, status })
            .then((response) => {
                dispatch({ type: FLYTT_OK, data: response });
                return Promise.resolve(response);
            })
            .catch((error) => {
                dispatch({ type: FLYTT_FAIL, data: { aktivitet, error } });
                return Promise.reject(error);
            });
    };
}

export function oppdaterAktivitet(aktivitet) {
    return doThenDispatch(() => Api.oppdaterAktivitet(aktivitet), {
        OK: OPPDATER_OK,
        FEILET: OPPDATER_FEILET,
        PENDING: OPPDATER
    });
}

export function avbrytAktivitet(aktivitet, avsluttetKommentar) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_AVBRUTT);
}

export function fullforAktivitet(aktivitet, avsluttetKommentar) {
    const nyAktivitet = { ...aktivitet, avsluttetKommentar };
    return flyttAktivitet(nyAktivitet, statuskoder.STATUS_FULLFOERT);
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

