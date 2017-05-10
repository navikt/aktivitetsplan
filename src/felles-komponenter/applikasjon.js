import React from 'react';
import PT from 'prop-types'

function Applikasjon({ children }) {
    return (
        <div className="aktivitetsplan">
            {children}
        </div>
    );
}

Applikasjon.propTypes = {
    children: PT.node
};

Applikasjon.defaultProps = {
    children: undefined
};

export default Applikasjon;
