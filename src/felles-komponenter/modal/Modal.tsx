import { Modal as AkselModal } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { SerializedError } from '../../api/utils';
import Feilmelding from '../../moduler/feilmelding/Feilmelding';
import { useRoutes } from '../../routes';
import Innholdslaster, { Avhengighet } from '../utils/Innholdslaster';
import ModalHeader from './ModalHeader';

interface Props {
    className?: string;
    header?: ReactNode;
    feilmeldinger?: SerializedError[];
    children: ReactNode;
    avhengigheter?: Avhengighet[] | Avhengighet;
    minstEnAvhengighet?: boolean;
    contentClass?: string;
    onRequestClose?(): void;
    contentLabel: string;
    ariaLabelledby?: string;
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
        contentClass,
        ariaLabelledby,
        contentLabel,
    } = props;

    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();

    const closeFuncOrDefault = () => {
        if (onRequestClose) {
            onRequestClose();
            return;
        }

        navigate(hovedsideRoute());
    };

    return (
        <AkselModal
            open
            aria-label={contentLabel}
            aria-labelledby={!contentLabel ? ariaLabelledby || 'modal-heading' : undefined}
            className={classNames(
                'aktivitet-modal lg:w-120 p-4 md:p-8 max-h-full overscroll-contain w-full rounded-none lg:rounded',
                className,
                contentClass
            )}
            overlayClassName="p-0 items-stretch lg:items-center lg:py-10"
            onClose={closeFuncOrDefault}
        >
            <div className="flex flex-col max-w-2xl mx-auto">
                {header}
                {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
                <Innholdslaster className="flex m-auto my-8" minstEn={minstEnAvhengighet} avhengigheter={avhengigheter}>
                    {children}
                </Innholdslaster>
            </div>
        </AkselModal>
    );
};

export default Modal;
