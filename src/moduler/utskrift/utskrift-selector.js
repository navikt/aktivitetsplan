import { selectErVeileder } from '../identitet/identitet-selector';
import { selectErBrukerManuell } from '../situasjon/situasjon-selector';

const selectUtskriftSlice = state => state.view.utskrift;
export const hentPrintMelding = state => selectUtskriftSlice(state).data;

export function skalVisePrintMeldingForm(state) {
    const utskriftSlice = selectUtskriftSlice(state);
    const erVeileder = selectErVeileder(state);
    const erBrukerManuell = selectErBrukerManuell(state);

    return erVeileder && erBrukerManuell && !utskriftSlice.printMeldingFerdig;
}
