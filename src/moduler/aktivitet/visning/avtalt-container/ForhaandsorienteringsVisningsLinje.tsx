import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    aktivitet: Aktivitet;
    erBruker: boolean;
}

const ForhaandsorienteringsVisningsLinje = ({ aktivitet, erBruker }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning
            aktivitet={aktivitet}
            startAapen={erBruker && !aktivitet.forhaandsorientering?.lest}
        />
        <DeleLinje />
    </>
);

export default ForhaandsorienteringsVisningsLinje;
