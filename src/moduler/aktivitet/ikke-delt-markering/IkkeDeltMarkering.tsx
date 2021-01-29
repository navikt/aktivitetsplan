import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import styles from './ikke-delt-markering.module.less';
import visibleIfHOC from "../../../hocs/visible-if";
import {Aktivitet} from "../../../datatypes/aktivitetTypes";
import {MOTE_TYPE, SAMTALEREFERAT_TYPE} from "../../../constant";
import {useSelector} from "react-redux";
import {selectErVeileder} from "../../identitet/identitet-selector";

export function SkalIkkeDeltMarkeringVises({type, erReferatPublisert, referat}: Aktivitet): boolean {
    const erVeileder = useSelector(selectErVeileder);
    const harIkkeDeltSamtalereferat = type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
    const harMoteReferat = Boolean(referat)
    const harIkkedeltReferatFraMote = type === MOTE_TYPE && (harMoteReferat && !erReferatPublisert);
    return erVeileder && (harIkkeDeltSamtalereferat || harIkkedeltReferatFraMote);
}

const IkkeDeltMarkering = () => (
    <EtikettBase className={styles.etikett}>
        Samtalereferatet er ikke delt
    </EtikettBase>
);

export default visibleIfHOC(IkkeDeltMarkering);
