import { dialogFilter } from '../filtrering/filter/filter-utils';
import { DIALOG_ESKALERING } from '../../constant';
import { erEskaleringsDialog } from '../../dialog/dialog-utils';

function selectDialogSlice(state) {
    return state.data.dialog;
}

export function selectDialogReducer(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogSlice(state).status;
}

export function selectEskaleringsFilter(state) {
    return selectDialogSlice(state).esklaringsFilter;
}

export function selectEskaleringsDialoger(state) {
    return selectDialogSlice(state).data.filter(erEskaleringsDialog);
}

export function selectDialogData(state) {
    if (selectEskaleringsFilter(state)) {
        return selectEskaleringsDialoger(state);
    }
    return selectDialogSlice(state).data;
}

export function selectDialoger(state) {
    return selectDialogData(state).filter(d => dialogFilter(d, state));
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

export function selectHarEskaleringer(state) {
    return selectEskaleringsDialoger(state).length > 0;
}
