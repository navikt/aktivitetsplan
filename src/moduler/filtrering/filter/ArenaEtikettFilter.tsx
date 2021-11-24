import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AlleAktiviteter, ArenaEtikett, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { ARENA_ETIKETT_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { tiltakEtikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import { toggleArenaAktivitetsEtikett } from './filter-reducer';
import { selectArenaAktivitetEtiketterFilter } from './filter-selector';
import FilterVisningsKomponent from './FilterVisning';

type FilterType = {
    [key in ArenaEtikett]?: boolean;
};

const ArenaEtikettFilter = () => {
    const dispatch = useDispatch();
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const aktivitetEtiketterFilter = useSelector(selectArenaAktivitetEtiketterFilter);

    const doToggleArenaAktivitetsEtikett = (aktivitetsType: string) => {
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
            tekst="Tiltaksstatus"
            metrikkNavn={ARENA_ETIKETT_FILTER_METRIKK}
            doToggleFunction={doToggleArenaAktivitetsEtikett}
            textMapper={tiltakEtikettMapper}
        />
    );
};

export default ArenaEtikettFilter;
