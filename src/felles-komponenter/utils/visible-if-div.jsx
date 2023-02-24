import PT from 'prop-types';
import React from 'react';

import visibleIfHOC from '../../hocs/visible-if';

function VisibleIfDiv(props) {
    const { children } = props;
    return <div {...props}>{children}</div>;
}

VisibleIfDiv.propTypes = {
    children: PT.node.isRequired,
};

export default visibleIfHOC(VisibleIfDiv);
