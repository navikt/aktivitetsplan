import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { selectErBruker } from '../../identitet/identitet-selector';
import AvtaltMarkering from '../avtalt-markering/AvtaltMarkering';
import UlestMarkering from '../ulest-markering/UlestMarkering';
import { skalMarkereForhaandsorienteringSomLest } from '../visning/avtalt-container/utilsForhaandsorientering';

interface Props {
    aktivitet: AlleAktiviteter;
}

const UlestAvtaltMarkering = (props: Props) => {
    const { aktivitet } = props;
    const erBruker = useSelector(selectErBruker);
    const skalMarkereSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    if (!skalMarkereSomLest && !aktivitet.avtalt) return null;

    return (
        <>
            <UlestMarkering hidden={!skalMarkereSomLest} />
            <AvtaltMarkering hidden={!aktivitet.avtalt} />
        </>
    );
};

export default UlestAvtaltMarkering;
