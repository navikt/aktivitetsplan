import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import visibleIfHOC from '../../../hocs/visible-if';
import styles from './ikke-delt-markering.less';

function IkkeDeltMarkering(props) {
    const { className } = props;
    return <EtikettBase className={classNames(className, styles.etikett, 'etikett')}>Samtalereferatet er ikke delt</EtikettBase>;
}

IkkeDeltMarkering.defaultProps = {
    className: undefined,
};

IkkeDeltMarkering.propTypes = {
    className: PT.string,
};

export default visibleIfHOC(IkkeDeltMarkering);
