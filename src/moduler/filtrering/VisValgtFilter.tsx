import { Chips, Label } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import {
    aktivitetTypeMap,
    avtaltMapper,
    stillingOgStillingFraNavEtikettMapper,
    tiltakOgEksternAktivitetEtikettMapper,
} from '../../utils/textMappers';
import { selectFilterSlice } from './filter/filter-selector';
import {
    FilterStateEntry,
    FilterStateEntryKey,
    filterTypes,
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsType,
    toggleArenaAktivitetsEtikett,
} from './filter/filter-slice';
import {
    AktivitetFilterType,
    ArenaEtikettFilterType,
    AvtaltFilterType,
    EtikettFilterType,
} from './filter/FilterVisning';
import FiltreringLabelChip from './filteringslabel/FiltreringLabelChip';

const VisValgtFilter = () => {
    const filterSlice = useSelector(selectFilterSlice);

    const dispatch = useAppDispatch();

    const doToggleAktivitetsEtikett = (aktivitetsEtikett: keyof EtikettFilterType) =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett));
    const doToggleArenaAktivitetsEtikett = (arenaEtikett: keyof ArenaEtikettFilterType) =>
        dispatch(toggleArenaAktivitetsEtikett(arenaEtikett));
    const doToggleAktivitetsType = (aktivitetsType: keyof AktivitetFilterType) =>
        dispatch(toggleAktivitetsType(aktivitetsType));
    const doToggleAktivitetAvtaltMedNav = (aktivitetsStatus: keyof AvtaltFilterType) =>
        dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus));

    const setFilterValues = <T extends FilterStateEntryKey>(entry: T) => {
        switch (entry.category) {
            case 'aktivitetTyper':
                const aktivitetType = entry.keyActiveOnFilterCategory;
                return {
                    filterLabel: aktivitetTypeMap[aktivitetType],
                    toggleFilter: () => doToggleAktivitetsType(aktivitetType),
                };
            case 'aktivitetEtiketter':
                const aktivitetsEtikett = entry.keyActiveOnFilterCategory;
                return {
                    filterLabel: stillingOgStillingFraNavEtikettMapper[aktivitetsEtikett],
                    toggleFilter: () => doToggleAktivitetsEtikett(aktivitetsEtikett),
                };
            case 'arenaAktivitetEtiketter':
                const arenaAktivitetsEtikett = entry.keyActiveOnFilterCategory;
                return {
                    filterLabel: tiltakOgEksternAktivitetEtikettMapper[arenaAktivitetsEtikett],
                    toggleFilter: () => doToggleArenaAktivitetsEtikett(arenaAktivitetsEtikett),
                };
            case 'aktivitetAvtaltMedNav':
                const aktivitetAvtaltMedNav = entry.keyActiveOnFilterCategory;
                return {
                    filterLabel: avtaltMapper[aktivitetAvtaltMedNav],
                    toggleFilter: () => doToggleAktivitetAvtaltMedNav(aktivitetAvtaltMedNav),
                };
            default:
                throw Error('Ukjent filter');
        }
    };

    const activeFilterExists: boolean = Object.values(filterSlice).some((filterMap) => {
        if (!filterMap) return false;
        return Object.values(filterMap).some((value) => value === true);
    });

    return activeFilterExists ? (
        <div className="flex flex-wrap flex-col">
            <Label className="mb-2">Valgte filter</Label>
            <Chips>
                {filterTypes.map((filterType) => {
                    const activeFiltersMap = filterSlice[filterType];
                    if (activeFiltersMap === null) return null;

                    return getActiveFilterValues({
                        category: filterType,
                        subFilter: activeFiltersMap,
                    } as FilterStateEntry).map((activeFilter) => {
                        const filterValues = setFilterValues(activeFilter);
                        if (typeof filterValues === 'string') return null;
                        const { toggleFilter, filterLabel } = filterValues;
                        return (
                            <FiltreringLabelChip
                                key={activeFilter.keyActiveOnFilterCategory}
                                label={filterLabel}
                                slettFilter={toggleFilter}
                            />
                        );
                    });
                })}
            </Chips>
        </div>
    ) : null;
};

const getActiveFilterValues = (entry: FilterStateEntry): FilterStateEntryKey[] => {
    switch (entry.category) {
        case 'aktivitetTyper':
            return (Object.entries(entry.subFilter) as [keyof AktivitetFilterType, boolean][])
                .filter(([_, isFilterEnabled]) => isFilterEnabled)
                .map(([key]) => ({ category: 'aktivitetTyper' as const, keyActiveOnFilterCategory: key }));
        case 'aktivitetEtiketter':
            return (Object.entries(entry.subFilter) as [keyof EtikettFilterType, boolean][])
                .filter(([_, isFilterEnabled]) => isFilterEnabled)
                .map(([key]) => ({ category: 'aktivitetEtiketter' as const, keyActiveOnFilterCategory: key }));
        case 'arenaAktivitetEtiketter':
            return (Object.entries(entry.subFilter) as [keyof ArenaEtikettFilterType, boolean][])
                .filter(([_, isFilterEnabled]) => isFilterEnabled)
                .map(([key]) => ({ category: 'arenaAktivitetEtiketter' as const, keyActiveOnFilterCategory: key }));
        case 'aktivitetAvtaltMedNav':
            return (Object.entries(entry.subFilter) as [keyof AvtaltFilterType, boolean][])
                .filter(([_, isFilterEnabled]) => isFilterEnabled)
                .map(([key]) => ({ category: 'aktivitetAvtaltMedNav' as const, keyActiveOnFilterCategory: key }));
    }
};

export default VisValgtFilter;
