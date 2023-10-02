import { Modal as AkselModal } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { MouseEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { SerializedError } from '../../api/utils';
import Feilmelding from '../../moduler/feilmelding/Feilmelding';
import { useRoutes } from '../../routes';
import Innholdslaster, { Avhengighet } from '../utils/Innholdslaster';

interface Props {
    className?: string;
    heading: string;
    subHeading?: string;
    feilmeldinger?: SerializedError[];
    children: ReactNode;
    avhengigheter?: Avhengighet[] | Avhengighet;
    minstEnAvhengighet?: boolean;
    contentClass?: string;
    onRequestClose?(): void;
    tilbakeLenke?: { tekst: string; onTilbakeKlikk: MouseEventHandler };
    // contentLabel: string;
    // ariaLabelledby?: string;
}

const Modal = (props: Props) => {
    const {
        heading,
        subHeading,
        children,
        avhengigheter,
        onRequestClose,
        className,
        minstEnAvhengighet = false,
        feilmeldinger,
        contentClass,
        tilbakeLenke,
        // ariaLabelledby,
        // contentLabel,
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
            header={{ heading, closeButton: true }}
            open
            // aria-label={contentLabel}
            // aria-labelledby={!contentLabel ? ariaLabelledby || 'modal-heading' : undefined}
            className={classNames(
                'aktivitet-modal lg:w-120 md:p-8 md:px-8  max-h-full overscroll-contain w-full rounded-none lg:rounded',
                className,
                contentClass,
            )}
            onClose={closeFuncOrDefault}
        >
            <div className="flex flex-col max-w-2xl mx-auto">
                {subHeading}
                {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
                <Innholdslaster className="flex m-auto my-8" minstEn={minstEnAvhengighet} avhengigheter={avhengigheter}>
                    {children}
                </Innholdslaster>
            </div>
        </AkselModal>
    );
};

export default Modal;
