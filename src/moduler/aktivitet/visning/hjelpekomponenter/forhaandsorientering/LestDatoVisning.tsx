import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoManed } from '../../../../../utils';
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

    return <Undertekst className={styles.lestDato}>Lest {formaterDatoManed(lestDato)}</Undertekst>;
};

export default LestDatoVisning;
