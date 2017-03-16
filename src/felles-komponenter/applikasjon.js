import React, { PropTypes as PT } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#modal-a11y-wrapper');

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
