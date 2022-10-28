import React from 'react';

import { Detalj } from '../../../../datatypes/eksternAktivitetTypes';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';

interface Props {
    detaljer?: Detalj[];
}

const Detaljer = ({ detaljer }: Props) => {
    if (!detaljer) return null;

    return (
        <>
            {detaljer.map((detalj) => (
                <Informasjonsfelt key={'EKSTERN-' + detalj.label} tittel={detalj.label} innhold={detalj.verdi} />
            ))}
        </>
    );
};

export default Detaljer;
