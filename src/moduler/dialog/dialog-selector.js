export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    const dialoger = selectDialogReducer(state).data;
    return dialoger.find(d => d.aktivitetId === aktivitetId);
}
