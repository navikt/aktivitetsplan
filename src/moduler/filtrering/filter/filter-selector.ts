import { RootState } from '../../../store';
import { FilterState } from './filter-slice';
import { AktivitetFilterType, ArenaEtikettFilterType, AvtaltFilterType, EtikettFilterType } from './FilterVisning';

export function selectFilterSlice(state: RootState): FilterState {
    return state.data.filter;
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

export function selectAktivitetAvtaltMedNavFilter(state: RootState): AvtaltFilterType {
    return selectFilterSlice(state).aktivitetAvtaltMedNav;
}
