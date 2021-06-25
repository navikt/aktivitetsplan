import { Element } from 'nav-frontend-typografi';
import React from 'react';

import { ReactComponent as UlestViktigIkon } from '../../../Ikoner/advarsel-ikon.svg';
import styles from './UlestMarkering.module.less';

interface Props {
    hidden: boolean;
}
const UlestMarkering = (props: Props) => {
    const { hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <div className={styles.ulestMarkering}>
            <UlestViktigIkon />
            <Element className={styles.ulestTekst}>Ulest</Element>
        </div>
    );
};

export default UlestMarkering;
