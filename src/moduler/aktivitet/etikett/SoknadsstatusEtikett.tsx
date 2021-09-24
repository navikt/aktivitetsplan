import classNames from 'classnames';
import React from 'react';

import * as statuskoder from '../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './etikett.module.less';

const getCls = (etikettnavn?: StillingFraNavSoknadsstatus): string => {
    switch (etikettnavn) {
        case statuskoder.VENTER:
            return styles.venter;
        case statuskoder.SKAL_PAA_INTERVJU:
            return styles.skalPaaIntervju;
        case statuskoder.JOBBTILBUD:
            return styles.jobbtilbud;
        case statuskoder.AVSLAG:
            return styles.avslag;
        default:
            return '';
    }
};

const getText = (etikettnavn?: StillingFraNavSoknadsstatus): string => {
    switch (etikettnavn) {
        case statuskoder.VENTER:
            return 'Venter på å bli kontaktet';
        case statuskoder.SKAL_PAA_INTERVJU:
            return 'Skal på intervju';
        case statuskoder.JOBBTILBUD:
            return 'Fått jobbtilbud 🎉';
        case statuskoder.AVSLAG:
            return 'Fått avslag';
        default:
            return '';
    }
};

export interface Props {
    etikett?: StillingFraNavSoknadsstatus;
    className?: string;
    hidden?: boolean;
}

const SoknadsstatusEtikett = (props: Props) => {
    const { etikett, className, hidden } = props;

    const cls = getCls(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {getText(etikett)}
        </EtikettBase>
    );
};

export default SoknadsstatusEtikett;
