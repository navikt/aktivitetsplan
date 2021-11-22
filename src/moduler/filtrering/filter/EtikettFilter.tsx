import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StillingsStatus } from '../../../datatypes/aktivitetTypes';
import { TILSTAND_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { etikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleAktivitetsEtikett } from './filter-reducer';
import { selectAktivitetEtiketterFilter } from './filter-selector';
import FilterVisningsKomponent from './FilterVisning';

type FilterType = {
    [key in StillingsStatus]?: boolean;
};

const EtikettFilter = () => {
    const dispatch = useDispatch();
    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const aktivitetEtiketterFilter = useSelector(selectAktivitetEtiketterFilter);

    const doToggleAktivitetsEtikett = (aktivitetsType: string) => {
        dispatch(toggleAktivitetsEtikett(aktivitetsType));
    };

    const aktivitetEtiketter: any = aktiviteter.reduce((etiketter: any, aktivitet) => {
        const { etikett } = aktivitet;
        if (etikett) {
            etiketter[etikett] = aktivitetEtiketterFilter[etikett]; // eslint-disable-line no-param-reassign
        }
        return etiketter;
    }, {});

    return (
        <FilterVisningsKomponent
            harAktiviteter={Object.keys(aktivitetEtiketter).length >= 1}
            filter={aktivitetEtiketter}
            tekst="Etikett"
            metrikkNavn={TILSTAND_FILTER_METRIKK}
            doToggleFunction={doToggleAktivitetsEtikett}
            textMapper={etikettMapper}
        />
    );
};

export default EtikettFilter;
