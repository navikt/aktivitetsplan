import { isBefore, isWithinInterval } from 'date-fns';

import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { isEksternAktivitet } from '../../../datatypes/internAktivitetTypes';
import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { RootState } from '../../../store';
import { selectValgtPeriode } from '../../oppfolging-status/oppfolging-selector';
import { getType } from './AktivitetTypeFilter';
import { getArenaFilterableFields, getEksternFilterableFields } from './TiltakstatusFilter';
import { getStillingStatusFilterValue } from './EtikettFilter';
import {
    selectAktivitetAvtaltMedNavFilter,
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectArenaAktivitetEtiketterFilter
} from './filter-selector';
import { FilterState } from './filter-slice';

export const filterErAktivt = (filter: FilterState): boolean =>
        erAktivtFilter(filter.aktivitetEtiketter) ||
        erAktivtFilter(filter.aktivitetTyper) ||
        erAktivtFilter(filter.arenaAktivitetEtiketter) ||
        erAktivtFilter(filter.aktivitetAvtaltMedNav);

function erAktivtFilter(filterData: any) {
    return Object.values(filterData).indexOf(true) >= 0;
}

export function selectDatoErIPeriode(dato: string, state: RootState): boolean {
    const valgtPeriode = selectValgtPeriode(state);
    if (!valgtPeriode) return false;
    const intervall = {
        start: new Date(valgtPeriode.start),
        end: valgtPeriode.slutt ? new Date(valgtPeriode.slutt) : new Date(),
    };
    return isWithinInterval(dato, intervall);
}

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

    const aktivitetAvtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);
    const avtaltMedNavFilter = aktivitetAvtaltMedNavFilter.AVTALT_MED_NAV;
    const ikkeAvtaltMedNavFilter = aktivitetAvtaltMedNavFilter.IKKE_AVTALT_MED_NAV;
    const { avtalt } = aktivitet;
    const aktivtAvtaltFilter = [avtaltMedNavFilter, ikkeAvtaltMedNavFilter].filter((it) => it).length === 1;
    const muligeAvtaltFiltereringer = (avtaltMedNavFilter && !avtalt) || (ikkeAvtaltMedNavFilter && avtalt);

    return !(aktivtAvtaltFilter && muligeAvtaltFiltereringer);
}
