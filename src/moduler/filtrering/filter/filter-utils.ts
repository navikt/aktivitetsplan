import { isBefore, isWithinInterval } from 'date-fns';

import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { isEksternAktivitet } from '../../../datatypes/internAktivitetTypes';
import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { RootState } from '../../../store';
import { selectForrigeHistoriskeSluttDato } from '../../oppfolging-status/oppfolging-selector';
import { getType } from './AktivitetTypeFilter';
import { getArenaFilterableFields, getEksternFilterableFields } from './ArenaEtikettFilter';
import { getStillingStatusFilterValue } from './EtikettFilter';
import {
    selectAktivitetAvtaltMedNavFilter,
    selectAktivitetEtiketterFilter,
    selectAktivitetStatusFilter,
    selectAktivitetTyperFilter,
    selectArenaAktivitetEtiketterFilter,
    selectHistoriskPeriode,
} from './filter-selector';

function erAktivtFilter(filterData: any) {
    return Object.values(filterData).indexOf(true) >= 0;
}

export function selectDatoErIPeriode(dato: string, state: RootState): boolean {
    const historiskPeriode = selectHistoriskPeriode(state);
    const forrigeHistoriskeSluttDato = selectForrigeHistoriskeSluttDato(state);

    return datoErIPeriode(dato, historiskPeriode, forrigeHistoriskeSluttDato);
}

export function selectDatoErIPeriodeUtenState(
    dato: string,
    historiskPeriode: HistoriskOppfolgingsperiode | undefined | null,
    forrigeHistoriskeSluttDato: string | undefined,
): boolean {
    return datoErIPeriode(dato, historiskPeriode, forrigeHistoriskeSluttDato);
}

//TODO: Flytte til utils når den er ts
const isAfterOrEqual = (date: Date, dateToCompare: Date) => !isBefore(date, dateToCompare);

export function datoErIPeriode(
    dato: string,
    valgtHistoriskPeriode?: HistoriskOppfolgingsperiode | null,
    sistePeriodeSluttDato?: string,
) {
    const datoDate = new Date(dato);

    if (valgtHistoriskPeriode) {
        const intervall = {
            start: new Date(valgtHistoriskPeriode.startDato),
            end: new Date(valgtHistoriskPeriode.sluttDato),
        };

        return isWithinInterval(datoDate, intervall);
    }
    return !sistePeriodeSluttDato || isAfterOrEqual(datoDate, new Date(sistePeriodeSluttDato));
}

const hasNoOverlap = (a: string[], b: string[]): boolean => {
    return a.every((element) => !b.includes(element));
};

const activeFilters = (filterMap: Record<string, true | false>): string[] =>
    Object.entries(filterMap)
        .filter(([key, value]) => value)
        .map(([key, _]) => key);

const getTiltakstatusEtiketter = (aktivitet: AlleAktiviteter) => {
    if (isArenaAktivitet(aktivitet)) {
        return getArenaFilterableFields(aktivitet);
    } else if (isEksternAktivitet(aktivitet)) {
        return getEksternFilterableFields(aktivitet);
    }
    return [];
};

export function aktivitetMatchesFilters(aktivitet: AlleAktiviteter, state: any): boolean {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    const aktivitetType = getType(aktivitet);
    if (erAktivtFilter(aktivitetTypeFilter) && !aktivitetTypeFilter[aktivitetType]) {
        return false;
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (erAktivtFilter(etikettFilter)) {
        if (
            !isVeilarbAktivitet(aktivitet) ||
            hasNoOverlap(getStillingStatusFilterValue(aktivitet), activeFilters(etikettFilter))
        ) {
            return false;
        }
        return true;
    }

    const arenaEtikettFilter = selectArenaAktivitetEtiketterFilter(state);
    if (erAktivtFilter(arenaEtikettFilter)) {
        const aktiveFilters = Object.entries(arenaEtikettFilter)
            .filter(([_, val]: [string, unknown]) => !!val)
            .map(([key, _]: [string, unknown]) => key);
        const etiketter = getTiltakstatusEtiketter(aktivitet);
        if (hasNoOverlap(etiketter, aktiveFilters)) {
            return false;
        }
    }

    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    if (erAktivtFilter(aktivitetStatusFilter) && !aktivitetStatusFilter[aktivitet.status]) {
        return false;
    }

    const aktivitetAvtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);
    const avtaltMedNavFilter = aktivitetAvtaltMedNavFilter.AVTALT_MED_NAV;
    const ikkeAvtaltMedNavFilter = aktivitetAvtaltMedNavFilter.IKKE_AVTALT_MED_NAV;
    const { avtalt } = aktivitet;
    const aktivtAvtaltFilter = [avtaltMedNavFilter, ikkeAvtaltMedNavFilter].filter((it) => it).length === 1;
    const muligeAvtaltFiltereringer = (avtaltMedNavFilter && !avtalt) || (ikkeAvtaltMedNavFilter && avtalt);

    return !(aktivtAvtaltFilter && muligeAvtaltFiltereringer);
}
