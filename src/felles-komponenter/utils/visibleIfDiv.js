import React, { PropTypes as PT } from 'react';
import { visibleIfHOC } from '../../hocs/visible-if';

function VisibleIfDiv(props) {
    return <div {...props}>{props.children}</div>;
}

VisibleIfDiv.propTypes = {
    children: PT.node.isRequired
};

export default visibleIfHOC(VisibleIfDiv);
