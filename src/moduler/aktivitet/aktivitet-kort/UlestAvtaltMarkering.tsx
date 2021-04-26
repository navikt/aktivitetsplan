import React from 'react';
import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { selectErBruker } from '../../identitet/identitet-selector';
import AvtaltMarkering from '../avtalt-markering/AvtaltMarkering';
import UlestMarkering from '../ulest-markering/UlestMarkering';
import { skalMarkereForhaandsorienteringSomLest } from '../visning/avtalt-container/utilsForhaandsorientering';
import styles from './UlestAvtaltMarkering.module.less';

interface Props {
    aktivitet: Aktivitet;
}

const UlestAvtaltMarkering = (props: Props) => {
    const { aktivitet } = props;
    const erBruker = useSelector(selectErBruker);
    const skalMarkereSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    return (
        <div className={styles.container}>
            <UlestMarkering hidden={!skalMarkereSomLest} />
            <AvtaltMarkering hidden={!aktivitet.avtalt} />
        </div>
    );
};

export default UlestAvtaltMarkering;
