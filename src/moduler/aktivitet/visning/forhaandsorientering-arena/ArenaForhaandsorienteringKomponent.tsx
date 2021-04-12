import React from 'react';

import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';

interface Props {
    forhaandsorienteringTekst?: string;
    forhaandsorienteringLest?: string;
}

const ArenaForhaandsorienteringKomponent = ({ forhaandsorienteringTekst, forhaandsorienteringLest }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorenteringsvisning
            forhaandsorienteringTekst={forhaandsorienteringTekst}
            forhaandsorienteringLest={forhaandsorienteringLest}
            hidden={!forhaandsorienteringTekst}
        />
        <DeleLinje />
    </>
);

export default ArenaForhaandsorienteringKomponent;
