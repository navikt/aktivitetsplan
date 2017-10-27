import { datoComparator } from '../../utils';
import { DIALOG_ESKALERING } from '../../constant';

export function sammenlignDialogerForBruker(a, b) {
    if (a.lest !== b.lest) {
        return a.lest ? 1 : -1;
    } else if (a.venterPaSvar !== b.venterPaSvar) {
        return a.venterPaSvar ? -1 : 1;
    } else if (a.ferdigBehandlet !== b.ferdigBehandlet) {
        return a.ferdigBehandlet ? 1 : -1;
    }
    return datoComparator(b.sisteDato, a.sisteDato);
}

export function sammenlignDialogerForVeileder(a, b) {
    if (a.lest !== b.lest) {
        return a.lest ? 1 : -1;
    } else if (a.ferdigBehandlet !== b.ferdigBehandlet) {
        return a.ferdigBehandlet ? 1 : -1;
    } else if (a.venterPaSvar !== b.venterPaSvar) {
        // F17HL4-68
        return a.venterPaSvar ? -1 : 1;
    }
    return datoComparator(b.sisteDato, a.sisteDato);
}

function dialogSammenligner(a, b, tilhorendeDialogId, erBruker) {
    if (tilhorendeDialogId !== null) {
        if (tilhorendeDialogId === parseInt(a.id, 10)) {
            return -1;
        } else if (tilhorendeDialogId === parseInt(b.id, 10)) {
            return 1;
        }
    }

    return erBruker
        ? sammenlignDialogerForBruker(a, b)
        : sammenlignDialogerForVeileder(a, b);
}

export function dialogSammenlingnerMedTilhorendeDialogIdOgErBruker(
    tilhorendeDialogId,
    erBruker
) {
    return (a, b) => dialogSammenligner(a, b, tilhorendeDialogId, erBruker);
}

export function erEskaleringsDialog(dialog) {
    return dialog.egenskaper.indexOf(DIALOG_ESKALERING) > -1;
}
