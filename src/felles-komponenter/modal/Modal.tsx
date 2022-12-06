import classNames from 'classnames';
import NavFrontendModal from 'nav-frontend-modal';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Feilmelding from '../../moduler/feilmelding/Feilmelding';
import { FeilmeldingType } from '../../moduler/feilmelding/FeilmeldingTypes';
import Innholdslaster, { Avhengighet } from '../utils/Innholdslaster';
import { RouteComponentProps, withRouter } from '../utils/withRouter';
import ModalHeader from './ModalHeader';

interface Props extends RouteComponentProps {
    className?: string;
    header?: ReactNode;
    feilmeldinger?: FeilmeldingType[];
    children: ReactNode;
    avhengigheter?: Avhengighet[] | Avhengighet;
    minstEnAvhengighet?: boolean;
    contentLabel: string;
    contentClass?: string;
    onRequestClose?(): void;
}

const Modal = (props: Props) => {
    const {
        header = <ModalHeader />,
        children,
        avhengigheter,
        onRequestClose,
        className,
        minstEnAvhengighet = false,
        feilmeldinger,
        contentLabel,
        contentClass,
        ...rest
    } = props;

    const navigate = useNavigate();

    const closeFuncOrDefault = () => {
        if (onRequestClose) {
            onRequestClose();
            return;
        }

        navigate('/');
    };

    return (
        <NavFrontendModal
            {...rest}
            isOpen
            className={classNames('aktivitet-modal', className)}
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            contentLabel={contentLabel}
            onRequestClose={closeFuncOrDefault}
            contentClass={contentClass}
        >
            {header}
            {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
            <Innholdslaster minstEn={minstEnAvhengighet} avhengigheter={avhengigheter}>
                {children}
            </Innholdslaster>
        </NavFrontendModal>
    );
};

export default withRouter(Modal);
