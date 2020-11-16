import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { fnrFraUrl } from '../../bootstrap/fnr-provider';
import { selectErVeileder } from '../identitet/identitet-selector';

export const dialogLenke = (erVeileder: boolean, aktiviteId?: string, dialogId?: string) => {
    if (erVeileder) {
        const fnr = fnrFraUrl();
        if (dialogId) {
            return `/veilarbpersonflatefs/${fnr}/${dialogId}`;
        }
        if (aktiviteId) {
            return `/veilarbpersonflatefs/${fnr}/ny?aktivitetId=${aktiviteId}`;
        }
        return `/veilarbpersonflatefs/${fnr}`;
    }

    if (dialogId) {
        return `/arbeidsrettet-dialog/${dialogId}`;
    }
    if (aktiviteId) {
        return `/arbeidsrettet-dialog/ny?aktivitetId=${aktiviteId}`;
    }
    return `/arbeidsrettet-dialog`;
};

const byttFlate = (event: MouseEvent, aktiviteId?: string, dialogId?: string) => {
    event.preventDefault();
    window.history.pushState('', 'Dialog', dialogLenke(true, aktiviteId, dialogId));
    window.dispatchEvent(
        new CustomEvent('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktiviteId,
            },
        })
    );
};

interface Props {
    className?: string;
    dialogId?: string;
    aktivitetId?: string;
    hidden?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

function LenkeTilDialog(props: Props) {
    const { className, dialogId, aktivitetId, hidden, onClick, children } = props;
    const history = useHistory();
    const erVeileder = useSelector(selectErVeileder);

    const internalOnClick = (event: MouseEvent) => {
        onClick && onClick();
        if (erVeileder) {
            history.replace('/');
            byttFlate(event, aktivitetId, dialogId);
        }
    };

    if (hidden) {
        return null;
    }

    return (
        <a href={dialogLenke(erVeileder, aktivitetId, dialogId)} onClick={internalOnClick} className={className}>
            {children}
        </a>
    );
}

export default LenkeTilDialog;
