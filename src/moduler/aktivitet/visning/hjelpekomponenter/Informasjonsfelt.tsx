import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import HiddenIfHOC from '../../../../felles-komponenter/hidden-if/hidden-if';
import CustomBodyLong from './CustomBodyLong';
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

const InnholdsWrapper = (props: ChildProps) => {
    const { children, formattertTekst } = props;
    if (formattertTekst) {
        return (
            <CustomBodyLong className="detaljfelt__tekst" formatLinks formatLinebreaks>
                {children}
            </CustomBodyLong>
        );
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
            <InnholdsWrapper formattertTekst={formattertTekst}>{innhold}</InnholdsWrapper>
        </DetaljFelt>
    );
};

export default Informasjonsfelt;
export const HiddenIfInformasjonsfelt = HiddenIfHOC(Informasjonsfelt);
