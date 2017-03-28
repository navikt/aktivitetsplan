import React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import './modal.less';

function Modal(props) {
    return (
        <NavFrontendModal
            className="aktivitet-modal"
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitet-modal-portal"
            shouldCloseOnOverlayClick={false}
            {...props}
        />);
}

export default Modal;
