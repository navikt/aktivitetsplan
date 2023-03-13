import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectErVeileder } from '../identitet/identitet-selector';
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
    const history = useHistory();
    const erVeileder = useSelector(selectErVeileder);

    const internalOnClick = (event: MouseEvent) => {
        if (erVeileder) {
            history.replace('/');
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
