import React from 'react';

import { KontaktInfo } from '../../../../datatypes/aktivitetTypes';
import DetaljFelt from '../hjelpekomponenter/detalj-felt';
import { InholdsWrapper } from '../hjelpekomponenter/Informasjonsfelt';

type Props = {
    kontaktInfo: KontaktInfo;
};

export const KontaktInfoDetaljer = ({ kontaktInfo }: Props) => {
    if (!kontaktInfo) return null;
    return (
        <>
            <DetaljFelt tittel="Kontaktinfo" fullbredde={true} beskrivelse={true}>
                <InholdsWrapper formattertTekst={true}>{kontaktInfo.navn}</InholdsWrapper>
                <InholdsWrapper formattertTekst={true}>{kontaktInfo.tittel}</InholdsWrapper>
                <InholdsWrapper formattertTekst={true}>{kontaktInfo.mobil}</InholdsWrapper>
                <InholdsWrapper formattertTekst={true}>{kontaktInfo.epost}</InholdsWrapper>
            </DetaljFelt>
        </>
    );
};
