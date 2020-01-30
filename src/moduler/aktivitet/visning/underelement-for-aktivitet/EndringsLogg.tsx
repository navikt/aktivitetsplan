import React from 'react';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';
import { Aktivitet } from '../../../../types';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/ekspanderbar-linje';

interface Props {
    hidden?: boolean;
    aktivitet: Aktivitet;
}

export default function EndringsLogg(props: Props) {
    const { aktivitet, hidden } = props;

    // @ts-ignore
    if (hidden || aktivitet.arenaAktivitet) {
        return null;
    }

    return (
        <EkspanderbarLinje tittel="Historikk" kanToogle aapneTekst="Vis" lukkeTekst="Skjul">
            <VersjonerForAktivitet
                visible={true}
                aktivitet={aktivitet}
                className="underelementer-aktivitet__historikkvisning"
            />
        </EkspanderbarLinje>
    );
}
