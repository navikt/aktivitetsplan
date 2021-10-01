import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { KontaktInfo } from '../../../../datatypes/aktivitetTypes';
import DetaljFelt from '../hjelpekomponenter/detalj-felt';

type Props = {
    kontaktInfo: KontaktInfo;
};

export const KontaktInfoDetaljer = ({ kontaktInfo }: Props) => {
    if (!kontaktInfo) return null;
    return (
        <>
            <DetaljFelt tittel="Kontaktinfo" fullbredde={true} beskrivelse={true}>
                <Normaltekst>{kontaktInfo.navn}</Normaltekst>
                <Normaltekst>{kontaktInfo.tittel}</Normaltekst>
                <Normaltekst>{kontaktInfo.mobil}</Normaltekst>
            </DetaljFelt>
        </>
    );
};
