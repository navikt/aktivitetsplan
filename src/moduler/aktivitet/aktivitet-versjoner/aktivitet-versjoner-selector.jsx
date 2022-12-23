function selectVersjonerSlice(state) {
    return state.data.versjoner;
}

export function selectVersjonerStatus(state) {
    return selectVersjonerSlice(state).status;
}

export function selectSorterteVersjoner(state) {
    const versjoner = [...selectVersjonerSlice(state).data];
    return versjoner.sort((a, b) => b.endretDato.localeCompare(a.endretDato));
}
