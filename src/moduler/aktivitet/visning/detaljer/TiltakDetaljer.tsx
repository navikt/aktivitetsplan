import React from 'react';

import { TILTAK_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const TiltakDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== TILTAK_AKTIVITET_TYPE) {
        return null;
    }
    return (
        <>
            <FraDato aktivitet={aktivitet} visIkkeSatt />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Informasjonsfelt key="arrangoer" tittel="Arrangør" innhold={aktivitet.arrangoer} />
            <Informasjonsfelt
                key="deltakelsesprosent"
                tittel="Deltakelse"
                innhold={!!aktivitet.deltakelseProsent && `${aktivitet.deltakelseProsent}%`}
            />
            <Informasjonsfelt
                key="dagerPerUke"
                tittel="Antall dager per uke"
                innhold={!!aktivitet.antallDagerPerUke && `${aktivitet.antallDagerPerUke}`}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default TiltakDetaljer;
