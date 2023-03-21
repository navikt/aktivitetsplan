import React from 'react';
import { FormattedMessage } from 'react-intl';

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
            <FraDato aktivitet={aktivitet} tittel={<FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.egen" />} />
            <TilDato aktivitet={aktivitet} tittel={<FormattedMessage id="aktivitetdetaljer.til-dato-tekst.egen" />} />
            <Informasjonsfelt
                key="hensikt"
                fullbredde
                tittel={<FormattedMessage id="aktivitetdetaljer.hensikt-label" />}
                innhold={aktivitet.hensikt}
            />
            <Informasjonsfelt
                key="oppfolging"
                fullbredde
                tittel={<FormattedMessage id="aktivitetdetaljer.oppfolging-label" />}
                innhold={aktivitet.oppfolging}
            />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </>
    );
};

export default EgenAktivitetDetaljer;
