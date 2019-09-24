import React from 'react';
import PT from 'prop-types';
import styles from './underseksjon.module.less';

function Underseksjon(props) {
    const { children } = props;
    return <section className={styles.underseksjon}>{children}</section>;
}

Underseksjon.propTypes = {
    children: PT.node.isRequired
};

export default Underseksjon;
