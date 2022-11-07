import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import Detaljer from '../eksternaktivitet/Detaljer';
import OppgaveBoks from '../eksternaktivitet/OppgaveBoks';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';
import styles from './AktivitetDetaljer.module.less';

type Props = {
    aktivitet: AlleAktiviteter;
};

const EksternAktivitetDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <div className={styles.detaljer}>
                <OppgaveBoks oppgave={aktivitet.eksternAktivitetData.oppgave} />
                <FraDato aktivitet={aktivitet} />
                <TilDato aktivitet={aktivitet} />
                <Detaljer detaljer={aktivitet.eksternAktivitetData.detaljer} />
                <Beskrivelse aktivitet={aktivitet} />
            </div>
        </>
    );
};

export default EksternAktivitetDetaljer;
