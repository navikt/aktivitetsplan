import React, { PropTypes as PT } from 'react';

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

export default Applikasjon;
