import { selectErVeileder } from '../identitet/identitet-selector';
import { selectErBrukerManuell } from '../oppfolging/oppfolging-selector';

const selectUtskriftSlice = state => state.view.utskrift;
export const hentPrintMelding = state => selectUtskriftSlice(state).data;

export function selectKanHaPrintMeldingForm(state) {
    const erVeileder = selectErVeileder(state);
    const erBrukerManuell = selectErBrukerManuell(state);
    return erVeileder && erBrukerManuell;
}

export function selectSkalVisePrintMeldingForm(state) {
    const utskriftSlice = selectUtskriftSlice(state);
    return (
        selectKanHaPrintMeldingForm(state) && !utskriftSlice.printMeldingFerdig
    );
}
