import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const HENTER_PERSON = 'person/hent';
export const HENTET_PERSON = 'person/hent/ok';
export const HENTING_AV_PERSON_FEILET = 'person/hent/fail';

export const OPPDATER_MOTPART = 'motpart/oppdater';

const initalState = {
    data: {},
    status: STATUS.NOT_STARTED
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case OPPDATER_MOTPART:
            return { status: STATUS.OK, data };
        case HENTET_PERSON:
            return {
                status: STATUS.OK,
                data: {
                    navn: data.sammensattNavn && data.sammensattNavn.replace(/\w\S*/g, (ord) => ord.charAt(0).toUpperCase() + ord.substr(1).toLowerCase())
                }
            };
        case HENTING_AV_PERSON_FEILET:
            return { ...state, status: STATUS.ERROR };
        default:
            return state;
    }
}

export function hentPerson(fnr) {
    return doThenDispatch(() => Api.hentPerson(fnr), {
        OK: HENTET_PERSON,
        FEILET: HENTING_AV_PERSON_FEILET,
        PENDING: HENTER_PERSON
    });
}

export function setNAVsomMotpart() {
    return {
        type: OPPDATER_MOTPART,
        data: {
            navn: 'NAV'
        }
    };
}

