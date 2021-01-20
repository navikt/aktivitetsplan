import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import styles from './ikke-delt-markering.module.less';
import visibleIfHOC from "../../../hocs/visible-if";

const IkkeDeltMarkering = () => (
    <EtikettBase className={styles.etikett}>
        Samtalereferatet er ikke delt
    </EtikettBase>
);

export default visibleIfHOC(IkkeDeltMarkering);
