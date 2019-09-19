import React from 'react';
import classNames from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from './etikett.module.less';

interface Props {
    className?: string;
    children: React.ReactNode
} function EtikettBase(props: Props) {
    const { className, children } = props;
    return (
        <div className={classNames(styles.etikett, className)}>
            <Normaltekst tag="span" className={styles.etikettTekst}>
                {children}
            </Normaltekst>
        </div>
    );
}

export default EtikettBase;
