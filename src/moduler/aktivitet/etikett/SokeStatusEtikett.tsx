import classNames from 'classnames';
import React from 'react';

import * as statuskoder from '../../../constant';
import { StillingsStatus } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import styles from './etikett.module.less';

const getCls = (etikettnavn?: StillingsStatus): string => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return styles.soknadSendt;
        case statuskoder.INNKALT_TIL_INTERVJU:
            return styles.inkaltTilIntervju;
        case statuskoder.JOBBTILBUD:
            return styles.jobbtilbud;
        case statuskoder.AVSLAG:
            return styles.avslag;
        case statuskoder.INGEN_VALGT:
        case undefined:
        case null:
            return styles.ikkeStartet;
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

const SokeStatusEtikett = (props: Props) => {
    const { etikett, className, hidden } = props;

    const cls = getCls(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {getText(etikett)}
        </EtikettBase>
    );
};

export default SokeStatusEtikett;
