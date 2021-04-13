import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoKortManed } from '../../../../../utils';
import styles from './LestDatoForhaandsorientering.module.less';

interface Props {
    hidden: boolean;
    forhaandsorienteringLest?: string;
}

const LestDatoForhaandsorientering = (props: Props) => {
    const { hidden, forhaandsorienteringLest } = props;

    if (hidden) {
        return null;
    }

    return (
        <Normaltekst className={styles.lestDato}>Lest {formaterDatoKortManed(forhaandsorienteringLest)}</Normaltekst>
    );
};

export default LestDatoForhaandsorientering;
