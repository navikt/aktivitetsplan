export const selectSituasjonReducer = state => state.data.situasjon;
export const selectReservasjonKRR = state =>
    selectSituasjonReducer(state).data.reservasjonKRR;

export function selectOppfolgingsPerioder(state) {
    return selectSituasjonReducer(state).data.oppfolgingsPerioder;
}

export function selectHistoriskeOppfolgingsPerioder(state) {
    return selectOppfolgingsPerioder(state).filter(p => p.sluttDato);
}

export function selectErUnderOppfolging(state) {
    return selectSituasjonReducer(state).data.underOppfolging;
}

export function selectOppfolgingUtgang(state) {
    return selectSituasjonReducer(state).data.oppfolgingUtgang;
}

export function selectErBrukerManuell(state) {
    return selectSituasjonReducer(state).data.manuell;
}

export function selectVilkarMaBesvares(state) {
    return selectSituasjonReducer(state).data.vilkarMaBesvares;
}

export function selectGjeldendeEskaleringsVarsel(state) {
    return selectSituasjonReducer(state).data.gjeldendeEskaleringsvarsel;
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
    return selectSituasjonReducer(state).status;
}

export default {};
