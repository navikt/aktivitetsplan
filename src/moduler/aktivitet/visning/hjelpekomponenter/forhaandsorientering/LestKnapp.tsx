import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import styles from './LestKnapp.module.less';

interface Props {
    hidden: boolean;
    lasterData: boolean;
    onClick(): void;
}

const LestKnapp = (props: Props) => {
    const { hidden, lasterData, onClick } = props;

    if (hidden) {
        return null;
    }

    return (
        <Knapp onClick={onClick} className={styles.lestKnapp} spinner={lasterData} autoDisableVedSpinner mini>
            Ok, jeg har lest beskjeden
        </Knapp>
    );
};

export default LestKnapp;
