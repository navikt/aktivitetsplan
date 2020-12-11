import { STATUS } from '../../api/utils';

export function selectArenaAktiviteterSlice(state) {
    return state.data.arenaAktiviteter;
}

export function selectArenaAktiviteterData(state) {
    return selectArenaAktiviteterSlice(state).data;
}

export function selectArenaAktivitetStatus(state) {
    return selectArenaAktiviteterSlice(state).status;
}

export const selectArenaFeilmeldinger = (state) => {
    const feilMeldingsdata =
        selectArenaAktivitetStatus(state) === STATUS.ERROR && selectArenaAktiviteterSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};
