export function selectFilterSlice(state) {
    return state.data.filter;
}

export function selectHistoriskPeriode(state) {
    return selectFilterSlice(state).historiskPeriode;
}

export function selectAktivitetTyperFilter(state) {
    return selectFilterSlice(state).aktivitetTyper;
}

export function selectAktivitetEtiketterFilter(state) {
    return selectFilterSlice(state).aktivitetEtiketter;
}

export function selectArenaAktivitetEtiketterFilter(state) {
    return selectFilterSlice(state).arenaAktivitetEtiketter;
}

export function selectAktivitetStatusFilter(state) {
    return selectFilterSlice(state).aktivitetStatus;
}

export function selectAktivitetAvtaltMedNavFilter(state) {
    return selectFilterSlice(state).aktivitetAvtaltMedNav;
}

export function selectViserInneverendePeriode(state) {
    return !selectHistoriskPeriode(state);
}

export function selectViserHistoriskPeriode(state) {
    return !selectViserInneverendePeriode(state);
}
