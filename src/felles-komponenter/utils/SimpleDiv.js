import React, { PropTypes as PT } from 'react';
import { visibleIfHOC } from '../../hocs/visible-if';

const SimpleDiv = ({ classes, children }) => <div className={classes}>{children}</div>;

SimpleDiv.propTypes = {
    classes: PT.string,
    children: PT.node.isRequired
};

SimpleDiv.defaultProps = {
    classes: ''
};

export default visibleIfHOC(SimpleDiv);
