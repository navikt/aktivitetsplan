import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SokeDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== SOKEAVTALE_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <HiddenIfInformasjonsfelt
                key="antallStillinger"
                tittel="Antall søknader i perioden"
                innhold={`${aktivitet.antallStillingerSokes}`}
                hidden={!aktivitet.antallStillingerSokes || aktivitet.antallStillingerSokes < 1}
            />
            <HiddenIfInformasjonsfelt
                key="antallStillingerIUken"
                tittel="Antall søknader i uken"
                innhold={`${aktivitet.antallStillingerIUken}`}
                hidden={!aktivitet.antallStillingerIUken || aktivitet.antallStillingerIUken < 1}
            />
            <HiddenIfInformasjonsfelt
                key="avtaleOppfolging"
                tittel={<FormattedMessage id="aktivitetdetaljer.avtale-oppfolging-label" />}
                beskrivelse
                formattertTekst
                hidden={!aktivitet.avtaleOppfolging}
                innhold={aktivitet.avtaleOppfolging}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default SokeDetaljer;
