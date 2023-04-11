import * as Api from '../../api/aktivitetAPI';
import { doThenDispatch } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';

// Actions
export const HENTER = 'arenaAktivitet/hent';
export const HENTET = 'arenaAktivitet/hent/ok';
export const HENTING_FEILET = 'arenaAktivitet/hent/fail';

export const OPPDATER = 'arenaAktivitet/oppdater';
export const OPPDATER_OK = 'arenaAktivitet/oppdater/ok';
export const OPPDATER_FEILET = 'arenaAktivitet/oppdater/fail';

export const FHO_LEST = 'arenaAktivitet/fho/lest';
export const FHO_LEST_OK = 'arenaAktivitet/fho/lest/ok';
export const FHO_LEST_FEILET = 'arenaAktivitet/fho/lest/fail';

const initalState = {
    data: [],
    status: Status.NOT_STARTED,
    fhoLestStatus: Status.NOT_STARTED,
};

const mapArenaType = (arenaAktivitet) => ({
    ...arenaAktivitet,
    arenaAktivitet: true,
});

const nyStateMedOppdatertAktivitet = (state, aktivitet) => {
    const aktivitetIndex = state.data.findIndex((a) => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = mapArenaType(aktivitet);
    return { ...state, data: nyState };
};

// Reducer
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case HENTET:
            return {
                ...state,
                status: Status.OK,
                data: action.data.map(mapArenaType),
            };
        case OPPDATER_FEILET:
        case HENTING_FEILET:
            return { ...state, status: Status.ERROR, feil: action.data };
        case OPPDATER:
            return { ...state, status: Status.RELOADING };
        case OPPDATER_OK:
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.OK }, action.data);
        case FHO_LEST:
            return { ...state, fhoLestStatus: Status.RELOADING };
        case FHO_LEST_OK:
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoLestStatus: Status.OK }, action.data);
        case FHO_LEST_FEILET:
            return { ...state, fhoLestStatus: Status.ERROR, feil: action.data };
        default:
            return state;
    }
};

export default reducer;

// Action creator
export const hentArenaAktiviteter = () =>
    doThenDispatch(() => Api.hentArenaAktiviteter(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER,
    });

export const sendForhaandsorienteringArenaAktivitet = (arenaaktivitet, forhaandsorientering) =>
    doThenDispatch(() => Api.sendForhaandsorienteringArenaAktivitet(arenaaktivitet.id, forhaandsorientering), {
        OK: OPPDATER_OK,
        FEILET: OPPDATER_FEILET,
        PENDING: OPPDATER,
    });

export const markerForhaandsorienteringSomLestArenaAktivitet = (arenaaktivitet) =>
    doThenDispatch(() => Api.markerForhaandsorienteringSomLestArenaAktivitet(arenaaktivitet.id), {
        OK: FHO_LEST_OK,
        FEILET: FHO_LEST_FEILET,
        PENDING: FHO_LEST,
    });
