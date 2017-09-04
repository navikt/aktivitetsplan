export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogReducer(state).status;
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    const dialoger = selectDialogReducer(state).data;
    return dialoger.find(d => d.aktivitetId === aktivitetId);
}

export function selectHarUbehandledeDialoger(state) {
    const data = selectDialogReducer(state).data;
    return (
        data.filter(
            dialog =>
                dialog.historisk === false &&
                (dialog.ferdigBehandlet === false || dialog.venterPaSvar)
        ).length > 0
    );
}
