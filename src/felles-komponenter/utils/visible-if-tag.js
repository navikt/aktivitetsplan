import PT from 'prop-types';
import React from 'react';

import visibleIfHOC from '../../hocs/visible-if';

function VisibleIfTag({ tagName, children, ...restProps }) {
    return React.createElement(tagName, restProps, children);
}

VisibleIfTag.propTypes = {
    children: PT.node.isRequired,
    tagName: PT.string.isRequired,
};

export default visibleIfHOC(VisibleIfTag);
