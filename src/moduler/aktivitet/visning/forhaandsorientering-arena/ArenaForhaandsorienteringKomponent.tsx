import React from 'react';

import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';

interface Props {
    forhaandsorienteringTekst?: string;
}

const ArenaForhaandsorienteringKomponent = ({ forhaandsorienteringTekst }: Props) => (
    <>
        <DeleLinje />
        <Forhaandsorenteringsvisning
            forhaandsorienteringTekst={forhaandsorienteringTekst}
            hidden={!forhaandsorienteringTekst}
        />
        <DeleLinje />
    </>
);

export default ArenaForhaandsorienteringKomponent;
