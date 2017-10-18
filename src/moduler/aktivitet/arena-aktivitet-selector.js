export function selectArenaAktiviteterSlice(state) {
    return state.data.arenaAktiviteter;
}

export function selectArenaAktiviteterData(state) {
    return selectArenaAktiviteterSlice(state).data;
}

export function selectArenaAktivitetStatus(state) {
    return selectArenaAktiviteterSlice(state).status;
}
