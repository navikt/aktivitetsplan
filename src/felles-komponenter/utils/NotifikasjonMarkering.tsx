import React from 'react';

import styles from './notifikasjon-markering.module.less';
import VisibleIfDiv from './visible-if-div';

interface LenkeknappProps {
    visible: boolean;
}

const NotifikasjonMarkering = (props: LenkeknappProps) => (
    <VisibleIfDiv visible={props.visible} className={styles.nyendring}>
        <span className={styles.nyendringSirkel} />
    </VisibleIfDiv>
);

export default NotifikasjonMarkering;
