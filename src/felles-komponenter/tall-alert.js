import React from 'react';
import PT from 'prop-types'
import './tall-alert.less';
import visibleIfHOC from '../hocs/visible-if';


function Dato({ children }) {
    return (
        <span className="tall-alert">{children}</span>
    );
}

Dato.propTypes = {
    children: PT.number
};

Dato.defaultProps = {
    children: undefined
};

export default visibleIfHOC(Dato);
