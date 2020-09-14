import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import styles from './avtalt-markering.module.less';
import visibleIfHOC from '../../../hocs/visible-if';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';

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
