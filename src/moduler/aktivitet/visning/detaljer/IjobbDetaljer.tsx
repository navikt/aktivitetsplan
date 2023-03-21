import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IJOBB_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const IJobbDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== IJOBB_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Informasjonsfelt
                key="jobbstatus"
                tittel={<FormattedMessage id="aktivitetdetaljer.jobbStatus-label" />}
                innhold={<FormattedMessage id={`aktivitetdetaljer.jobbStatus-${aktivitet.jobbStatus}`} />}
            />
            <Informasjonsfelt
                key="ansettelsesforhold"
                tittel={<FormattedMessage id="aktivitetdetaljer.ansettelsesforhold-label" />}
                innhold={aktivitet.ansettelsesforhold}
            />
            <Informasjonsfelt
                key="arbeidstid"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidstid-label" />}
                innhold={aktivitet.arbeidstid}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default IJobbDetaljer;
