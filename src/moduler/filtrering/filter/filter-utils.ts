import { isBefore, isWithinInterval } from 'date-fns';

import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { selectForrigeHistoriskeSluttDato } from '../../oppfolging-status/oppfolging-selectorts';
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

export function selectDatoErIPeriode(dato: string, state: { sluttDato: any }[]): boolean {
    const historiskPeriode = selectHistoriskPeriode(state);
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

export function aktivitetFilter(aktivitet: AlleAktiviteter, state: any) {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    if (erAktivtFilter(aktivitetTypeFilter) && !aktivitetTypeFilter[aktivitet.type]) {
        if (
            aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
            !aktivitetTypeFilter[aktivitet.eksternAktivitetData.subtype]
        ) {
            return false;
        }
        if (aktivitet.type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE && !aktivitetTypeFilter[aktivitet.type]) {
            return false;
        }
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (erAktivtFilter(etikettFilter) && (!etikettFilter[aktivitet.etikett!!] || !isVeilarbAktivitet(aktivitet))) {
        return false;
    }

    const arenaEtikettFilter = selectArenaAktivitetEtiketterFilter(state);
    if (
        erAktivtFilter(arenaEtikettFilter) &&
        (!isArenaAktivitet(aktivitet) || !arenaEtikettFilter[aktivitet.etikett])
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
