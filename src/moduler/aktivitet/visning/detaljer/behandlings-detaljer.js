import React from 'react';
import { FormattedMessage } from 'react-intl';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { HiddenIf } from '../../../../utils';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const BehandlingsDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={BEHANDLING_AKTIVITET_TYPE !== aktivitet.type}>
        <div className="aktivitetvisning__detaljer">
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
            />
            <Informasjonsfelt
                key="behandlingOppfolging"
                tittel={<FormattedMessage id="aktivitetdetaljer.behandling-oppfolging-label" />}
                innhold={aktivitet.behandlingOppfolging}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </div>
    </HiddenIf>
);

BehandlingsDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default BehandlingsDetaljer;
