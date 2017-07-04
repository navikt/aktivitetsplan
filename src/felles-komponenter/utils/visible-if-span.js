import React from 'react';
import PT from 'prop-types';
import visibleIfHOC from '../../hocs/visible-if';

function VisibleIfSpan(props) {
    return (
        <span {...props}>
            {props.children}
        </span>
    );
}

VisibleIfSpan.propTypes = {
    children: PT.node.isRequired,
};

export default visibleIfHOC(VisibleIfSpan);
