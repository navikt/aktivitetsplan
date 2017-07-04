import React from 'react';
import PT from 'prop-types';
import hiddenIfHOC from '../felles-komponenter/hidden-if/hidden-if';

function TallAlert({ children }) {
    return (
        <span className="tall-alert">
            {children}
        </span>
    );
}

TallAlert.propTypes = {
    children: PT.number,
};

TallAlert.defaultProps = {
    children: undefined,
};

export default hiddenIfHOC(TallAlert);
