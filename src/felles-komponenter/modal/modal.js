import React from 'react';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import ModalHeader from './modal-header';
import Innholdslaster from '../utils/innholdslaster';
import * as AppPT from '../../proptypes';
import Feilmelding from '../../moduler/feilmelding/Feilmelding';

function Modal({
    header,
    children,
    avhengigheter,
    onRequestClose,
    className,
    minstEnAvhengighet,
    history,
    feilmeldinger,
    ...props
}) {
    const closeFuncOrDefault = () => {
        if (onRequestClose) {
            onRequestClose();
            return;
        }

        history.push('/');
    };

    return (
        <NavFrontendModal
            {...props}
            isOpen
            className={classNames('aktivitet-modal', className)}
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            onRequestClose={closeFuncOrDefault}
        >
            {header}
            <Feilmelding feilmeldinger={feilmeldinger} />
            <Innholdslaster minstEn={minstEnAvhengighet} avhengigheter={avhengigheter}>
                {children}
            </Innholdslaster>
        </NavFrontendModal>
    );
}

Modal.defaultProps = {
    onRequestClose: null,
    className: '',
    header: <ModalHeader />,
    avhengigheter: [],
    minstEnAvhengighet: false,
    feilmeldinger: [],
};

Modal.propTypes = {
    history: AppPT.history.isRequired,
    onRequestClose: PT.func,
    className: PT.string,
    header: PT.node,
    feilmeldinger: PT.array,
    children: PT.node.isRequired,
    avhengigheter: PT.array,
    minstEnAvhengighet: PT.bool,
};

export default withRouter(Modal);
