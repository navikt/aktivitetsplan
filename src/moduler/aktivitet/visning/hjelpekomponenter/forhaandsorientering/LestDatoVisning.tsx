import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoKortManed } from '../../../../../utils';
import styles from './LestDatoVisning.module.less';

interface Props {
    hidden: boolean;
    lestDato?: string;
}

const LestDatoVisning = (props: Props) => {
    const { hidden, lestDato } = props;

    if (hidden) {
        return null;
    }

    return <Undertekst className={styles.lestDato}>Lest {formaterDatoKortManed(lestDato)}</Undertekst>;
};

export default LestDatoVisning;
