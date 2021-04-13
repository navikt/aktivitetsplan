import React from 'react';

import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    forhaandsorienteringTekst?: string;
    forhaandsorienteringLest?: string;
}

const ArenaForhaandsorienteringKomponent = ({ forhaandsorienteringTekst, forhaandsorienteringLest }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorienteringsvisning
            forhaandsorienteringTekst={forhaandsorienteringTekst}
            forhaandsorienteringLest={forhaandsorienteringLest}
            hidden={!forhaandsorienteringTekst}
        />
        <DeleLinje />
    </>
);

export default ArenaForhaandsorienteringKomponent;
