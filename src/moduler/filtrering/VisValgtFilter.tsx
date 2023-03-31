import { Chips, Label } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import {
    aktivitetStatusMap,
    aktivitetTypeMap,
    avtaltMapper,
    stillingOgStillingFraNavEtikettMapper,
    tiltakOgEksternAktivitetEtikettMapper,
} from '../../utils/textMappers';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    toggleArenaAktivitetsEtikett,
} from './filter/filter-reducer';
import { selectFilterSlice } from './filter/filter-selector';
import {
    AktivitetFilterType,
    ArenaEtikettFilterType,
    AvtaltFilterType,
    EtikettFilterType,
    StatusFilterType,
} from './filter/FilterVisning';
import FiltreringLabel from './filteringslabel/FiltreringLabel';

const VisValgtFilter = () => {
    const filterSlice = useSelector(selectFilterSlice);

    const dispatch = useReduxDispatch();

    const doToggleAktivitetsEtikett = (aktivitetsEtikett: string) =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett));
    const doToggleArenaAktivitetsEtikett = (aktivitetsEtikett: string) =>
        dispatch(toggleArenaAktivitetsEtikett(aktivitetsEtikett));
    const doToggleAktivitetsStatus = (aktivitetsStatus: string) => dispatch(toggleAktivitetsStatus(aktivitetsStatus));
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
            case 'aktivitetStatus':
                return {
                    tekst: aktivitetStatusMap[filterVerdi as keyof StatusFilterType],
                    func: doToggleAktivitetsStatus,
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
                    }
                )}
            </Chips>
        </div>
    ) : null;
};

export default VisValgtFilter;
