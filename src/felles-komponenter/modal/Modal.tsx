import { Heading, Link, Modal as AkselModal } from '@navikt/ds-react';
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
        minstEnAvhengighet = false,
        feilmeldinger,
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
        <AkselModal open onClose={closeFuncOrDefault} className="lg:w-120" aria-labelledby="modal-heading">
            <AkselModal.Header closeButton={true}>
                <div className="space-y-2">
                    <Heading id="modal-heading" size="large">
                        {heading}
                    </Heading>
                    {tilbakeLenke ? (
                        <>
                            <Link className="hover:cursor-pointer" onClick={tilbakeLenke.onTilbakeKlikk} tabIndex={0}>
                                {tilbakeLenke.tekst}
                            </Link>
                        </>
                    ) : null}
                </div>
            </AkselModal.Header>
            <AkselModal.Body>
                <div className="flex flex-col max-w-2xl mx-auto">
                    <Heading className="" level="2" size="xsmall">
                        {subHeading}
                    </Heading>
                    {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
                    <Innholdslaster
                        className="flex m-auto my-8"
                        minstEn={minstEnAvhengighet}
                        avhengigheter={avhengigheter}
                    >
                        {children}
                    </Innholdslaster>
                </div>
            </AkselModal.Body>
        </AkselModal>
    );
};

export default Modal;
