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

export function selectAktivitetStatusFilter(state) {
    return selectFilterReducer(state).aktivitetStatus;
}

export function selectAktivitetAvtaltMedNavFilter(state) {
    return selectFilterReducer(state).aktivitetAvtaltMedNav;
}

export function selectViserInneverendePeriode(state) {
    return !selectHistoriskPeriode(state);
}

export function selectViserHistoriskPeriode(state) {
    return !selectViserInneverendePeriode(state);
}
