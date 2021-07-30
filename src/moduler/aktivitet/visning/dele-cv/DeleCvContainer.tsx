import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';
import styles from './MeldInteresseForStillingen.module.less';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const cvKanDelesSvar = aktivitet.stillingFraNavData && aktivitet.stillingFraNavData?.cvKanDelesData;
    const overskrift = 'Er du interessert i denne stillingen?';
    const ingress = 'Du bestemmer selv om nav skal dele CV-en din på denne stillingen';

    const Ingress = () => <p className={styles.ingress}>{ingress}</p>;

    return (
        <>
            <DeleLinje />
            {cvKanDelesSvar ? (
                <DeleCvSvarVisning cvKanDelesData={cvKanDelesSvar} overskrift={overskrift} ingress={<Ingress />} />
            ) : (
                <MeldInteresseForStilling aktivitet={aktivitet} overskrift={overskrift} ingress={<Ingress />} />
            )}
        </>
    );
};
