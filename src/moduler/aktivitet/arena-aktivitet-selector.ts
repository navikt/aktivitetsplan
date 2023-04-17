import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeilSlice } from '../feilmelding/feil-selector';
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
