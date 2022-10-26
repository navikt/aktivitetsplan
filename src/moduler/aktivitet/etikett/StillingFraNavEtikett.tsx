import classNames from 'classnames';
import React from 'react';

import * as statuskoder from '../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './etikett.module.less';

const getCls = (etikettnavn: StillingFraNavSoknadsstatus): string => {
    switch (etikettnavn) {
        case statuskoder.VENTER:
            return styles.navGronnLighten60;
        case statuskoder.CV_DELT:
            return styles.navLysBlaLighten60;
        case statuskoder.SKAL_PAA_INTERVJU:
            return styles.navLysBlaLighten60;
        case statuskoder.JOBBTILBUD:
            return styles.navOransjeLighten60;
        case statuskoder.AVSLAG:
        case statuskoder.IKKE_FATT_JOBBEN:
        case undefined:
            return styles.gray200;
    }
};

const getText = (etikettnavn: StillingFraNavSoknadsstatus): string => {
    switch (etikettnavn) {
        case statuskoder.VENTER:
            return 'Venter på å bli kontaktet';
        case statuskoder.CV_DELT:
            return 'CV er delt med arbeidsgiver';
        case statuskoder.SKAL_PAA_INTERVJU:
            return 'Skal på intervju';
        case statuskoder.JOBBTILBUD:
            return 'Fått jobbtilbud 🎉';
        case statuskoder.AVSLAG:
        case statuskoder.IKKE_FATT_JOBBEN:
            return 'Ikke fått jobben';
    }
};

export interface Props {
    etikett?: StillingFraNavSoknadsstatus;
    className?: string;
    hidden?: boolean;
}

const StillingFraNavEtikett = (props: Props) => {
    const { etikett, className, hidden } = props;

    if (!etikett) return null;

    const cls = getCls(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {getText(etikett)}
        </EtikettBase>
    );
};

export default StillingFraNavEtikett;
