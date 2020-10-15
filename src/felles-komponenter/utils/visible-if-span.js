import React from 'react';
import PT from 'prop-types';
import visibleIfHOC from '../../hocs/visible-if';

function VisibleIfSpan(props) {
    const { children } = props;
    return <span {...props}>{children}</span>;
}

VisibleIfSpan.propTypes = {
    children: PT.node.isRequired,
};

export default visibleIfHOC(VisibleIfSpan);
