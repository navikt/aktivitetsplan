import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeilSlice } from '../feilmelding/feil-slice';
import { hentNivaa4 } from '../tilgang/tilgang-slice';
import { hentArenaAktiviteter } from './arena-aktiviteter-slice';

export const selectArenaAktiviteterSlice = (state: RootState) => state.data.arenaAktiviteter;

export const selectArenaAktiviteterData = (state: RootState) => selectArenaAktiviteterSlice(state).data;

export const selectArenaAktivitetStatus = (state: RootState) => selectArenaAktiviteterSlice(state).status;

export const selectArenaFeilmeldinger = (state: RootState) => {
    const feilMeldingsdata =
        selectArenaAktivitetStatus(state) === Status.ERROR &&
        selectFeilSlice(state)[hentArenaAktiviteter.rejected.type];
    return feilMeldingsdata;
};

export function selectArenaAktivitetFhoLestStatus(state: RootState) {
    return selectArenaAktiviteterSlice(state).fhoLestStatus;
}
