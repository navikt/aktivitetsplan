import { Checkbox } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';

import loggEvent from '../../../felles-komponenter/utils/logging';
import { Filter } from './FilterVisning';
import { logValgtFilter } from '../../../analytics/umami';

interface Props {
    filterTekst: string;
    filter: Filter;
    nokkel: keyof Filter;
    metrikkNavn: string;
    doToggle(key: keyof Filter): void;
}

const FilterCheckbox = (props: Props) => {
    const { filterTekst, nokkel, metrikkNavn, filter, doToggle } = props;

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!filter[nokkel]);
    }, [filter, nokkel]);

    const onChange = () => {
        if (!filter[nokkel] && metrikkNavn) {
            loggEvent(metrikkNavn, { filter: nokkel });
        }
        doToggle(nokkel);
    };

    return (
        <Checkbox onChange={onChange} checked={checked} onClick={() => logValgtFilter(filterTekst)}>
            {filterTekst}
        </Checkbox>
    );
};

export default FilterCheckbox;
