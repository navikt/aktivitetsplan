import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeilSlice } from '../feilmelding/feil-slice';
import { hentAktivitet } from './aktivitet-actions';

export function selectAktiviteterSlice(state: RootState) {
    return state.data.aktiviteter;
}

export function selectAktiviteterData(state: RootState) {
    return selectAktiviteterSlice(state).data;
}

export function selectAktivitetStatus(state: RootState) {
    return selectAktiviteterSlice(state).status;
}

export function selectHarTilgangTilAktiviteter(state: RootState) {
    return selectAktivitetStatus(state) === Status.OK;
}

export function selectLasterAktivitetData(state: RootState) {
    return selectAktivitetStatus(state) !== Status.OK;
}

export const selectAktivitetFeilmeldinger = (state: RootState) => {
    const feilMeldingsdata =
        selectAktivitetStatus(state) === Status.ERROR && selectFeilSlice(state)[hentAktivitet.rejected.type];
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};

export function selectAktivitetFhoLestStatus(state: RootState) {
    return selectAktiviteterSlice(state).fhoLestStatus;
}

export function selectAktivitetFhoBekreftStatus(state: RootState) {
    return selectAktiviteterSlice(state).fhoBekreftStatus;
}
