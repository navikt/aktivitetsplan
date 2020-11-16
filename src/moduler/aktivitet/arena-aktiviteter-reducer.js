import { STATUS, doThenDispatch } from '../../ducks/utils';
import * as Api from './aktivitet-api';

// Actions
export const HENTER = 'arenaAktivitet/hent';
export const HENTET = 'arenaAktivitet/hent/ok';
export const HENTING_FEILET = 'arenaAktivitet/hent/fail';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

const mapArenaType = (arenaAktivitet) => ({
    ...arenaAktivitet,
    arenaAktivitet: true,
});

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENTET:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data.map(mapArenaType),
            };
        case HENTING_FEILET:
            return { ...state, status: STATUS.ERROR, feil: action.data };
        default:
            return state;
    }
}

// Action creator
export function hentArenaAktiviteter() {
    return doThenDispatch(() => Api.hentArenaAktiviteter(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER,
    });
}
