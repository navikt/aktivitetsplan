import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    sendtAtErAvtaltMedNav: boolean;
    aktivitet: Aktivitet;
}

const SattTilAvtaltVisning = (props: Props) => {
    const { aktivitet, forhaandsorienteringstype, sendtAtErAvtaltMedNav } = props;

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);
    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;

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
            <Forhaandsorenteringsvisning
                forhaandsorienteringTekst={forhaandsorienteringTekst}
                hidden={!forhaandsorienteringTekst}
            />
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltVisning;
