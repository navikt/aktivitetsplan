import { EtikettLiten } from 'nav-frontend-typografi';
import React, { ReactNode } from 'react';

import styles from './ForNavAnsattMarkeringWrapper.module.less';

interface Props {
    children: ReactNode;
}

const ForNavAnsattMarkeringWrapper = ({ children }: Props) => (
    <div className={styles.navAnsattContainer}>
        {children}
        <EtikettLiten className={styles.navAnsattTekst}>FOR NAV-ANSATT</EtikettLiten>
    </div>
);

export default ForNavAnsattMarkeringWrapper;
