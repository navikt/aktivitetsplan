import { State } from '../../../reducer';
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

export function selectHistoriskPeriode(state: State) {
    return selectFilterSlice(state).historiskPeriode;
}

export function selectAktivitetTyperFilter(state: State): AktivitetFilterType {
    return selectFilterSlice(state).aktivitetTyper;
}

export function selectAktivitetEtiketterFilter(state: State): EtikettFilterType {
    return selectFilterSlice(state).aktivitetEtiketter;
}

export function selectArenaAktivitetEtiketterFilter(state: State): ArenaEtikettFilterType {
    return selectFilterSlice(state).arenaAktivitetEtiketter;
}

export function selectAktivitetStatusFilter(state: State): StatusFilterType {
    return selectFilterSlice(state).aktivitetStatus;
}

export function selectAktivitetAvtaltMedNavFilter(state: State): AvtaltFilterType {
    return selectFilterSlice(state).aktivitetAvtaltMedNav;
}

export function selectViserInneverendePeriode(state: State) {
    return !selectHistoriskPeriode(state);
}

export function selectViserHistoriskPeriode(state: State) {
    return !selectViserInneverendePeriode(state);
}
