import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useErVeileder } from '../../Provider';
import { useRoutes } from '../../routing/useRoutes';
import { byttTilDialogFlate, getDialogLenke } from './DialogFlateUtils';
import { Link } from '@navikt/ds-react';

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
            byttTilDialogFlate({ event, aktivitetId, dialogId });
        }
    };

    if (hidden) {
        return null;
    }

    return (
        <Link href={getDialogLenke({ erVeileder, aktivitetId, dialogId })} onClick={internalOnClick} className={className}>
            {children}
        </Link>
    );
};

export default LenkeTilDialog;
