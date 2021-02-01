import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErVeileder } from '../../identitet/identitet-selector';
import styles from './ikke-delt-markering.module.less';

export const SkalIkkeDeltMarkeringVises = ({ type, erReferatPublisert, referat }: Aktivitet): boolean => {
    const erVeileder = useSelector(selectErVeileder);
    const harIkkeDeltSamtalereferat = type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
    const harMoteReferat = Boolean(referat);
    const harIkkedeltReferatFraMote = type === MOTE_TYPE && harMoteReferat && !erReferatPublisert;
    return erVeileder && (harIkkeDeltSamtalereferat || harIkkedeltReferatFraMote);
};

const IkkeDeltMarkering = () => <EtikettBase className={styles.etikett}>Samtalereferatet er ikke delt</EtikettBase>;

export default visibleIfHOC(IkkeDeltMarkering);
