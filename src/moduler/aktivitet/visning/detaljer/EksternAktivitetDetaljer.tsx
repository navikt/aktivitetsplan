import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import Detaljer from '../eksternaktivitet/Detaljer';
import OppgaveBoks from '../eksternaktivitet/OppgaveBoks';
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
            <OppgaveBoks oppgave={aktivitet.eksternAktivitet.oppgave} />
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <Detaljer detaljer={aktivitet.eksternAktivitet.detaljer} />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default EksternAktivitetDetaljer;
