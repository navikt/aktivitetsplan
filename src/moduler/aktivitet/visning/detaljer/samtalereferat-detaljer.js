import { FormattedMessage } from 'react-intl';
import React from 'react';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { formaterDatoKortManed, HiddenIf } from '../../../../utils';
import * as AppPT from '../../../../proptypes';
import { SAMTALEREFERAT_TYPE } from '../../../../constant';

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
