import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    aktivitet: Aktivitet;
    erBruker: boolean;
    erArenaAktivitet: boolean;
}

const ForhaandsorienteringsVisningsLinje = ({ aktivitet, erBruker, erArenaAktivitet }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning
            aktivitet={aktivitet}
            startAapen={erBruker && !aktivitet.forhaandsorientering?.lestDato}
            erArenaAktivitet={erArenaAktivitet}
        />
        <DeleLinje />
    </>
);

export default ForhaandsorienteringsVisningsLinje;
