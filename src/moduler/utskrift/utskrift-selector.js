import { selectErVeileder } from '../identitet/identitet-selector';
import { selectErBrukerManuell, selectKvpPeriodeForValgteOppfolging } from '../oppfolging-status/oppfolging-selector';

const selectUtskriftSlice = state => state.view.utskrift;
export const hentPrintMelding = state => selectUtskriftSlice(state).data;

export function selectKanHaPrintMeldingForm(state) {
    const erVeileder = selectErVeileder(state);
    const erBrukerManuell = selectErBrukerManuell(state);
    return erVeileder && erBrukerManuell;
}

export function selectKanVelgePlanType(state) {
    const erVeileder = selectErVeileder(state);
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    const harKvpPeriode = kvpPerioder && kvpPerioder.length > 0;
    return erVeileder && harKvpPeriode;
}

export function selectUtskriftPlanType(state) {
    return selectUtskriftSlice(state).data.utskriftPlanType;
}

export function selectCurrentStepUtskrift(state) {
    return selectUtskriftSlice(state).currentStep;
}
