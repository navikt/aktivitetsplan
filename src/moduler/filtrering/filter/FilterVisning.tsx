import { Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { Store } from 'redux';

import { AktivitetStatus, StillingFraNavSoknadsstatus, StillingStatus } from '../../../datatypes/aktivitetTypes';
import { ArenaEtikett } from '../../../datatypes/arenaAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { AlleAktivitetTyper, avtaltMapper } from '../../../utils/textMappers';
import {
    selectAktivitetAvtaltMedNavFilter,
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectArenaAktivitetEtiketterFilter,
} from './filter-selector';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsType,
    toggleArenaAktivitetsEtikett,
} from './filter-slice';
import FilterCheckbox from './FilterCheckbox';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

export type AvtaltFilterType = Record<keyof typeof avtaltMapper, boolean>;

export type StatusFilterType = Record<AktivitetStatus, boolean>;

export type AktivitetFilterType = Record<AlleAktivitetTyper, boolean>;

export type ArenaEtikettFilterType = Record<ArenaEtikett, boolean>;

export type EtikettFilterType = Record<StillingStatus | StillingFraNavSoknadsstatus, boolean>;

export type FilterKategori = 'avtalt' | 'aktivitet' | 'etikett' | 'tiltakstatus';
export type FilterValueExtractor<AktivitetType, FilterValueType> = (aktvitet: AktivitetType) => FilterValueType[];
export type Filter = AvtaltFilterType | AktivitetFilterType | EtikettFilterType | ArenaEtikettFilterType;

interface FilterVisningTypes {
    filterKategori: FilterKategori;
    tekst: string;
    metrikkNavn: string;
    className?: string;
    textMapper: any;
    filters: string[];
}

const selectorMap: Record<FilterKategori, (store: RootState) => Filter> = {
    avtalt: selectAktivitetAvtaltMedNavFilter,
    aktivitet: selectAktivitetTyperFilter,
    tiltakstatus: selectArenaAktivitetEtiketterFilter,
    etikett: selectAktivitetEtiketterFilter,
};
const togglerMap: Record<FilterKategori, ActionCreatorWithPayload<any>> = {
    avtalt: toggleAktivitetAvtaltMedNav,
    aktivitet: toggleAktivitetsType,
    tiltakstatus: toggleArenaAktivitetsEtikett,
    etikett: toggleAktivitetsEtikett,
};

const useFilterType = (
    filterKategori: FilterKategori,
): { filterState: Filter; toggle: (filterKey: string) => void } => {
    // get selector for filterKategori
    const filterState = useSelector(selectorMap[filterKategori]);
    // get dispatcher for filterKategori
    const dispatch = useAppDispatch();
    const toggleForKategori = togglerMap[filterKategori];
    const toggle = (filterKode: string) => dispatch(toggleForKategori(filterKode));
    return {
        filterState,
        toggle,
    };
};

//TODO: Refaktorer. Denne er bare konvertert til ts i forsøk på å gjøre det mulig å forstå hvordan den fungerer.
// Filter er ikke bare et objekt hvor den boolske verdien bestemmer om filteret er påskrudd eller ikke,
// det sier også noe om selve filtercheckboksen skal vises eller ikke(ved at noen av Filter propertiene kan mangle fra objektet).
function FilterVisning(props: FilterVisningTypes) {
    const { tekst, metrikkNavn, className, textMapper, filterKategori, filters } = props;
    const { toggle, filterState } = useFilterType(filterKategori);
    const harAktiviteter = (filters || []).length > 0;

    const checkboxes = (filters || []).map((nokkel: string, i: number) => (
        <FilterCheckbox
            key={i}
            filterTekst={textMapper[nokkel]}
            filter={filterState}
            nokkel={nokkel as keyof Filter}
            metrikkNavn={metrikkNavn}
            doToggle={toggle}
        />
    ));

    return (
        <VisibleIfDiv visible={harAktiviteter} className={classNames(className, 'filter')}>
            <form>
                <Heading level="2" size="small" className="filter__tittel">
                    {tekst}
                </Heading>
                {checkboxes}
            </form>
        </VisibleIfDiv>
    );
}

export default FilterVisning;
