import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { visibleIfHOC } from '../../hocs/visible-if';
import './pil-knapp.less';

function PilKnapp({ onClick, className, ...rest }) {
    return (
        <button {...rest} onClick={onClick} className={classNames('pil-knapp', className)} />
    );
}

PilKnapp.defaultProps = {
    className: null
};

PilKnapp.propTypes = {
    onClick: PT.func.isRequired,
    className: PT.string
};

export default visibleIfHOC(PilKnapp);
