import { datoComparator } from '../utils';

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
