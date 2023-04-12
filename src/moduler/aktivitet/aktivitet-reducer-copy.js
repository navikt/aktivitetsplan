import { Status } from '../../createGenericSlice';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';
import * as AT from './aktivitet-action-types';

const initalState = {
    data: [],
    status: Status.NOT_STARTED,
    fhoLestStatus: Status.NOT_STARTED,
    fhoBekreftStatus: Status.NOT_STARTED,
    forrigeAktiveAktivitetId: undefined,
    cvSvarStatus: Status.NOT_STARTED,
};

function nyStateMedOppdatertAktivitet(state, aktivitet, aktivitetData) {
    const aktivitetIndex = state.data.findIndex((a) => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = { ...aktivitet, ...aktivitetData };
    return { ...state, data: nyState };
}

export default function reducer(state = initalState, action) {
    const { data } = action;
    switch (action.type) {
        case AT.OPPDATER_OK:
        case AT.FLYTT_OK:
        case AT.OPPDATER_REFERAT_OK:
        case AT.PUBLISER_REFERAT_OK:
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.OK }, data);
        case AT.HENTET:
            return { ...state, status: Status.OK, data: data.aktiviteter };
        case AT.HENT_AKTIVITET_OK:
            return {
                ...state,
                status: Status.OK,
                data: state.data.filter((aktivitet) => aktivitet.id !== data.id).concat(data),
            };
        case AT.OPPRETTET:
            windowEvent(UpdateTypes.Aktivitet);
            return { ...state, status: Status.OK, data: [...state.data, data] };
        case AT.FLYTTER:
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.RELOADING }, data.aktivitet, {
                nesteStatus: data.status,
            });
        case AT.OPPDATER:
        case AT.OPPRETT:
        case AT.OPPDATER_REFERAT:
        case AT.PUBLISER_REFERAT:
            return { ...state, status: Status.RELOADING };
        case AT.FLYTT_FAIL:
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.ERROR, feil: data }, data.aktivitet);
        case AT.HENTING_FEILET:
        case AT.HENT_AKTIVITET_FEILET:
        case AT.OPPDATER_FEILET:
        case AT.OPPRETT_FEILET:
            return { ...state, status: Status.ERROR, feil: data };
        case AT.SETT_FORRIGE_AKTIVE_AKTIVITET_ID:
            return { ...state, forrigeAktiveAktivitetId: action.id };
        case AT.FHO_LEST:
            return { ...state, fhoLestStatus: Status.RELOADING };
        case AT.FHO_LEST_OK:
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoLestStatus: Status.OK }, data);
        case AT.FHO_LEST_FEILET:
            return { ...state, fhoLestStatus: Status.ERROR, feil: data };
        case AT.FHO_BEKREFT:
            return { ...state, fhoBekreftStatus: Status.RELOADING };
        case AT.FHO_BEKREFT_OK:
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoBekreftStatus: Status.OK }, data);
        case AT.FHO_BEKREFT_FEILET:
            return { ...state, fhoBekreftStatus: Status.ERROR, feil: data };
        case AT.OPPDATER_CV_SVAR_OK:
            return nyStateMedOppdatertAktivitet({ ...state, cvSvarStatus: Status.OK }, data);
        case AT.OPPDATER_CV_SVAR_FEILET:
            return { ...state, cvSvarStatus: Status.ERROR, feil: data };
        case AT.OPPDATER_CV_SVAR_PENDING:
            return { ...state, cvSvarStatus: Status.PENDING };
        default:
            return state;
    }
}
