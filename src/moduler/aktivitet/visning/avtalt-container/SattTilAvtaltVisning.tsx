import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    aktivitet: Aktivitet;
}

const SattTilAvtaltVisning = (props: Props) => {
    const { aktivitet, forhaandsorienteringstype } = props;

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);
    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;

    if (!forhaandsorienteringTekst) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                forhaandsorienteringstype={forhaandsorienteringstype}
            />
            <Forhaandsorienteringsvisning aktivitet={aktivitet} startAapen />
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltVisning;
