import { Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';

import styles from './ForNavAnsattMarkeringWrapper.module.less';

interface Props {
    children: ReactNode;
}

const ForNavAnsattMarkeringWrapper = ({ children }: Props) => (
    <div className={styles.navAnsattContainer}>
        <div className={styles.navAnsattChildren}>{children}</div>
        <Label className={styles.navAnsattTekst}>FOR NAV-ANSATT</Label>
    </div>
);

export default ForNavAnsattMarkeringWrapper;
