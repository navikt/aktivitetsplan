import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import Detaljer from '../eksternaktivitet/Detaljer';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

type Props = {
    aktivitet: AlleAktiviteter;
};

const EksternAktivitetDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} visIkkeSatt />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Detaljer detaljer={aktivitet.eksternAktivitet.detaljer} />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default EksternAktivitetDetaljer;
