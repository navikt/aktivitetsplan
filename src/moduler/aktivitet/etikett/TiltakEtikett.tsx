import classNames from 'classnames';
import React from 'react';

import { ArenaEtikett } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import { tiltakEtikettMapper } from '../../../utils/textMappers';
import styles from './etikett.module.less';

const getCls = (etikettnavn: ArenaEtikett): string => {
    switch (etikettnavn) {
        case ArenaEtikett.JATAKK:
        case ArenaEtikett.AKTUELL:
        case ArenaEtikett.TILBUD:
        case ArenaEtikett.VENTELISTE:
        case ArenaEtikett.INFOMOETE:
            return styles.navLysBlaLighten60;
        case ArenaEtikett.AVSLAG:
        case ArenaEtikett.IKKAKTUELL:
            return styles.navGra20;
        case ArenaEtikett.IKKEM:
        case ArenaEtikett.NEITAKK:
            return styles.navOransjeLighten60;
    }
};

const getText = (etikettnavn: ArenaEtikett): string => {
    return tiltakEtikettMapper[etikettnavn];
};

export interface Props {
    etikett?: ArenaEtikett;
    className?: string;
    hidden?: boolean;
}

const AktivitetEtikett = (props: Props) => {
    const { etikett, className, hidden } = props;

    if (!etikett) return null;

    const cls = getCls(etikett);
    const text = getText(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {text}
        </EtikettBase>
    );
};

export default AktivitetEtikett;
