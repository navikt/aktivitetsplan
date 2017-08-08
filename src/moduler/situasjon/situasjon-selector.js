export const selectSituasjonReducer = state => state.data.situasjon;
export const selectReservasjonKRR = state =>
    selectSituasjonReducer(state).data.reservasjonKRR;

export function selectOppfolgingsPerioder(state) {
    return selectSituasjonReducer(state).data.oppfolgingsPerioder;
}

export function selectErUnderOppfolging(state) {
    return selectSituasjonReducer(state).data.underOppfolging;
}

export function selectOppfolgingUtgang(state) {
    return selectSituasjonReducer(state).data.oppfolgingUtgang;
}

export function selectSituasjonStatus(state) {
    return selectSituasjonReducer(state).status;
}

export default {};
