import React, { PropTypes as PT } from 'react';
import './modal-container.less';

function ModalContainer({ children }) {
    return (
        <div className="modal-container">
            {children}
        </div>
    );
}

ModalContainer.propTypes = {
    children: PT.node
};

ModalContainer.defaultProps = {
    children: undefined
};

export default ModalContainer;
