import { Normaltekst } from 'nav-frontend-typografi';
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

    return <Normaltekst className={styles.lestDato}>Lest {formaterDatoKortManed(lestDato)}</Normaltekst>;
};

export default LestDatoVisning;
