import classNames from 'classnames';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import loggEvent from '../../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';

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

interface FilterVisningTypes {
    harAktiviteter: boolean;
    filter: AvtaltFilterType | StatusFilterType | AktiviteFilterType | EtikettType;
    filterTittel: string;
    filterTekst: string;
    metrikkNavn: string;
    doToggleFunction: (key: string) => void;
    className?: string;
}

//TODO: Refaktorer. Filter er ikke bare et objekt hvor den boolske verdien bestemmer om filteret er påskrudd eller ikke, det sier også noe om selve filtercheckboksen skal vises eller ikke(ved FilterTypet noen FilterTypev propertiene kan mangle fra objektet).
function FilterVisning(props: FilterVisningTypes) {
    const { harAktiviteter, filter, filterTittel, filterTekst, metrikkNavn, doToggleFunction, className } = props;
    return (
        <VisibleIfDiv visible={harAktiviteter} className={classNames(className, 'filter')}>
            <SkjemaGruppe>
                <Undertittel className="filter__tittel">{filterTittel}</Undertittel>
                {Object.keys(filter).map((nokkel) => {
                    return (
                        <Checkbox
                            label={<FormattedMessage id={filterTekst + nokkel.toLowerCase()} />}
                            onChange={() => {
                                if (!filter[nokkel] && metrikkNavn) {
                                    loggEvent(metrikkNavn, { filter: nokkel });
                                }
                                doToggleFunction(nokkel);
                            }}
                            checked={filter[nokkel]}
                        />
                    );
                })}
            </SkjemaGruppe>
        </VisibleIfDiv>
    );
}

export default FilterVisning;
