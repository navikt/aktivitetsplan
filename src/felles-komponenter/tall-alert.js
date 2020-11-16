import PT from 'prop-types';
import React from 'react';

import hiddenIfHOC from './hidden-if/hidden-if';

function getText(antall) {
    if (antall === 1) {
        return 'Du har 1 ulest melding';
    }
    return `Du har ${antall} uleste meldinger`;
}

function TallAlert({ children }) {
    return (
        <span className="tall-alert">
            <span aria-hidden="true">{children}</span>
            <span className="sr-only">{getText(children)}</span>
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
