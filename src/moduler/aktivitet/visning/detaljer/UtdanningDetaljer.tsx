import React from 'react';

import { UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const UtdanningDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== UTDANNING_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} visIkkeSatt />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default UtdanningDetaljer;
