import React, { PropTypes as PT } from 'react';

function ModalFooter({ children }) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
}

ModalFooter.propTypes = {
    children: PT.node
};

export default ModalFooter;
