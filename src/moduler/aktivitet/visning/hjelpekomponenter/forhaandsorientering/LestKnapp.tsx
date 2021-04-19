import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import styles from './LestKnapp.module.less';

interface Props {
    hidden: boolean;
    onClick(): void;
}

const LestKnapp = (props: Props) => {
    const { hidden, onClick } = props;

    if (hidden) {
        return null;
    }

    return (
        <Knapp onClick={onClick} className={styles.lestKnapp} mini>
            Ok, jeg har lest beskjeden
        </Knapp>
    );
};

export default LestKnapp;
