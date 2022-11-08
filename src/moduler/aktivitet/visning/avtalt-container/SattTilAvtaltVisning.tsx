import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    aktivitet: AlleAktiviteter;
}

const SattTilAvtaltVisning = (props: Props) => {
    const { aktivitet, forhaandsorienteringstype } = props;

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    if (!forhaandsorienteringstype) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                harTilDato={aktivitet.tilDato != null}
                forhaandsorienteringstype={forhaandsorienteringstype}
            />
            <Forhaandsorienteringsvisning aktivitet={aktivitet} startAapen />
            <DeleLinje />
        </>
    );
};

export default SattTilAvtaltVisning;
