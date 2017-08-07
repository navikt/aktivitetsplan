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

export function selectViserInneverendePeriode(state) {
    return !state.data.filter.historiskPeriode;
}

export function selectViserHistoriskPeriode(state) {
    return !selectViserInneverendePeriode(state);
}
