import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';

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
        <AlertStripe type="advarsel" form="inline" className={styles.ulestMarkering}>
            <Element>Ulest</Element>
        </AlertStripe>
    );
};

export default UlestMarkering;
