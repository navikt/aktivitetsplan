function selectAktiviteter(state) {
    return state.data.aktiviteter;
}

export function selectForrigeAktiveAktivitetId(state) {
    return selectAktiviteter(state).forrigeAktiveAktivitetId;
}

export default {};
