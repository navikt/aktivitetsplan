function selectAktiviteter(state) {
    return state.data.aktiviteter;
}

export function selectAktivitetStatus(state) {
    return selectAktiviteter(state).status;
}

export function selectForrigeAktiveAktivitetId(state) {
    return selectAktiviteter(state).forrigeAktiveAktivitetId;
}

export default {};
