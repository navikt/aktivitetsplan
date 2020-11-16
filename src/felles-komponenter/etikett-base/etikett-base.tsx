import classNames from 'classnames';
import React from 'react';

import styles from './etikett.module.less';

interface Props {
    className?: string;
    children: React.ReactNode;
    hidden?: boolean;
}
function EtikettBase(props: Props) {
    const { className, children, hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <div className={classNames(styles.etikett, className)}>
            <span className={styles.etikettTekst}>{children}</span>
        </div>
    );
}

export default EtikettBase;
