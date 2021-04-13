import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

import styles from './LestKnappForhaandsorientering.module.less';

interface Props {
    hidden: boolean;
    onClick(): void;
}

const LestKnappForhaandsorientering = (props: Props) => {
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

export default LestKnappForhaandsorientering;
