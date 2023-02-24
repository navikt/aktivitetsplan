import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import { skalMarkereForhaandsorienteringSomLest } from './utilsForhaandsorientering';

interface Props {
    aktivitet: AlleAktiviteter;
    erBruker: boolean;
}

const ForhaandsorienteringsVisningsLinje = ({ aktivitet, erBruker }: Props) => (
    <Forhaandsorienteringsvisning
        aktivitet={aktivitet}
        startAapen={skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet)}
    />
);

export default ForhaandsorienteringsVisningsLinje;
