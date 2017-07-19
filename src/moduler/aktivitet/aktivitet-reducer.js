import * as AT from './aktivitet-action-types';
import { ER_I_PRIVAT_MODUS } from '../../ducks/situasjon';
import { STATUS } from '../../ducks/utils';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
    forrigeAktiveAktivitetId: undefined,
};

function nyStateMedOppdatertAktivitet(state, aktivitet, aktivitetData) {
    const aktivitetIndex = state.data.findIndex(a => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = { ...aktivitet, ...aktivitetData };
    return { ...state, data: nyState };
}

export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case AT.SLETT_OK:
            return { ...state, data: state.data.filter(a => a.id !== data.id) };
        case AT.OPPDATER_OK:
        case AT.FLYTT_OK:
            return nyStateMedOppdatertAktivitet(
                { ...state, status: STATUS.OK },
                data
            );
        case AT.HENTET:
            return { status: STATUS.OK, data: data.aktiviteter };
        case AT.HENT_AKTIVITET_OK:
            return {
                status: STATUS.OK,
                data: state.data
                    .filter(aktivitet => aktivitet.id !== data.id)
                    .concat(data),
            };
        case AT.OPPRETTET:
            return { ...state, data: [...state.data, data] };
        case AT.FLYTTER:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, {
                nesteStatus: data.status,
            });
        case AT.OPPDATER:
            return { ...state, status: STATUS.RELOADING };
        case AT.FLYTT_FAIL:
            return nyStateMedOppdatertAktivitet(state, data.aktivitet, {
                error: data.error,
            });
        case AT.SLETT:
        case AT.SLETT_FAIL:
        case AT.HENTING_FEILET:
        case AT.HENT_AKTIVITET_FEILET:
        case AT.OPPDATER_FEILET:
            return { ...state, status: STATUS.ERROR };
        case AT.SETT_FORRIGE_AKTIVE_AKTIVITET_ID:
            return { ...state, forrigeAktiveAktivitetId: action.id };
        case AT.FJERN_FORRIGE_AKTIVE_AKTIVITET_ID:
            return { ...state, forrigeAktiveAktivitetId: undefined };
        case ER_I_PRIVAT_MODUS:
            return { ...state, status: STATUS.OK };
        default:
            return state;
    }
}
