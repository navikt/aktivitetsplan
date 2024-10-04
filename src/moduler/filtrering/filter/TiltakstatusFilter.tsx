import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { ArenaAktivitet, ArenaEtikett } from '../../../datatypes/arenaAktivitetTypes';
import { EksternAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { ARENA_ETIKETT_FILTER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { tiltakOgEksternAktivitetEtikettMapper } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisningsKomponent, { ArenaEtikettFilterType, FilterValueExtractor } from './FilterVisning';

const isEksternAktivitet = (aktivitet: AlleAktiviteter): aktivitet is EksternAktivitet => {
    return aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
};

export const getEksternFilterableFields: FilterValueExtractor<EksternAktivitet, string> = (
    aktivitet: EksternAktivitet,
) => {
    return aktivitet.eksternAktivitet?.etiketter?.map((etikett) => etikett.kode) || [];
};
export const getArenaFilterableFields: FilterValueExtractor<ArenaAktivitet, keyof ArenaEtikettFilterType> = (
    aktivitet: ArenaAktivitet,
) => {
    return [aktivitet.etikett].filter((it) => !!it) as ArenaEtikett[];
};

const hentMuligeIkkeDefaultEtiketter = (aktiviteter: EksternAktivitet[]) => {
    return aktiviteter
        .flatMap((it) => it.eksternAktivitet.etiketter)
        .filter((it) => !!it)
        .reduce((allEtikettMappings, nextEtikett) => {
            if (!nextEtikett?.tekst) return allEtikettMappings;
            return {
                [nextEtikett.kode]: nextEtikett.tekst,
                ...allEtikettMappings,
            };
        }, {});
};

const TiltakstatusFilter = () => {
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const eksternAktiviteter = aktiviteter.filter(isEksternAktivitet);
    const eksternFields = eksternAktiviteter.flatMap(getEksternFilterableFields);
    const arenaFields = aktiviteter.filter(isArenaAktivitet).flatMap(getArenaFilterableFields);
    const alleEtiketter = new Set([...eksternFields, ...arenaFields]);

    const utlededeLabels = hentMuligeIkkeDefaultEtiketter(eksternAktiviteter);
    const textMapper = {
        ...utlededeLabels,
        ...tiltakOgEksternAktivitetEtikettMapper,
    };

    return (
        <FilterVisningsKomponent
            filters={Array.from(alleEtiketter)}
            filterKategori={'tiltakstatus'}
            tekst="Tiltaksstatus"
            metrikkNavn={ARENA_ETIKETT_FILTER_METRIKK}
            textMapper={textMapper}
        />
    );
};

export default TiltakstatusFilter;
