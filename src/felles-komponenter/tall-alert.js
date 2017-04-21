import React, { PropTypes as PT } from 'react';
import './tall-alert.less';
import { visibleIfHOC } from '../hocs/visible-if';


function Dato({ children }) {
    return (
        <span className="tall-alert">{children}</span>
    );
}

Dato.propTypes = {
    children: PT.number
};

export default visibleIfHOC(Dato);
