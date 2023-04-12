import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';

export const selectArenaAktiviteterSlice = (state: RootState) => state.data.arenaAktiviteter;

export const selectArenaAktiviteterData = (state: RootState) => selectArenaAktiviteterSlice(state).data;

export const selectArenaAktivitetStatus = (state: RootState) => selectArenaAktiviteterSlice(state).status;

export const selectArenaFeilmeldinger = (state: RootState) => {
    const feilMeldingsdata =
        selectArenaAktivitetStatus(state) === Status.ERROR && selectArenaAktiviteterSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};

export function selectArenaAktivitetFhoLestStatus(state: RootState) {
    return selectArenaAktiviteterSlice(state).fhoLestStatus;
}
