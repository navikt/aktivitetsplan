import React from 'react';

import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import DetaljvisningLenke from '../hjelpekomponenter/DetaljvisningLenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const EgenAktivitetDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== EGEN_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <Informasjonsfelt key="hensikt" fullbredde tittel="Mål med aktiviteten" innhold={aktivitet.hensikt} />
            <Informasjonsfelt key="oppfolging" fullbredde tittel="Min huskeliste" innhold={aktivitet.oppfolging} />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </>
    );
};

export default EgenAktivitetDetaljer;
