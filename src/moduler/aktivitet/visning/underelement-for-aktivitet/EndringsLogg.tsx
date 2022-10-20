import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';

interface Props {
    hidden?: boolean;
    aktivitet: VeilarbAktivitet;
}

export default function EndringsLogg(props: Props) {
    const { aktivitet } = props;

    return (
        <EkspanderbarLinje tittel="Historikk" kanToogle aapneTekst="Åpne" lukkeTekst="Lukk">
            <VersjonerForAktivitet
                visible={true}
                aktivitet={aktivitet}
                className="underelementer-aktivitet__historikkvisning"
            />
        </EkspanderbarLinje>
    );
}
