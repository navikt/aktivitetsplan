import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AlleAktiviteter, ArenaEtikett, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { TILSTAND_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { etikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleArenaAktivitetsEtikett } from './filter-reducer';
import { selectAktivitetEtiketterFilter } from './filter-selector';
import FilterVisningsKomponent from './FilterVisning';

type FilterType = {
    [key in ArenaEtikett]?: boolean;
};

const ArenaEtikettFilter = () => {
    const dispatch = useDispatch();
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const aktivitetEtiketterFilter = useSelector(selectAktivitetEtiketterFilter);

    const doToggleAktivitetsEtikett = (aktivitetsType: string) => {
        dispatch(toggleArenaAktivitetsEtikett(aktivitetsType));
    };

    const aktivitetEtiketter = aktiviteter.filter(isArenaAktivitet).reduce((etiketter: FilterType, aktivitet) => {
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
            tekst="Tiltak status"
            metrikkNavn={TILSTAND_FILTER_METRIKK}
            doToggleFunction={doToggleAktivitetsEtikett}
            textMapper={etikettMapper}
        />
    );
};

export default ArenaEtikettFilter;
