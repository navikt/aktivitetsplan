import { STATUS } from '../../api/utils';

export function selectAktiviteterSlice(state) {
    return state.data.aktiviteter;
}

export function selectAktiviteterData(state) {
    return selectAktiviteterSlice(state).data;
}

export function selectAktivitetStatus(state) {
    return selectAktiviteterSlice(state).status;
}

export function selectHarTilgangTilAktiviteter(state) {
    return selectAktivitetStatus(state) === STATUS.OK;
}

export function selectLasterAktivitetData(state) {
    return selectAktivitetStatus(state) !== STATUS.OK;
}

export const selectAktivitetFeilmeldinger = (state) => {
    const feilMeldingsdata = selectAktivitetStatus(state) === STATUS.ERROR && selectAktiviteterSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};

export function selectAktivitetFhoLestStatus(state) {
    return selectAktiviteterSlice(state).fhoLestStatus;
}
