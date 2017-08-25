import { selectHistoriskeOppfolgingsPerioder } from '../situasjon/situasjon-selector';
import {
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectHistoriskPeriode,
    selectAktivitetStatusFilter,
} from './filter-selector';

function erAktivtFilter(filterData) {
    return Object.values(filterData).indexOf(true) >= 0;
}

export function datoErIPeriode(dato, state) {
    const historiskPeriode = selectHistoriskPeriode(state);
    if (historiskPeriode) {
        return dato >= historiskPeriode.fra && dato <= historiskPeriode.til;
    }
    const historiskeOppfolgingsPerioder =
        selectHistoriskeOppfolgingsPerioder(state) || [];

    const forrigeSluttDato = historiskeOppfolgingsPerioder
        .map(p => p.sluttDato)
        .sort()
        .reverse()[0];
    return !forrigeSluttDato || dato >= forrigeSluttDato;
}

export function aktivitetFilter(aktivitet, state) {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    if (
        erAktivtFilter(aktivitetTypeFilter) &&
        !aktivitetTypeFilter[aktivitet.type]
    ) {
        return false;
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (erAktivtFilter(etikettFilter) && !etikettFilter[aktivitet.etikett]) {
        return false;
    }

    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    if (
        erAktivtFilter(aktivitetStatusFilter) &&
        !aktivitetStatusFilter[aktivitet.status]
    ) {
        return false;
    }

    return datoErIPeriode(aktivitet.opprettetDato, state);
}

export function dialogFilter(dialog, state) {
    return datoErIPeriode(dialog.opprettetDato, state);
}
