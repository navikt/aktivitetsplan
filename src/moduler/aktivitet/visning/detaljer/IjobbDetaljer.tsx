import React from 'react';

import { IJOBB_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { jobbStatusTypeMap } from '../../../../utils/textMappers';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

interface Props {
    aktivitet: AlleAktiviteter;
}

const IJobbDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== IJOBB_AKTIVITET_TYPE) {
        return null;
    }

    return (
        <>
            <FraDato aktivitet={aktivitet} />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Informasjonsfelt
                key="jobbstatus"
                tittel="Stillingsandel"
                innhold={jobbStatusTypeMap[aktivitet.jobbStatus]}
            />
            <Informasjonsfelt key="ansettelsesforhold" tittel="Arbeidsgiver" innhold={aktivitet.ansettelsesforhold} />
            <Informasjonsfelt key="arbeidstid" tittel="Ansettelsesforhold" innhold={aktivitet.arbeidstid} />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default IJobbDetaljer;
