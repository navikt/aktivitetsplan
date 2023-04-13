import { Store } from 'redux';

import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import {
    AktivitetFilterType,
    ArenaEtikettFilterType,
    AvtaltFilterType,
    EtikettFilterType,
    StatusFilterType,
} from './FilterVisning';

export function selectFilterSlice(state: any) {
    return state.data.filter;
}

export function selectHistoriskPeriode(state: Store): HistoriskOppfolgingsperiode {
    return selectFilterSlice(state).historiskPeriode;
}

export function selectAktivitetTyperFilter(state: Store): AktivitetFilterType {
    return selectFilterSlice(state).aktivitetTyper;
}

export function selectAktivitetEtiketterFilter(state: Store): EtikettFilterType {
    return selectFilterSlice(state).aktivitetEtiketter;
}

export function selectArenaAktivitetEtiketterFilter(state: Store): ArenaEtikettFilterType {
    return selectFilterSlice(state).arenaAktivitetEtiketter;
}

export function selectAktivitetStatusFilter(state: Store): StatusFilterType {
    return selectFilterSlice(state).aktivitetStatus;
}

export function selectAktivitetAvtaltMedNavFilter(state: Store): AvtaltFilterType {
    return selectFilterSlice(state).aktivitetAvtaltMedNav;
}

export function selectViserInneverendePeriode(state: Store) {
    return !selectHistoriskPeriode(state);
}

export function selectViserHistoriskPeriode(state: Store) {
    return !selectViserInneverendePeriode(state);
}
