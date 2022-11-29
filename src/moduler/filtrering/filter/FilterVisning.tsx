import classNames from 'classnames';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from 'redux';

import { AktivitetType, StillingsStatus } from '../../../datatypes/aktivitetTypes';
import { ArenaEtikett } from '../../../datatypes/arenaAktivitetTypes';
import { EksternAktivitetType } from '../../../datatypes/internAktivitetTypes';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import {
    toggleAktivitetAvtaltMedNav,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    toggleArenaAktivitetsEtikett,
} from './filter-reducer';
import {
    selectAktivitetAvtaltMedNavFilter,
    selectAktivitetEtiketterFilter,
    selectAktivitetStatusFilter,
    selectAktivitetTyperFilter,
    selectArenaAktivitetEtiketterFilter,
} from './filter-selector';
import FilterCheckbox from './FilterCheckbox';

export interface AvtaltFilterType {
    avtaltMedNav: boolean;
    ikkeAvtaltMedNav: boolean;
}

export interface StatusFilterType {
    BRUKER_ER_INTERESSERT: boolean;
    FULLFORT: boolean;
    GJENNOMFORES: boolean;
    PLANLAGT: boolean;
    AVBRUTT: boolean;
}

export type AktivitetFilterType = Record<AktivitetType, boolean> & Record<EksternAktivitetType, boolean>;

export interface ArenaEtikettFilterType {
    AKTUELL: boolean;
    AVSLAG: boolean;
    IKKAKTUELL: boolean;
    IKKEM: boolean;
    INFOMOETE: boolean;
    JATAKK: boolean;
    NEITAKK: boolean;
    TILBUD: boolean;
    VENTELISTE: boolean;
}

export type EtikettFilterType = Record<ArenaEtikett | StillingsStatus, boolean>;

export type FilterKategori = 'avtalt' | 'status' | 'aktivitet' | 'etikett' | 'arenaEtikett';
export type FilterValueExtractor<AktivitetType, FilterValueType> = (aktvitet: AktivitetType) => FilterValueType[];
export type Filter =
    | AvtaltFilterType
    | StatusFilterType
    | AktivitetFilterType
    | EtikettFilterType
    | ArenaEtikettFilterType;

interface FilterVisningTypes {
    filterKategori: FilterKategori;
    tekst: string;
    metrikkNavn: string;
    className?: string;
    textMapper: any;
    filters: string[];
}

const selectorMap: Record<FilterKategori, (store: Store) => Filter> = {
    avtalt: selectAktivitetAvtaltMedNavFilter,
    aktivitet: selectAktivitetTyperFilter,
    arenaEtikett: selectArenaAktivitetEtiketterFilter,
    etikett: selectAktivitetEtiketterFilter,
    status: selectAktivitetStatusFilter,
};
const togglerMap = {
    avtalt: toggleAktivitetAvtaltMedNav,
    aktivitet: toggleAktivitetsType,
    arenaEtikett: toggleArenaAktivitetsEtikett,
    etikett: toggleAktivitetsEtikett,
    status: toggleAktivitetsStatus,
};

const useFilterType = (
    filterKategori: FilterKategori
): { filterState: Filter; toggle: (filterKey: string) => void } => {
    // get selector for filterKategori
    const filterState = useSelector(selectorMap[filterKategori]);
    // get dispatcher for filterKategori
    const dispatch = useDispatch();
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
            <SkjemaGruppe>
                <Undertittel className="filter__tittel">{tekst}</Undertittel>
                {checkboxes}
            </SkjemaGruppe>
        </VisibleIfDiv>
    );
}

export default FilterVisning;
