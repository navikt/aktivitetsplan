import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoManed } from '../../../../../utils';
import styles from './LestDatoVisning.module.css';

interface Props {
    hidden: boolean;
    lest?: string;
}

const LestDatoVisning = (props: Props) => {
    const { hidden, lest } = props;

    if (hidden) {
        return null;
    }

    return <Undertekst className={styles.lestDato}>Lest {formaterDatoManed(lest)}</Undertekst>;
};

export default LestDatoVisning;
