import React from 'react';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import classNames from 'classnames';
import ModalHeader from './modal-header';
import history from '../../history';
import Innholdslaster from '../utils/innholdslaster';

function Modal({
    header,
    children,
    avhengigheter,
    onRequestClose,
    className,
    ...props
}) {
    return (
        <NavFrontendModal
            {...props}
            isOpen
            className={classNames('aktivitet-modal', className)}
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            shouldCloseOnOverlayClick={false}
            onRequestClose={onRequestClose}
        >
            <Innholdslaster avhengigheter={avhengigheter}>
                <div>
                    {header}
                    {children}
                </div>
            </Innholdslaster>
        </NavFrontendModal>
    );
}

Modal.defaultProps = {
    onRequestClose: () => history.push('/'),
    className: '',
    header: <ModalHeader />,
    avhengigheter: [],
};

Modal.propTypes = {
    onRequestClose: PT.func,
    className: PT.string,
    header: PT.node,
    children: PT.node.isRequired,
    avhengigheter: PT.array,
};

export default Modal;
