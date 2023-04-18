import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { RootState } from '../../../store';
import { FilterState } from './filter-slice';
import {
    AktivitetFilterType,
    ArenaEtikettFilterType,
    AvtaltFilterType,
    EtikettFilterType,
    StatusFilterType,
} from './FilterVisning';

export function selectFilterSlice(state: RootState): FilterState {
    return state.data.filter;
}

export function selectHistoriskPeriode(state: RootState): HistoriskOppfolgingsperiode | null {
    return selectFilterSlice(state).historiskPeriode;
}

export function selectAktivitetTyperFilter(state: RootState): AktivitetFilterType {
    return selectFilterSlice(state).aktivitetTyper;
}

export function selectAktivitetEtiketterFilter(state: RootState): EtikettFilterType {
    return selectFilterSlice(state).aktivitetEtiketter;
}

export function selectArenaAktivitetEtiketterFilter(state: RootState): ArenaEtikettFilterType {
    return selectFilterSlice(state).arenaAktivitetEtiketter;
}

export function selectAktivitetStatusFilter(state: RootState): StatusFilterType {
    return selectFilterSlice(state).aktivitetStatus;
}

export function selectAktivitetAvtaltMedNavFilter(state: RootState): AvtaltFilterType {
    return selectFilterSlice(state).aktivitetAvtaltMedNav;
}

export function selectViserInneverendePeriode(state: RootState) {
    return !selectHistoriskPeriode(state);
}

export function selectViserHistoriskPeriode(state: RootState) {
    return !selectViserInneverendePeriode(state);
}
