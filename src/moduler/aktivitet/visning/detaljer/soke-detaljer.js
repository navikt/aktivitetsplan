import { FormattedMessage } from 'react-intl';
import React from 'react';
import { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import { HiddenIf } from '../../../../utils';
import * as AppPT from '../../../../proptypes';
import {
    Beskrivelse,
    FraDato,
    TilDato,
} from '../hjelpekomponenter/standard-felt';

const SokeDetaljer = ({ aktivitet }) =>
    <HiddenIf hidden={aktivitet.type !== SOKEAVTALE_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} />
            <HiddenIfInformasjonsfelt
                key="antallStillinger"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.antall-label" />
                }
                innhold={`${aktivitet.antallStillingerSokes}`}
                hidden={aktivitet.antallStillingerSokes < 1}
            />
            <HiddenIfInformasjonsfelt
                key="avtaleOppfolging"
                tittel={
                    <FormattedMessage id="aktivitetdetaljer.avtale-oppfolging-label" />
                }
                beskrivelse
                formattertTekst
                hiden={!aktivitet.avtaleOppfolging}
                innhold={aktivitet.avtaleOppfolging}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </div>
    </HiddenIf>;

SokeDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default SokeDetaljer;
