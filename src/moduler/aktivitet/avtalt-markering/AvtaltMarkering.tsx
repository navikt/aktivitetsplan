import classNames from 'classnames';
import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './AvtaltMarkering.module.less';

interface Props {
    className?: string;
    hidden: boolean;
}

const AvtaltMarkering = (props: Props) => {
    const { className, hidden } = props;

    if (hidden) {
        return null;
    }

    return <EtikettBase className={classNames(styles.etikett, className)}>Avtalt med NAV</EtikettBase>;
};

export default AvtaltMarkering;
