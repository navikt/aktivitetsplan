import classNames from 'classnames';
import React from 'react';

import * as statuskoder from '../../../constant';
import { StillingsStatus } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './etikett.module.less';

const getCls = (etikettnavn: StillingsStatus): string => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return styles.navGronnLighten60;
        case statuskoder.INNKALT_TIL_INTERVJU:
            return styles.navLysBlaLighten60;
        case statuskoder.JOBBTILBUD:
            return styles.navOransjeLighten60;
        case statuskoder.AVSLAG:
        case statuskoder.INGEN_VALGT:
            return styles.navGra20;
    }
};

const getText = (etikettnavn?: StillingsStatus): string => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return 'Sendt søknad og venter på svar';
        case statuskoder.INNKALT_TIL_INTERVJU:
            return 'Skal på intervju';
        case statuskoder.JOBBTILBUD:
            return 'Fått jobbtilbud 🎉';
        case statuskoder.AVSLAG:
            return 'Fått avslag';
        case statuskoder.INGEN_VALGT:
        case undefined:
        case null:
            return 'Ikke startet';
    }
};

export interface Props {
    etikett?: StillingsStatus;
    className?: string;
    hidden?: boolean;
}

const StillingEtikett = (props: Props) => {
    const { etikett, className, hidden } = props;

    const cls = getCls(etikett);
    const text = getText(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {text}
        </EtikettBase>
    );
};

export default StillingEtikett;
