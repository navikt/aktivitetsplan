import { FormattedMessage } from 'react-intl';
import React from 'react';
import { IJOBB_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { HiddenIf } from '../../../../utils';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const IJobbDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== IJOBB_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
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
        </div>
    </HiddenIf>
);

IJobbDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default IJobbDetaljer;
