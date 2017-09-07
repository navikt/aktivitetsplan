import { dialogFilter } from '../filtrering/filter/filter-utils';

export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogReducer(state).status;
}

export function selectDialogData(state) {
    return selectDialogReducer(state).data;
}

export function selectDialoger(state) {
    return selectDialogData(state).filter(d => dialogFilter(d, state));
}

export function selectDialogMedId(state, dialogId) {
    return selectDialoger(state).find(d => d.id === dialogId);
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    return selectDialoger(state).find(d => d.aktivitetId === aktivitetId);
}

export function selectHarUbehandledeDialoger(state) {
    const data = selectDialoger(state);
    return (
        data.filter(
            dialog =>
                dialog.historisk === false &&
                (dialog.ferdigBehandlet === false || dialog.venterPaSvar)
        ).length > 0
    );
}
