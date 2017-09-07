import { selectErBruker } from '../identitet/identitet-selector';
import { datoComparator } from '../../utils';
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

export function sammenlignDialogerForBruker(a, b) {
    if (a.lest !== b.lest) {
        return a.lest ? 1 : -1;
    } else if (a.venterPaSvar !== b.venterPaSvar) {
        return a.venterPaSvar ? 1 : -1;
    } else if (a.ferdigBehandlet !== b.ferdigBehandlet) {
        return a.ferdigBehandlet ? 1 : -1;
    }
    return datoComparator(b.sisteDato, a.sisteDato);
}

export function sammenlignDialogerForVeileder(a, b) {
    if (a.ferdigBehandlet !== b.ferdigBehandlet) {
        return a.ferdigBehandlet ? 1 : -1;
    } else if (a.venterPaSvar !== b.venterPaSvar) {
        return a.venterPaSvar ? 1 : -1;
    } else if (a.lest !== b.lest) {
        return a.lest ? 1 : -1;
    }
    return datoComparator(b.sisteDato, a.sisteDato);
}

export function selectDialogIderSortert(state) {
    const erBruker = selectErBruker(state);

    return [...selectDialogData(state)]
        .sort(
            erBruker
                ? sammenlignDialogerForBruker
                : sammenlignDialogerForVeileder
        )
        .map(dialog => dialog.id);
}
