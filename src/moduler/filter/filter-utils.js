function erAktivtFilter(filterData) {
    return Object.values(filterData).indexOf(true) >= 0;
}

function datoErIPeriode(dato, state) {
    const stateData = state.data;
    const filter = stateData.filter;

    const historiskPeriode = filter.historiskPeriode;
    if (historiskPeriode) {
        return dato >= historiskPeriode.fra && dato <= historiskPeriode.til;
    }
    const oppfolgingsPerioder = stateData.oppfolgingStatus.data
        .oppfolgingsPerioder || [];
    const forrigeSluttDato = oppfolgingsPerioder
        .map(p => p.sluttDato)
        .sort()
        .reverse()[0];
    return !forrigeSluttDato || dato >= forrigeSluttDato;
}

export function aktivitetFilter(aktivitet, state) {
    const stateData = state.data;
    const filter = stateData.filter;

    const filterAktiviteter = filter.aktivitetTyper;
    if (
        erAktivtFilter(filterAktiviteter) &&
        !filterAktiviteter[aktivitet.type]
    ) {
        return false;
    }

    const filterEtiketter = filter.aktivitetEtiketter;
    if (
        erAktivtFilter(filterEtiketter) &&
        !filterEtiketter[aktivitet.etikett]
    ) {
        return false;
    }

    return datoErIPeriode(aktivitet.opprettetDato, state);
}

export function dialogFilter(dialog, state) {
    return datoErIPeriode(dialog.opprettetDato, state);
}
