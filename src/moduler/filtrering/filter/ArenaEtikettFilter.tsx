import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { ArenaAktivitet } from '../../../datatypes/arenaAktivitetTypes';
import { EksternAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { ARENA_ETIKETT_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { eksternAktivitetFilterTextMappings, tiltakEtikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisningsKomponent, { ArenaEtikettFilterType, FilterValueExtractor } from './FilterVisning';

const isEksternAktivitet = (aktivitet: AlleAktiviteter): aktivitet is EksternAktivitet => {
    return aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
};

export const getEksternFilterableFields: FilterValueExtractor<EksternAktivitet, string> = (
    aktivitet: EksternAktivitet
) => {
    return aktivitet.eksternAktivitet?.etiketter?.map((etikett) => etikett.kode) || [];
};
export const getArenaFilterableFields: FilterValueExtractor<ArenaAktivitet, keyof ArenaEtikettFilterType> = (
    aktivitet: ArenaAktivitet
) => {
    return [aktivitet.etikett].filter((it) => !!it);
};

const ArenaEtikettFilter = () => {
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const eksternFields = aktiviteter.filter(isEksternAktivitet).flatMap(getEksternFilterableFields);
    const arenaFields = aktiviteter.filter(isArenaAktivitet).flatMap(getArenaFilterableFields);
    const alleEtiketter = new Set([...eksternFields, ...arenaFields]);

    const textMappers = {
        ...tiltakEtikettMapper,
        ...eksternAktivitetFilterTextMappings,
    };

    return (
        <FilterVisningsKomponent
            filters={Array.from(alleEtiketter)}
            filterKategori={'arenaEtikett'}
            tekst="Tiltaksstatus"
            metrikkNavn={ARENA_ETIKETT_FILTER_METRIKK}
            textMapper={textMappers}
        />
    );
};

export default ArenaEtikettFilter;
