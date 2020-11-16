import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import visibleIfHOC from '../../../hocs/visible-if';
import styles from './avtalt-markering.module.less';

function AvtaltMarkering(props) {
    const { className } = props;
    return <EtikettBase className={classNames(styles.etikett, className)}>Avtalt med NAV</EtikettBase>;
}

AvtaltMarkering.defaultProps = {
    className: undefined,
};

AvtaltMarkering.propTypes = {
    className: PT.string,
};

export default visibleIfHOC(AvtaltMarkering);
