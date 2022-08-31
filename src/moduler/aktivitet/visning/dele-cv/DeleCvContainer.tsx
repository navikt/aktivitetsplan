import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';

import { STATUS_AVBRUTT, STATUS_FULLFOERT, STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import { DeleCVAvbruttVisning } from './DeleCVAvbruttVisning';
import styles from './DeleCvContainer.module.css';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const Ingress = () => (
    <Normaltekst className={styles.ingress}>
        Du bestemmer selv om NAV kan dele CV-en din for denne stillingen.
    </Normaltekst>
);

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const stillingFraNavData = aktivitet.stillingFraNavData;
    const cvKanDelesSvar = stillingFraNavData && stillingFraNavData?.cvKanDelesData;
    const erHistorisk = !!aktivitet.historisk;
    const [startCvSvarVisningAapen] = useState(!cvKanDelesSvar);

    if (aktivitet.type !== STILLING_FRA_NAV_TYPE || !stillingFraNavData) {
        return null;
    }

    if (cvKanDelesSvar) {
        return (
            <>
                <DeleCvSvarVisning cvKanDelesData={cvKanDelesSvar} startAapen={startCvSvarVisningAapen} />
                <DeleLinje />
            </>
        );
    }

    if (erHistorisk || aktivitet.status === STATUS_FULLFOERT || aktivitet.status === STATUS_AVBRUTT) {
        return (
            <>
                <DeleCVAvbruttVisning
                    status={aktivitet.status}
                    livslopsstatus={stillingFraNavData.livslopsstatus}
                    erHistorisk={erHistorisk}
                    svarfrist={stillingFraNavData.svarfrist}
                />
                <DeleLinje />
            </>
        );
    }

    return (
        <>
            <MeldInteresseForStilling aktivitet={aktivitet} />
            <DeleLinje />
        </>
    );
};
