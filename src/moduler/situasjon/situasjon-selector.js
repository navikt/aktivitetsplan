export const selectSituasjonSlice = state => state.data.situasjon;

const selectSituasjonData = state => selectSituasjonSlice(state).data;

export function selectSituasjonStatus(state) {
    return selectSituasjonSlice(state).status;
}
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

export function selectAvslutningStatus(state) {
    return selectSituasjonData(state).avslutningStatus;
}

export function selectUnderOppfolging(state) {
    return selectAvslutningStatus(state).underOppfolging;
}

export function selectBrukerHarAvslatt(state) {
    return selectSituasjonData(state).brukerHarAvslatt;
}

export function selectKanIkkeStartaEskaleringen(state) {
    return (
        selectErEskalert(state) ||
        !selectErUnderOppfolging(state) ||
        selectReservasjonKRR(state) ||
        selectErBrukerManuell(state)
    );
}

export default {};
