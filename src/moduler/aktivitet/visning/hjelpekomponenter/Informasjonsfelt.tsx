import Tekstomrade from 'nav-frontend-tekstomrade';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import HiddenIfHOC from '../../../../felles-komponenter/hidden-if/hidden-if';
import DetaljFelt from './detalj-felt';

interface Props {
    tittel: React.ReactNode;
    innhold?: string;
    fullbredde?: boolean;
    formattertTekst?: boolean;
    beskrivelse?: boolean;
}

interface ChildProps {
    children: string;
    formattertTekst?: boolean;
}

export const InholdsWrapper = (props: ChildProps) => {
    const { children, formattertTekst } = props;
    if (formattertTekst) {
        return <Tekstomrade className="detaljfelt__tekst">{children}</Tekstomrade>;
    } else {
        return <Normaltekst className="detaljfelt__tekst">{children}</Normaltekst>;
    }
};

const Informasjonsfelt = (props: Props) => {
    const { tittel, innhold, fullbredde, formattertTekst, beskrivelse } = props;
    if (innhold === null || !innhold) {
        return null;
    }

    return (
        <DetaljFelt tittel={tittel} fullbredde={fullbredde} beskrivelse={beskrivelse}>
            <InholdsWrapper formattertTekst={formattertTekst}>{innhold}</InholdsWrapper>
        </DetaljFelt>
    );
};

export default Informasjonsfelt;
export const HiddenIfInformasjonsfelt = HiddenIfHOC(Informasjonsfelt);
