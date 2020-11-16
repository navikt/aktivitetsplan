import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SAMTALEREFERAT_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { HiddenIf, formaterDatoKortManed } from '../../../../utils';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

const SamtalereferatDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== SAMTALEREFERAT_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <Informasjonsfelt
                key="dato"
                tittel={<FormattedMessage id="aktivitetdetaljer.dato" />}
                innhold={formaterDatoKortManed(aktivitet.fraDato)}
            />
            <Informasjonsfelt
                key="kanal"
                tittel={<FormattedMessage id="aktivitetdetaljer.kanal" />}
                innhold={aktivitet.kanal && <FormattedMessage id={`kanal.${aktivitet.kanal}`.toLowerCase()} />}
            />
        </div>
    </HiddenIf>
);

SamtalereferatDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default SamtalereferatDetaljer;
