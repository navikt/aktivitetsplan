import React, { Component } from 'react';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import ModalHeader from './modal-header';
import Innholdslaster from '../utils/innholdslaster';
import Feilmelding from '../../moduler/feilmelding/feilmelding';
import * as AppPT from '../../proptypes';

class Modal extends Component {
    componentWillUnmount() {
        console.log('unmounting modal'); // eslint-disable-line
    }
    render() {
        const {
            header,
            children,
            avhengigheter,
            onRequestClose,
            className,
            minstEnAvhengighet,
            history,
            ...rest
        } = this.props;

        const closeFuncOrDefault = () => {
            if (onRequestClose) {
                onRequestClose();
                return;
            }

            history.push('/');
        };

        return (
            <NavFrontendModal
                {...rest}
                isOpen
                className={classNames('aktivitet-modal', className)}
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="aktivitetsplanfs aktivitet-modal-portal"
                shouldCloseOnOverlayClick={false}
                onRequestClose={closeFuncOrDefault}
            >
                {header}
                <Feilmelding className="feilmelding--systemfeil" />
                <Innholdslaster
                    minstEn={minstEnAvhengighet}
                    avhengigheter={avhengigheter}
                >
                    {children}
                </Innholdslaster>
            </NavFrontendModal>
        );
    }
}

Modal.defaultProps = {
    onRequestClose: null,
    className: '',
    header: <ModalHeader />,
    avhengigheter: [],
    minstEnAvhengighet: false,
};

Modal.propTypes = {
    history: AppPT.history.isRequired,
    onRequestClose: PT.func,
    className: PT.string,
    header: PT.node,
    children: PT.node.isRequired,
    avhengigheter: PT.array,
    minstEnAvhengighet: PT.bool,
};

export default withRouter(Modal);
