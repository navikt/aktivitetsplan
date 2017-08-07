export function selectFilterReducer(state) {
    return state.data.filter;
}

export function selectHistoriskPeriode(state) {
    return selectFilterReducer(state).historiskPeriode;
}

export function selectAktivitetTyperFilter(state) {
    return selectFilterReducer(state).aktivitetTyper;
}

export function selectAktivitetEtiketterFilter(state) {
    return selectFilterReducer(state).aktivitetEtiketter;
}
