import React, { PropTypes as PT } from 'react';
import './modal-footer.less';

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
