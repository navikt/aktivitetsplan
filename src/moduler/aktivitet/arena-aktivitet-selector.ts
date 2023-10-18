import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import { hentArenaAktiviteter } from './arena-aktiviteter-slice';
import { createSelector } from 'reselect';
import { SerializedError } from '../../api/utils';

export const selectArenaAktiviteterSlice = (state: RootState) => state.data.arenaAktiviteter;

export const selectArenaAktiviteterData = (state: RootState) => selectArenaAktiviteterSlice(state).data;

export const selectArenaAktivitetStatus = (state: RootState) => selectArenaAktiviteterSlice(state).status;

export const selectArenaFeilmeldinger: (state: RootState) => SerializedError[] = createSelector(
    selectArenaAktivitetStatus,
    selectErrors,
    (arenaAktivitetStatus, errors) => {
        return arenaAktivitetStatus === Status.ERROR ? selectFeil(errors, hentArenaAktiviteter.rejected.type) : [];
    },
);
