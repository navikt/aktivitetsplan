import { Undertekst } from 'nav-frontend-typografi';
import React, { ReactNode } from 'react';

import styles from './ForNavAnsattMarkeringWrapper.module.css';

interface Props {
    children: ReactNode;
}

const ForNavAnsattMarkeringWrapper = ({ children }: Props) => (
    <div className={styles.navAnsattContainer}>
        <div className={styles.navAnsattChildren}>{children}</div>
        <Undertekst className={styles.navAnsattTekst}>FOR NAV-ANSATT</Undertekst>
    </div>
);

export default ForNavAnsattMarkeringWrapper;
