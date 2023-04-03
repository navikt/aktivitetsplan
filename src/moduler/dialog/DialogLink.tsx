import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import hovedside from '../../hovedside/Hovedside';
import { useErVeileder } from '../../Provider';
import { useRoutes } from '../../routes';
import { byttTilDialogFlate, getDialogLenke } from './DialogFlateUtils';

interface Props {
    className?: string;
    dialogId?: string;
    aktivitetId?: string;
    hidden?: boolean;
    children: React.ReactNode;
}

const LenkeTilDialog = (props: Props) => {
    const { className, dialogId, aktivitetId, hidden, children } = props;

    const navigate = useNavigate();
    const erVeileder = useErVeileder();
    const { hovedsideRoute } = useRoutes();

    const internalOnClick = (event: MouseEvent) => {
        if (erVeileder) {
            navigate(hovedsideRoute(), { replace: true });
            byttTilDialogFlate(event, aktivitetId, dialogId);
        }
    };

    if (hidden) {
        return null;
    }

    return (
        <a href={getDialogLenke(erVeileder, aktivitetId, dialogId)} onClick={internalOnClick} className={className}>
            {children}
        </a>
    );
};

export default LenkeTilDialog;
