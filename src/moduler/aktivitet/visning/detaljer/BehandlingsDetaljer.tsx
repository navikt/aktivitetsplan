import React from 'react';
import { FormattedMessage } from 'react-intl';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const BehandlingsDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== BEHANDLING_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <Informasjonsfelt
                key="behandlingtype"
                tittel={<FormattedMessage id="aktivitetdetaljer.behandling-type-label" />}
                innhold={aktivitet.behandlingType}
            />
            <Informasjonsfelt
                key="behandlingsted"
                tittel={<FormattedMessage id="aktivitetdetaljer.behandling-sted-label" />}
                innhold={aktivitet.behandlingSted}
            />
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <Informasjonsfelt
                key="effekt"
                tittel={<FormattedMessage id="aktivitetdetaljer.effekt-label" />}
                innhold={aktivitet.effekt}
                fullbredde
            />
            <Informasjonsfelt
                key="behandlingOppfolging"
                tittel={<FormattedMessage id="aktivitetdetaljer.behandling-oppfolging-label" />}
                innhold={aktivitet.behandlingOppfolging}
                fullbredde
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default BehandlingsDetaljer;
