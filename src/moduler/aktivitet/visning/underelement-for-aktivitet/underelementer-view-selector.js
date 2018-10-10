function selectUnderelementerViewSlice(state) {
    return state.view.underelementer;
}

export function selectVisDialog(state) {
    return selectUnderelementerViewSlice(state).visDialog;
}

export function selectVisHistorikk(state) {
    return selectUnderelementerViewSlice(state).visHistorikk;
}
