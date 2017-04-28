import React, { PropTypes as PT } from 'react';
import { visibleIfHOC } from '../../hocs/visible-if';

function VisibleIfDiv({ className, children }) {
    return <div className={className}>{children}</div>;
}

VisibleIfDiv.propTypes = {
    className: PT.string,
    children: PT.node.isRequired
};

VisibleIfDiv.defaultProps = {
    className: ''
};

export default visibleIfHOC(VisibleIfDiv);
