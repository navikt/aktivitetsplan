function selectVersjonerSlice(state) {
    return state.data.versjoner;
}

export function selectVersjonerStatus(state) {
    return selectVersjonerSlice(state).status;
}

export function selectSorterteVersjoner(state) {
    return selectVersjonerSlice(state).data.sort((a, b) =>
        b.endretDato.localeCompare(a.endretDato)
    );
}
