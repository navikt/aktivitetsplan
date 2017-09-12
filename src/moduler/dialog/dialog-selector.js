import { dialogFilter } from '../filtrering/filter/filter-utils';
import { DIALOG_ESKALERING } from '../../constant';
import { erEskaleringsDialog } from '../../dialog/dialog-utils';

function selectDialogSlice(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogSlice(state).status;
}

export function selectEskaleringsFilter(state) {
    return selectDialogSlice(state).esklaringsFilter;
}

export function selectDialoger(state) {
    const ikkeFjernDeSomIkkeErEskaleringer = !selectEskaleringsFilter(state);
    return selectDialogSlice(state).data
        .filter(d => dialogFilter(d, state))
        .filter(
            d => erEskaleringsDialog(d) || ikkeFjernDeSomIkkeErEskaleringer
        );
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

export function selectHarEskaleringer(state) {
    return selectDialoger(state).filter(erEskaleringsDialog).length > 0;
}
