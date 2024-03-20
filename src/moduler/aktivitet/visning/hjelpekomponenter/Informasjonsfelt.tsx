import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import HiddenIfHOC from '../../../../felles-komponenter/hidden-if/hidden-if';
import CustomBodyLong from './CustomBodyLong';
import DetaljFelt from './DetaljFelt';

interface Props {
    tittel: React.ReactNode;
    innhold?: React.ReactNode;
    fullbredde?: boolean;
    formattertTekst?: boolean;
    beskrivelse?: boolean;
}

interface ChildProps {
    children: React.ReactNode;
    formattertTekst?: boolean;
}

const InnholdsWrapper = (props: ChildProps) => {
    const { children, formattertTekst } = props;
    if (formattertTekst) {
        return (
            <CustomBodyLong formatLinks formatLinebreaks>
                {children}
            </CustomBodyLong>
        );
    } else if (typeof children !== 'string') {
        return children as JSX.Element;
    } else {
        return <BodyShort>{children}</BodyShort>;
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
