import React from 'react';
import PT from 'prop-types';
import visibleIfHOC from '../../hocs/visible-if';

function VisibleIfDiv(props) {
    return <div {...props}>{props.children}</div>;
}

VisibleIfDiv.propTypes = {
    children: PT.node.isRequired,
};

export default visibleIfHOC(VisibleIfDiv);
