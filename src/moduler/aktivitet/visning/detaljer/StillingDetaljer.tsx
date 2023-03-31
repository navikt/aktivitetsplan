import React from 'react';

import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import DetaljvisningLenke from '../hjelpekomponenter/DetaljvisningLenke';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const StillingDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== STILLING_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} />
            <TilDato tittel="Frist" aktivitet={aktivitet} visIkkeSatt />
            <Informasjonsfelt key="arbeidsgiver" tittel="Arbeidsgiver" innhold={aktivitet.arbeidsgiver} />
            <Informasjonsfelt key="kontaktperson" tittel="Kontaktperson" innhold={aktivitet.kontaktperson} />
            <Informasjonsfelt key="arbeidssted" tittel="Arbeidssted" innhold={aktivitet.arbeidssted} />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </>
    );
};

export default StillingDetaljer;
