import React from 'react';

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
            <Informasjonsfelt key="behandlingtype" tittel="Type behandling" innhold={aktivitet.behandlingType} />
            <Informasjonsfelt key="behandlingsted" tittel="Behandlingssted" innhold={aktivitet.behandlingSted} />
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <Informasjonsfelt key="effekt" tittel="Mål for behandlingen" innhold={aktivitet.effekt} fullbredde />
            <Informasjonsfelt
                key="behandlingOppfolging"
                tittel="Oppfølging fra Nav"
                innhold={aktivitet.behandlingOppfolging}
                fullbredde
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default BehandlingsDetaljer;
