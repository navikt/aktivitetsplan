import { Checkbox } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import loggEvent from '../../../felles-komponenter/utils/logging';
import { Filter } from './FilterVisning';

interface Props {
    filterTekst: string;
    filter: Filter;
    nokkel: string;
    metrikkNavn: string;
    doToggle(key: string): void;
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
        <Checkbox
            label={<FormattedMessage id={filterTekst + nokkel.toLowerCase()} />}
            onChange={onChange}
            checked={checked}
        />
    );
};

export default FilterCheckbox;
