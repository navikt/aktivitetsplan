import React from 'react';

import { SAMTALEREFERAT_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../../utils/dateUtils';
import { kanalMap } from '../../../../utils/textMappers';
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
            <Informasjonsfelt key="dato" tittel="Dato" innhold={formaterDatoKortManed(aktivitet.fraDato)} />
            <Informasjonsfelt key="kanal" tittel="Møteform" innhold={aktivitet.kanal && kanalMap[aktivitet.kanal]} />
        </>
    );
};

export default SamtalereferatDetaljer;
