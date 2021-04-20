import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    aktivitet: Aktivitet;
    erArenaAktivitet: boolean;
}

const SattTilAvtaltVisning = (props: Props) => {
    const { aktivitet, forhaandsorienteringstype, erArenaAktivitet } = props;

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    if (!forhaandsorienteringstype) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                forhaandsorienteringstype={forhaandsorienteringstype}
            />
            <Forhaandsorienteringsvisning aktivitet={aktivitet} erArenaAktivitet={erArenaAktivitet} startAapen />
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltVisning;
