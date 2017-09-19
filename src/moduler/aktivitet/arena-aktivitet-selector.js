function selectArenaAktiviteter(state) {
    return state.data.arenaAktiviteter;
}

export function selectArenaAktivitetStatus(state) {
    return selectArenaAktiviteter(state).status;
}

export default {};
