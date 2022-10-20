import React from 'react';

import { Dialog } from '../../../../datatypes/dialogTypes';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import Informasjonsfelt from '../../../aktivitet/visning/hjelpekomponenter/Informasjonsfelt';

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
    dialog?: Dialog;
}

const AktivitetReferat = (props: Props) => {
    const { referat, erReferatPublisert, historisk } = props.aktivitet;
    const harReferat = !!referat;
    const visReferat = erReferatPublisert && (harReferat || !historisk);

    return (
        <HiddenIfDiv hidden={!visReferat} className="printmodal-body__aktivitetreferat">
            <Informasjonsfelt key="referat" tittel="Samtalereferat" innhold={referat} formattertTekst />
        </HiddenIfDiv>
    );
};

export default AktivitetReferat;
