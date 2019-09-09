import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from './etikett.module.less';

function EtikettBase(props) {
    const { className, children } = props;
    return (
        <div className={classNames(styles.etikett, className)}>
            <Normaltekst tag="span" className={styles.etikettTekst}>
                {children}
            </Normaltekst>
        </div>
    );
}

EtikettBase.defaultProps = {
    className: undefined,
};

EtikettBase.propTypes = {
    className: PT.string,
    children: PT.node.isRequired,
};

export default EtikettBase;
