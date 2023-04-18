import { SerializedError } from '../../api/utils';
import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectFeil } from '../feilmelding/feil-selector';
import { hentArenaAktiviteter } from './arena-aktiviteter-slice';

export const selectArenaAktiviteterSlice = (state: RootState) => state.data.arenaAktiviteter;

export const selectArenaAktiviteterData = (state: RootState) => selectArenaAktiviteterSlice(state).data;

export const selectArenaAktivitetStatus = (state: RootState) => selectArenaAktiviteterSlice(state).status;

export const selectArenaFeilmeldinger = (state: RootState): SerializedError[] => {
    return selectArenaAktivitetStatus(state) === Status.ERROR
        ? selectFeil(hentArenaAktiviteter.rejected.type)(state)
        : [];
};
