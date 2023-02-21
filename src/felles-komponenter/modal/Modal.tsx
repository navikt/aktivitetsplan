import { Modal as NavModal } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

import Feilmelding from '../../moduler/feilmelding/Feilmelding';
import { FeilmeldingType } from '../../moduler/feilmelding/FeilmeldingTypes';
import Innholdslaster, { Avhengighet } from '../utils/Innholdslaster';
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

    const history = useHistory();

    const closeFuncOrDefault = () => {
        if (onRequestClose) {
            onRequestClose();
            return;
        }

        history.push('/');
    };

    return (
        <NavModal
            {...rest}
            open
            className={classNames(
                'aktivitet-modal aktivitetsplanfs aktivitet-modal-portal w-120',
                className,
                contentClass
            )}
            overlayClassName="aktivitet-modal__overlay"
            onClose={closeFuncOrDefault}
        >
            <div className="flex flex-col ">
                {header}
                {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
                <Innholdslaster minstEn={minstEnAvhengighet} avhengigheter={avhengigheter}>
                    {children}
                </Innholdslaster>
            </div>
        </NavModal>
    );
};

export default withRouter(Modal);
