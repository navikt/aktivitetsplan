export const selectSituasjonSlice = state => state.data.situasjon;

const selectSituasjonData = state => selectSituasjonSlice(state).data;

export const selectReservasjonKRR = state =>
    selectSituasjonData(state).reservasjonKRR;

export function selectOppfolgingsPerioder(state) {
    return selectSituasjonData(state).oppfolgingsPerioder;
}

export function selectHistoriskeOppfolgingsPerioder(state) {
    return selectOppfolgingsPerioder(state).filter(p => p.sluttDato);
}

export function selectErUnderOppfolging(state) {
    return selectSituasjonData(state).underOppfolging;
}

export function selectOppfolgingUtgang(state) {
    return selectSituasjonData(state).oppfolgingUtgang;
}

export function selectErBrukerManuell(state) {
    return selectSituasjonData(state).manuell;
}

export function selectVilkarMaBesvares(state) {
    return selectSituasjonData(state).vilkarMaBesvares;
}

export function selectGjeldendeEskaleringsVarsel(state) {
    return selectSituasjonData(state).gjeldendeEskaleringsvarsel;
}

export function selectErEskalert(state) {
    return !!selectGjeldendeEskaleringsVarsel(state);
}

export function selectTilHorendeDialogId(state) {
    if (selectGjeldendeEskaleringsVarsel(state)) {
        return selectGjeldendeEskaleringsVarsel(state).tilhorendeDialogId;
    }
    return null;
}

export function selectSituasjonStatus(state) {
    return selectSituasjonSlice(state).status;
}

export function selectAvslutningStatus(state) {
    return selectSituasjonSlice(state).avslutningStatus;
}

export function selectKanAvslutte(state) {
    return selectAvslutningStatus(state).kanAvslutte;
}

export function selectBrukerHarAvslatt(state) {
    return selectSituasjonSlice(state).brukerHarAvslatt;
}

export function selectKanIkkeStartaEskaleringen(state) {
    return (
        selectErEskalert(state) ||
        !selectErUnderOppfolging(state) ||
        selectReservasjonKRR(state) || selectErBrukerManuell(state))

}

export default {};
