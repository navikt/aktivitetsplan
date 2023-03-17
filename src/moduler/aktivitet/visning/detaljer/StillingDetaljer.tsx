import React from 'react';
import { FormattedMessage } from 'react-intl';

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
            <FraDato
                aktivitet={aktivitet}
                tittel={<FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.stilling" />}
            />
            <TilDato
                tittel={<FormattedMessage id="aktivitetdetaljer.til-dato-tekst.stilling" />}
                aktivitet={aktivitet}
                visIkkeSatt
            />
            <Informasjonsfelt
                key="arbeidsgiver"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidsgiver-label" />}
                innhold={aktivitet.arbeidsgiver}
            />
            <Informasjonsfelt
                key="kontaktperson"
                tittel={<FormattedMessage id="aktivitetdetaljer.kontaktperson-label" />}
                innhold={aktivitet.kontaktperson}
            />
            <Informasjonsfelt
                key="arbeidssted"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidssted-label" />}
                innhold={aktivitet.arbeidssted}
            />
            <Beskrivelse aktivitet={aktivitet} />
            <DetaljvisningLenke lenke={aktivitet.lenke} />
        </>
    );
};

export default StillingDetaljer;
