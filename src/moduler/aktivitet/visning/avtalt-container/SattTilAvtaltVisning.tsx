import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils/dateUtils';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    forhaandsorienteringstype: ForhaandsorienteringType;
    aktivitet: AlleAktiviteter;
}

const SattTilAvtaltVisning = ({ aktivitet, forhaandsorienteringstype }: Props) => {
    const mindreEnnSyvDagerTil = aktivitet.tilDato ? !erMerEnnSyvDagerTil(aktivitet.tilDato) : false;
    if (!forhaandsorienteringstype) return null;

    return (
        <>
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                harTilDato={aktivitet.tilDato != null}
                forhaandsorienteringstype={forhaandsorienteringstype}
            />
            <Forhaandsorienteringsvisning aktivitet={aktivitet} startAapen />
        </>
    );
};

export default SattTilAvtaltVisning;
