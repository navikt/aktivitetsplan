const selectUtskriftSlice = state => state.view.utskrift;
export const hentPrintMelding = state => selectUtskriftSlice(state).data;

export function skalVisePrintMeldingForm(state) {
    const utskriftSlice = selectUtskriftSlice(state);
    return (
        Object.keys(utskriftSlice.data).length === 0 || utskriftSlice.redigerer
    );
}
