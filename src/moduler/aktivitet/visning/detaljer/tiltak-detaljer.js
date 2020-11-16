import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TILTAK_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { HiddenIf } from '../../../../utils';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const TiltakDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== TILTAK_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <FraDato aktivitet={aktivitet} visIkkeSatt />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Informasjonsfelt
                key="arrangoer"
                tittel={<FormattedMessage id="aktivitetdetaljer.aarrangor-label" />}
                innhold={aktivitet.arrangoer}
            />
            <Informasjonsfelt
                key="deltakelsesprosent"
                tittel={<FormattedMessage id="aktivitetdetaljer.deltakelsesprosent-label" />}
                innhold={aktivitet.deltakelseProsent && `${aktivitet.deltakelseProsent}%`}
            />
            <Informasjonsfelt
                key="dagerPerUke"
                tittel={<FormattedMessage id="aktivitetdetaljer.antall-dager-per-uke-label" />}
                innhold={aktivitet.antallDagerPerUke && `${aktivitet.antallDagerPerUke}`}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </div>
    </HiddenIf>
);

TiltakDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default TiltakDetaljer;
