import { Status } from '../../createGenericSlice';

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
    return selectAktivitetStatus(state) === Status.OK;
}

export function selectLasterAktivitetData(state) {
    return selectAktivitetStatus(state) !== Status.OK;
}

export const selectAktivitetFeilmeldinger = (state) => {
    const feilMeldingsdata = selectAktivitetStatus(state) === Status.ERROR && selectAktiviteterSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};

export function selectAktivitetFhoLestStatus(state) {
    return selectAktiviteterSlice(state).fhoLestStatus;
}

export function selectAktivitetFhoBekreftStatus(state) {
    return selectAktiviteterSlice(state).fhoBekreftStatus;
}
