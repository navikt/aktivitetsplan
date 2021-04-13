import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    sendtAtErAvtaltMedNav: boolean;
    aktivitet: Aktivitet;
}

const SattTilAvtaltVisning = (props: Props) => {
    const { aktivitet, forhaandsorienteringstype, sendtAtErAvtaltMedNav } = props;

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);
    const forhaandsorientering = aktivitet.forhaandsorientering;
    const forhaandsorienteringTekst = forhaandsorientering?.tekst;

    if (!forhaandsorienteringTekst && !sendtAtErAvtaltMedNav) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                forhaandsorienteringstype={forhaandsorienteringstype}
                hidden={!sendtAtErAvtaltMedNav}
            />
            <Forhaandsorienteringsvisning
                forhaandsorientering={forhaandsorientering}
                forhaandsorienteringLagtTil={sendtAtErAvtaltMedNav}
            />
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltVisning;
