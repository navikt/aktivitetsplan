import classNames from 'classnames';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import FilterCheckbox from './FilterCheckbox';

type FilterType = { [key: string]: boolean | undefined };

interface AvtaltFilterType extends FilterType {
    avtaltMedNav: boolean;
    ikkeAvtaltMedNav: boolean;
}

interface StatusFilterType extends FilterType {
    BRUKER_ER_INTERESSERT: boolean;
    FULLFORT: boolean;
    GJENNOMFORES: boolean;
    PLANLAGT: boolean;
}

interface AktiviteFilterType extends FilterType {
    EGEN: boolean;
    MOTE: boolean;
    SOKEAVTALE: boolean;
    STILLING: boolean;
}

export interface EtikettType extends FilterType {
    SOKNAD_SENDT: boolean;
    INNKALT_TIL_INTERVJU: boolean;
    JOBBTILBUD: boolean;
    AVSLAG: boolean;
}

export type Filter = AvtaltFilterType | StatusFilterType | AktiviteFilterType | EtikettType;

interface FilterVisningTypes {
    harAktiviteter: boolean;
    filter: Filter;
    filterTittel: string;
    filterTekst: string;
    metrikkNavn: string;
    doToggleFunction: (key: string) => void;
    className?: string;
}

//TODO: Refaktorer. Filter er ikke bare et objekt hvor den boolske verdien bestemmer om filteret er påskrudd eller ikke, det sier også noe om selve filtercheckboksen skal vises eller ikke(ved FilterTypet noen FilterTypev propertiene kan mangle fra objektet).
const FilterVisning = (props: FilterVisningTypes) => {
    const { harAktiviteter, filter, filterTittel, filterTekst, metrikkNavn, doToggleFunction, className } = props;

    const checkboxes = Object.keys(filter).map((nokkel, i) => (
        <FilterCheckbox
            key={i}
            filterTekst={filterTekst}
            filter={filter}
            nokkel={nokkel}
            metrikkNavn={metrikkNavn}
            doToggle={doToggleFunction}
        />
    ));

    return (
        <VisibleIfDiv visible={harAktiviteter} className={classNames(className, 'filter')}>
            <SkjemaGruppe>
                <Undertittel className="filter__tittel">{filterTittel}</Undertittel>
                {checkboxes}
            </SkjemaGruppe>
        </VisibleIfDiv>
    );
};

export default FilterVisning;
