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
import FiltreringLabel from './filteringslabel/FiltreringLabel';

const VisValgtFilter = () => {
    const filterSlice = useSelector(selectFilterSlice);

    const dispatch = useAppDispatch();

    const doToggleAktivitetsEtikett = (aktivitetsEtikett: string) =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett));
    const doToggleArenaAktivitetsEtikett = (arenaEtikett: string) =>
        dispatch(toggleArenaAktivitetsEtikett(arenaEtikett));
    const doToggleAktivitetsType = (aktivitetsType: string) => dispatch(toggleAktivitetsType(aktivitetsType));
    const doToggleAktivitetAvtaltMedNav = (aktivitetsStatus: string) =>
        dispatch(toggleAktivitetAvtaltMedNav(aktivitetsStatus));

    const setFilterValues = (filterType: string, filterVerdi: string) => {
        switch (filterType) {
            case 'aktivitetTyper':
                return {
                    tekst: aktivitetTypeMap[filterVerdi as keyof AktivitetFilterType],
                    func: doToggleAktivitetsType,
                };
            case 'aktivitetEtiketter':
                return {
                    tekst: stillingOgStillingFraNavEtikettMapper[filterVerdi as keyof EtikettFilterType],
                    func: doToggleAktivitetsEtikett,
                };
            case 'arenaAktivitetEtiketter':
                return {
                    tekst: tiltakOgEksternAktivitetEtikettMapper[filterVerdi as keyof ArenaEtikettFilterType],
                    func: doToggleArenaAktivitetsEtikett,
                };
            case 'aktivitetAvtaltMedNav':
                return {
                    tekst: avtaltMapper[filterVerdi as keyof AvtaltFilterType],
                    func: doToggleAktivitetAvtaltMedNav,
                };
            default:
                return filterType;
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
                {Object.entries(filterSlice as Record<string, Record<string, string> | null>).map(
                    ([filterCategoryKey, activeFiltersMap]) => {
                        if (activeFiltersMap === null) return null;
                        if (filterCategoryKey === 'historiskPeriode') return null;

                        return Object.entries(activeFiltersMap)
                            .filter(([_, isFilterEnabled]) => isFilterEnabled)
                            .map(([activeFilterKey, _]) => {
                                const filterValues = setFilterValues(filterCategoryKey, activeFilterKey);
                                if (typeof filterValues === 'string') return null;
                                return (
                                    <FiltreringLabel
                                        key={activeFilterKey}
                                        label={filterValues.tekst}
                                        slettFilter={() => {
                                            filterValues.func(activeFilterKey);
                                        }}
                                    />
                                );
                            });
                    },
                )}
            </Chips>
        </div>
    ) : null;
};

export default VisValgtFilter;
