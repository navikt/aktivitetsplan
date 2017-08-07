export const selectSituasjonReducer = state => state.data.situasjon;
export const selectReservasjonKRR = state =>
    selectSituasjonReducer(state).data.reservasjonKRR;

export function selectErUnderOppfolging(state) {
    return state.data.situasjon.data.underOppfolging;
}

export default {};
