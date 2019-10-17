import React from 'react';
import classNames from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from './etikett.module.less';

interface EtikettBaseProps {
    children: React.ReactNode;
    className?: string;
    hidden?: boolean;
}
function EtikettBase(props: EtikettBaseProps) {
    const { className, children, hidden } = props;
    return (
        <div className={classNames(styles.etikett, className)} hidden={hidden}>
            <Normaltekst tag="span" className={styles.etikettTekst}>
                {children}
            </Normaltekst>
        </div>
    );
}

export default EtikettBase;
