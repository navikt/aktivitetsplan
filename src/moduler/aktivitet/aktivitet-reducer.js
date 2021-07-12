import { STATUS } from '../../api/utils';
import { UpdateTypes, widowEvent } from '../../utils/UpdateHandler';
import * as AT from './aktivitet-action-types';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
    fhoLestStatus: STATUS.NOT_STARTED,
    fhoBekreftStatus: STATUS.NOT_STARTED,
    forrigeAktiveAktivitetId: undefined,
    cvSvarStatus: STATUS.NOT_STARTED,
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
            widowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, status: STATUS.OK }, data);
        case AT.HENTET:
            return { ...state, status: STATUS.OK, data: data.aktiviteter };
        case AT.HENT_AKTIVITET_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: state.data.filter((aktivitet) => aktivitet.id !== data.id).concat(data),
            };
        case AT.OPPRETTET:
            widowEvent(UpdateTypes.Aktivitet);
            return { ...state, status: STATUS.OK, data: [...state.data, data] };
        case AT.FLYTTER:
            return nyStateMedOppdatertAktivitet({ ...state, status: STATUS.RELOADING }, data.aktivitet, {
                nesteStatus: data.status,
            });
        case AT.OPPDATER:
        case AT.OPPRETT:
            return { ...state, status: STATUS.RELOADING };
        case AT.FLYTT_FAIL:
            return nyStateMedOppdatertAktivitet({ ...state, status: STATUS.ERROR, feil: data }, data.aktivitet);
        case AT.HENTING_FEILET:
        case AT.HENT_AKTIVITET_FEILET:
        case AT.OPPDATER_FEILET:
        case AT.OPPRETT_FEILET:
            return { ...state, status: STATUS.ERROR, feil: data };
        case AT.SETT_FORRIGE_AKTIVE_AKTIVITET_ID:
            return { ...state, forrigeAktiveAktivitetId: action.id };
        case AT.FHO_LEST:
            return { ...state, fhoLestStatus: STATUS.RELOADING };
        case AT.FHO_LEST_OK:
            widowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoLestStatus: STATUS.OK }, data);
        case AT.FHO_LEST_FEILET:
            return { ...state, fhoLestStatus: STATUS.ERROR, feil: data };
        case AT.FHO_BEKREFT:
            return { ...state, fhoBekreftStatus: STATUS.RELOADING };
        case AT.FHO_BEKREFT_OK:
            widowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoBekreftStatus: STATUS.OK }, data);
        case AT.FHO_BEKREFT_FEILET:
            return { ...state, fhoBekreftStatus: STATUS.ERROR, feil: data };
        case AT.OPPDATER_CV_SVAR_OK:
            return nyStateMedOppdatertAktivitet({ ...state, cvSvarStatus: STATUS.OK }, data);
        case AT.OPPDATER_CV_SVAR_FEILET:
            return { ...state, cvSvarStatus: STATUS.ERROR, feil: data };
        case AT.OPPDATER_CV_SVAR_PENDING:
            return { ...state, cvSvarStatus: STATUS.PENDING };
        default:
            return state;
    }
}
