import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { AKTIVITESTYPE_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { aktivitetTypeMap } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisningsKomponent, { AktivitetFilterType, FilterValueExtractor } from './FilterVisning';

export const getType = (aktivitet: AlleAktiviteter) => {
    if (aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        return aktivitet.eksternAktivitet.type;
    }
    return aktivitet.type;
};
export const getTypeFilterValue: FilterValueExtractor<AlleAktiviteter, keyof AktivitetFilterType> = (aktivitet) => {
    return [getType(aktivitet)];
};

function AktivitetTypeFilter() {
    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const filters = Array.from(new Set(aktiviteter.flatMap(getTypeFilterValue)));
    return (
        <FilterVisningsKomponent
            filterKategori={'aktivitet'}
            filters={filters}
            tekst="Aktivitetstype"
            metrikkNavn={AKTIVITESTYPE_FILER_METRIKK}
            textMapper={aktivitetTypeMap}
        />
    );
}

export default AktivitetTypeFilter;
