import { isBefore, isWithinInterval } from 'date-fns';

import { isArenaAktivitet, isVeilarbAktivitetAktivitet } from '../../../datatypes/aktivitetTypes';
import { selectForrigeHistoriskeSluttDato } from '../../oppfolging-status/oppfolging-selector';
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

// TODO depricated see selectDatoErIPeriode
export interface Periode {
    fra: string;
    til: string;
}

export function selectDatoErIPeriode(dato: string, state: any): boolean {
    const historiskPeriode = selectHistoriskPeriode(state);
    // @ts-ignore : for å unngå runtimefeil "Argument of type 'any' is not assignable to parameter of type 'never'".
    const forrigeHistoriskeSluttDato = selectForrigeHistoriskeSluttDato(state);

    return datoErIPeriode(dato, historiskPeriode, forrigeHistoriskeSluttDato);
}

//TODO: Flytte til utils når den er ts
const isAfterOrEqual = (date: Date, dateToCompare: Date) => !isBefore(date, dateToCompare);

export function datoErIPeriode(dato: string, valgtHistoriskPeriode?: Periode, sistePeriodeSluttDato?: string) {
    const datoDate = new Date(dato);

    if (valgtHistoriskPeriode) {
        const intervall = {
            start: new Date(valgtHistoriskPeriode.fra),
            end: new Date(valgtHistoriskPeriode.til),
        };
        return isWithinInterval(datoDate, intervall);
    }
    return !sistePeriodeSluttDato || isAfterOrEqual(datoDate, new Date(sistePeriodeSluttDato));
}

export function aktivitetFilter(aktivitet: any, state: any) {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    if (erAktivtFilter(aktivitetTypeFilter) && !aktivitetTypeFilter[aktivitet.type]) {
        return false;
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (
        erAktivtFilter(etikettFilter) &&
        (!etikettFilter[aktivitet.etikett] || !isVeilarbAktivitetAktivitet(aktivitet))
    ) {
        return false;
    }

    const arenaEtikettFilter = selectArenaAktivitetEtiketterFilter(state);
    if (
        erAktivtFilter(arenaEtikettFilter) &&
        (!arenaEtikettFilter[aktivitet.etikett] || !isArenaAktivitet(aktivitet))
    ) {
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
