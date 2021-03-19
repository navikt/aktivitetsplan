import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';

interface Props {
    aktivitet: Aktivitet;
}

const ForhaandsorienteringBrukerVisning = (props: Props) => {
    const { aktivitet } = props;
    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;

    return (
        <>
            <DeleLinje />
            <Forhaandsorenteringsvisning
                forhaandsorienteringTekst={forhaandsorienteringTekst}
                hidden={!forhaandsorienteringTekst}
            />
            <DeleLinje />
        </>
    );
};

export default ForhaandsorienteringBrukerVisning;
