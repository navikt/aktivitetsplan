import Tekstomrade from 'nav-frontend-tekstomrade';
import { Normaltekst } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import HiddenIfHOC from '../../../../felles-komponenter/hidden-if/HiddenIf';
import DetaljFelt from './detalj-felt';

export default function Informasjonsfelt({ tittel, innhold, fullbredde, formattertTekst, beskrivelse }) {
    if (innhold === null) {
        return null;
    }

    const Container = formattertTekst ? Tekstomrade : Normaltekst;

    return (
        <DetaljFelt tittel={tittel} fullbredde={fullbredde} beskrivelse={beskrivelse}>
            <Container className="detaljfelt__tekst">{innhold}</Container>
        </DetaljFelt>
    );
}

export const HiddenIfInformasjonsfelt = HiddenIfHOC(Informasjonsfelt);

Informasjonsfelt.propTypes = {
    tittel: PT.node.isRequired,
    innhold: PT.node,
    fullbredde: PT.bool,
    formattertTekst: PT.bool,
    beskrivelse: PT.bool,
};

Informasjonsfelt.defaultProps = {
    innhold: undefined,
    fullbredde: false,
    formattertTekst: false,
    beskrivelse: false,
};
