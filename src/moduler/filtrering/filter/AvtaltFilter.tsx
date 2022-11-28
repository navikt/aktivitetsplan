import React from 'react';
import { useSelector } from 'react-redux';

import { AVTALT_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { avtaltMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisningsKomponent from './FilterVisning';

function AvtaltmedNavFilter() {
    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const harAvtaltAktivitet =
        aktiviteter.filter((aktivitet) => aktivitet.avtalt).length > 0 &&
        aktiviteter.filter((aktivitet) => !aktivitet.avtalt).length > 0;
    const filters = harAvtaltAktivitet ? ['avtaltMedNav', 'ikkeAvtaltMedNav'] : [];
    return (
        <FilterVisningsKomponent
            filterKategori={'avtalt'}
            filters={filters}
            tekst="Avtalt aktivitet"
            metrikkNavn={AVTALT_FILER_METRIKK}
            textMapper={avtaltMapper}
        />
    );
}

export default AvtaltmedNavFilter;
