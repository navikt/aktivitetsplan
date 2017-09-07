import { dialogFilter } from '../filtrering/filter/filter-utils';

function selectDialogSlice(state) {
    return state.data.dialog;
}

export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogSlice(state).status;
}

export function selectDialogData(state) {
    return selectDialogSlice(state).data;
}

export function selectDialoger(state) {
    return selectDialogData(state).filter(d => dialogFilter(d, state));
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    const dialoger = selectDialogSlice(state).data;
    return dialoger.find(d => d.aktivitetId === aktivitetId);
}

export function selectHarUbehandledeDialoger(state) {
    const data = selectDialogSlice(state).data;
    return (
        data.filter(
            dialog =>
                dialog.historisk === false &&
                (dialog.ferdigBehandlet === false || dialog.venterPaSvar)
        ).length > 0
    );
}
