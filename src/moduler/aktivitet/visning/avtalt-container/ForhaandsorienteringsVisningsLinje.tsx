import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import { skalMarkereForhaandsorienteringSomLest } from './utilsForhaandsorientering';

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
            startAapen={skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet)}
            erArenaAktivitet={erArenaAktivitet}
        />
        <DeleLinje />
    </>
);

export default ForhaandsorienteringsVisningsLinje;
