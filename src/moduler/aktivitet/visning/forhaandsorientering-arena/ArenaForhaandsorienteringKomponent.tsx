import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    aktivitet: Aktivitet;
    forhaandsorienteringLagtTil: boolean;
}

const ArenaForhaandsorienteringKomponent = ({ aktivitet, forhaandsorienteringLagtTil }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning aktivitet={aktivitet} forhaandsorienteringLagtTil={forhaandsorienteringLagtTil} />
        <DeleLinje />
    </>
);

export default ArenaForhaandsorienteringKomponent;
