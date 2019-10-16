import React from 'react';
import classNames from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from './etikett.module.less';

export interface EtikettBaseProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: React.ReactNode;
}
function EtikettBase(props: EtikettBaseProps) {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames(styles.etikett, className)} {...rest}>
            <Normaltekst tag="span" className={styles.etikettTekst}>
                {children}
            </Normaltekst>
        </div>
    );
}

export default EtikettBase;
