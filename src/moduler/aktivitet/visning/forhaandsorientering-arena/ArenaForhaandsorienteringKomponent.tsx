import React from 'react';

import { Forhaandsorientering } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    forhaandsorientering?: Forhaandsorientering;
    forhaandsorienteringLagtTil: boolean;
}

const ArenaForhaandsorienteringKomponent = ({ forhaandsorientering, forhaandsorienteringLagtTil }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning
            forhaandsorientering={forhaandsorientering}
            forhaandsorienteringLagtTil={forhaandsorienteringLagtTil}
        />
        <DeleLinje />
    </>
);

export default ArenaForhaandsorienteringKomponent;
