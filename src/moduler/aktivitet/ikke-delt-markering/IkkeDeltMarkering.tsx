import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import styles from './ikke-delt-markering.module.less';
import visibleIfHOC from "../../../hocs/visible-if";
import {Aktivitet} from "../../../datatypes/aktivitetTypes";
import {MOTE_TYPE, SAMTALEREFERAT_TYPE} from "../../../constant";
import {useSelector} from "react-redux";
import {selectErVeileder} from "../../identitet/identitet-selector";
import {selectDialogForAktivitetId} from "../../dialog/dialog-selector";

export function SkalIkkeDeltMarkeringVises(aktivitet: Aktivitet): boolean {
    const erVeileder = useSelector(selectErVeileder);
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, aktivitet.id))
    const harIkkeDeltSamtalereferat = aktivitet.type === SAMTALEREFERAT_TYPE && !aktivitet.erReferatPublisert;
    const harIkkedeltReferatFraMote = aktivitet.type === MOTE_TYPE && !(dialog || aktivitet.erReferatPublisert);
    return erVeileder && (harIkkeDeltSamtalereferat || harIkkedeltReferatFraMote);
}

const IkkeDeltMarkering = () => (
    <EtikettBase className={styles.etikett}>
        Samtalereferatet er ikke delt
    </EtikettBase>
);

export default visibleIfHOC(IkkeDeltMarkering);
