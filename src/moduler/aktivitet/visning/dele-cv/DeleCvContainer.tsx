import { isAfter, parseISO } from 'date-fns';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import styles from './DeleCvContainer.module.less';
import { DeleCVFristUtloptVisning } from './DeleCVFristUtloptVisning';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const stillingFraNavData = aktivitet.stillingFraNavData;
    const cvKanDelesSvar = stillingFraNavData && stillingFraNavData?.cvKanDelesData;
    const svarfrist = stillingFraNavData?.svarfrist;
    const fristUtlopt = svarfrist && isAfter(new Date(), parseISO(svarfrist));

    const overskrift = 'Er du interessert i denne stillingen?';
    const ingress = 'Du bestemmer selv om nav skal dele CV-en din på denne stillingen';

    const Ingress = () => <Normaltekst className={styles.ingress}>{ingress}</Normaltekst>;

    if (!cvKanDelesSvar && fristUtlopt && svarfrist) {
        return (
            <>
                <DeleLinje />
                <DeleCVFristUtloptVisning overskrift={overskrift} Ingress={Ingress} svarfrist={svarfrist} />
            </>
        );
    }

    return (
        <>
            <DeleLinje />
            {cvKanDelesSvar ? (
                <DeleCvSvarVisning cvKanDelesData={cvKanDelesSvar} overskrift={overskrift} Ingress={Ingress} />
            ) : (
                <MeldInteresseForStilling aktivitet={aktivitet} overskrift={overskrift} Ingress={Ingress} />
            )}
        </>
    );
};
