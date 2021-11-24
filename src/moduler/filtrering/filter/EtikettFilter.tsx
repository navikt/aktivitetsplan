import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AlleAktiviteter, StillingsStatus, isVeilarbAktivitetAktivitet } from '../../../datatypes/aktivitetTypes';
import { ETIKETT_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { stillingsEtikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleAktivitetsEtikett } from './filter-reducer';
import { selectAktivitetEtiketterFilter } from './filter-selector';
import FilterVisningsKomponent from './FilterVisning';

type FilterType = {
    [key in StillingsStatus]?: boolean;
};

const EtikettFilter = () => {
    const dispatch = useDispatch();
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const aktivitetEtiketterFilter = useSelector(selectAktivitetEtiketterFilter);

    const doToggleAktivitetsEtikett = (aktivitetsType: string) => {
        dispatch(toggleAktivitetsEtikett(aktivitetsType));
    };

    const aktivitetEtiketter = aktiviteter
        .filter(isVeilarbAktivitetAktivitet)
        .reduce((etiketter: FilterType, aktivitet) => {
            const { etikett } = aktivitet;
            if (etikett) {
                etiketter[etikett] = aktivitetEtiketterFilter[etikett];
            }
            return etiketter;
        }, {});

    return (
        <FilterVisningsKomponent
            harAktiviteter={Object.keys(aktivitetEtiketter).length >= 1}
            filter={aktivitetEtiketter}
            tekst="Stillingsstatus"
            metrikkNavn={ETIKETT_FILTER_METRIKK}
            doToggleFunction={doToggleAktivitetsEtikett}
            textMapper={stillingsEtikettMapper}
        />
    );
};

export default EtikettFilter;
