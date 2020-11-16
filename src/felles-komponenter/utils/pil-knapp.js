import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';

import visibleIfHOC from '../../hocs/visible-if';

function PilKnapp({ onClick, className, ...rest }) {
    return <button type="button" {...rest} onClick={onClick} className={classNames('pil-knapp', className)} />;
}

PilKnapp.defaultProps = {
    className: null,
};

PilKnapp.propTypes = {
    onClick: PT.func.isRequired,
    className: PT.string,
};

export default visibleIfHOC(PilKnapp);
