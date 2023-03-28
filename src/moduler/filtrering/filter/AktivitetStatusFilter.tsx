import React from 'react';
import { useSelector } from 'react-redux';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { STATUS_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { aktivitetStatusMap } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisning, { FilterValueExtractor, StatusFilterType } from './FilterVisning';

const filtreringsRekkefolge = [
    AktivitetStatus.BRUKER_ER_INTRESSERT,
    AktivitetStatus.PLANLAGT,
    AktivitetStatus.GJENNOMFOERT,
    AktivitetStatus.FULLFOERT,
    AktivitetStatus.AVBRUTT,
];

const getType: FilterValueExtractor<AlleAktiviteter, keyof StatusFilterType> = (aktvitet) => {
    return [aktvitet.status];
};
const getOrder = (filterName: string) => filtreringsRekkefolge.indexOf(filterName as any);

function AktivitetStatusFilter({ className }: { className: string }) {
    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const filters = Array.from(new Set(aktiviteter.flatMap(getType))).sort((a, b) => getOrder(a) - getOrder(b));
    return (
        <FilterVisning
            filters={filters}
            filterKategori={'status'}
            tekst="Status"
            metrikkNavn={STATUS_FILER_METRIKK}
            className={className}
            textMapper={aktivitetStatusMap}
        />
    );
}

AktivitetStatusFilter.defaultProps = {
    className: '',
};

export default AktivitetStatusFilter;
