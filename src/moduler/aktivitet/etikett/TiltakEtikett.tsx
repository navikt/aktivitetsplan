import classNames from 'classnames';
import React from 'react';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { ArenaEtikett } from '../../../datatypes/arenaAktivitetTypes';
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
            return styles.gray200;
        case ArenaEtikett.IKKEM:
        case ArenaEtikett.NEITAKK:
            return styles.navOransjeLighten60;
    }
};

const getText = (etikettnavn: ArenaEtikett): string => {
    return tiltakEtikettMapper[etikettnavn];
};

export interface Props {
    aktivitet: AlleAktiviteter;
    className?: string;
}

const TiltakEtikett = (props: Props) => {
    const { aktivitet, className } = props;

    if (!isArenaAktivitet(aktivitet)) {
        return null;
    }

    const etikett = aktivitet.etikett;

    if (!etikett) return null;

    const cls = getCls(etikett);
    const text = getText(etikett);

    return <EtikettBase className={classNames(cls, className)}>{text}</EtikettBase>;
};

export default TiltakEtikett;
