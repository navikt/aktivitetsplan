import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    aktivitet: Aktivitet;
}

const ForhaandsorienteringBrukerVisning = ({ aktivitet }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning aktivitet={aktivitet} />
        <DeleLinje />
    </>
);

export default ForhaandsorienteringBrukerVisning;
