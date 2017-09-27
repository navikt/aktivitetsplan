export function selectArenaAktiviteter(state) {
    return state.data.arenaAktiviteter;
}

export function selectArenaAktiviteterData(state) {
    return selectArenaAktiviteter(state).data;
}

export function selectArenaAktivitetStatus(state) {
    return selectArenaAktiviteter(state).status;
}

export default {};
