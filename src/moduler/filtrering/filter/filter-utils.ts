import { selectHistoriskeOppfolgingsPerioder } from '../../oppfolging-status/oppfolging-selector';
import {
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectHistoriskPeriode,
    selectAktivitetStatusFilter,
    selectAktivitetAvtaltMedNavFilter,
} from './filter-selector';

function erAktivtFilter(filterData) {
    return Object.values(filterData).indexOf(true) >= 0;
}

// TODO depricated see newDatoErIPeriode
export function datoErIPeriode(dato, state) {
    const historiskPeriode = selectHistoriskPeriode(state);
    if (historiskPeriode) {
        return dato >= historiskPeriode.fra && dato <= historiskPeriode.til;
    }
    const historiskeOppfolgingsPerioder = selectHistoriskeOppfolgingsPerioder(state) || [];

    const forrigeSluttDato = historiskeOppfolgingsPerioder
        .map((p) => p.sluttDato)
        .sort()
        .reverse()[0];
    return !forrigeSluttDato || dato >= forrigeSluttDato;
}

export function newDatoErIPeriode(dato, historiskPeriode, forrigeSluttDato) {
    if (historiskPeriode) {
        return dato >= historiskPeriode.fra && dato <= historiskPeriode.til;
    }
    return !forrigeSluttDato || dato >= forrigeSluttDato;
}

export function aktivitetFilter(aktivitet, state) {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    if (erAktivtFilter(aktivitetTypeFilter) && !aktivitetTypeFilter[aktivitet.type]) {
        return false;
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (erAktivtFilter(etikettFilter) && !etikettFilter[aktivitet.etikett]) {
        return false;
    }

    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    if (erAktivtFilter(aktivitetStatusFilter) && !aktivitetStatusFilter[aktivitet.status]) {
        return false;
    }

    const aktivitetAvtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);

    const avtaltMedNavFilter = aktivitetAvtaltMedNavFilter.avtaltMedNav;
    const ikkeAvtaltMedNavFilter = aktivitetAvtaltMedNavFilter.ikkeAvtaltMedNav;
    const { avtalt } = aktivitet;
    const aktivtAvtaltFilter = avtaltMedNavFilter ^ ikkeAvtaltMedNavFilter;
    const muligeAvtaltFiltereringer = (avtaltMedNavFilter && !avtalt) || (ikkeAvtaltMedNavFilter && avtalt);

    return !(aktivtAvtaltFilter && muligeAvtaltFiltereringer);
}

export function dialogFilter(dialog, state) {
    return datoErIPeriode(dialog.opprettetDato, state);
}
