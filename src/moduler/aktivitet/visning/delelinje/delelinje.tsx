import React from 'react';

import styles from './delelinje.module.less';

interface Props {
    hidden?: boolean;
}

function DeleLinje(props: Props) {
    if (props.hidden) {
        return null;
    }
    return <hr className={styles.delelinje} />;
}

export default DeleLinje;
