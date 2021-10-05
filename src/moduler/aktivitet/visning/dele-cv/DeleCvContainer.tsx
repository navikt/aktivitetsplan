import { isAfter, parseISO } from 'date-fns';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';

import { STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import styles from './DeleCvContainer.module.less';
import { DeleCVFristUtloptVisning } from './DeleCVFristUtloptVisning';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const Ingress = () => (
    <Normaltekst className={styles.ingress}>
        Du bestemmer selv om NAV skal dele CV-en din på denne stillingen.
    </Normaltekst>
);
export const overskrift = 'Er du interessert i denne stillingen?';

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const [startAapen, setStartAapen] = useState(false);

    const stillingFraNavData = aktivitet.stillingFraNavData;
    const cvKanDelesSvar = stillingFraNavData && stillingFraNavData?.cvKanDelesData;
    const svarfrist = stillingFraNavData?.svarfrist;
    const fristUtlopt = svarfrist && isAfter(new Date(), parseISO(svarfrist));

    if (aktivitet.type !== STILLING_FRA_NAV_TYPE) {
        return null;
    }

    if (cvKanDelesSvar) {
        return (
            <>
                <DeleCvSvarVisning cvKanDelesData={cvKanDelesSvar} overskrift={overskrift} startAapen={startAapen} />
                <DeleLinje />
            </>
        );
    }

    if (fristUtlopt && svarfrist) {
        return (
            <>
                <DeleCVFristUtloptVisning overskrift={overskrift} svarfrist={svarfrist} />
                <DeleLinje />
            </>
        );
    }

    return (
        <>
            <MeldInteresseForStilling
                aktivitet={aktivitet}
                overskrift={overskrift}
                setStartAapenTilTrue={() => setStartAapen(true)}
            />
            <DeleLinje />
        </>
    );
};
