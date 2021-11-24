import classNames from 'classnames';
import React from 'react';

import * as statuskoder from '../../../constant';
import { ArenaEtikett, StillingsStatus } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import { tiltakEtikettMapper } from '../../../utils/textMappers';
import styles from './etikett.module.less';

const getCls = (etikettnavn?: StillingsStatus): string => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return styles.soknadSendt;
        case statuskoder.INNKALT_TIL_INTERVJU:
            return styles.innkaltTilIntervju;
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

const getArenaCls = (etikettnavn?: ArenaEtikett): string => {
    return styles.test;
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

const getArenaText = (etikettnavn?: ArenaEtikett): string => {
    if (!etikettnavn) return '';
    return tiltakEtikettMapper[etikettnavn];
};

export interface Props {
    etikett?: StillingsStatus | ArenaEtikett;
    className?: string;
    hidden?: boolean;
    erArenaAktivitet?: boolean;
}

const SokeStatusEtikett = (props: Props) => {
    const { etikett, className, hidden, erArenaAktivitet = false } = props;

    const cls = !erArenaAktivitet ? getCls(etikett as StillingsStatus) : getArenaCls(etikett as ArenaEtikett);
    const text = !erArenaAktivitet ? getText(etikett as StillingsStatus) : getArenaText(etikett as ArenaEtikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {text}
        </EtikettBase>
    );
};

export default SokeStatusEtikett;
