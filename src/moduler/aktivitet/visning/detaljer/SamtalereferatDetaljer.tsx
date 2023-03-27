import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SAMTALEREFERAT_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../../utils/dateUtils';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SamtalereferatDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== SAMTALEREFERAT_TYPE) {
        return null;
    }

    return (
        <>
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
        </>
    );
};

export default SamtalereferatDetaljer;
