import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import styles from './DeleCvContainer.module.less';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const cvKanDelesSvar = aktivitet.stillingFraNavData && aktivitet.stillingFraNavData?.cvKanDelesData;
    const overskrift = 'Er du interessert i denne stillingen?';
    const ingress = 'Du bestemmer selv om nav skal dele CV-en din på denne stillingen';

    const Ingress = () => <Normaltekst className={styles.ingress}>{ingress}</Normaltekst>;

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
