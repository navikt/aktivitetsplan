import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { fnrFraUrl } from '../../bootstrap/fnr-provider';
import { selectErVeileder } from '../identitet/identitet-selector';
import { useHistory } from 'react-router-dom';

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
                aktivitetId: aktiviteId
            }
        })
    );
};

interface Props {
    className?: string;
    dialogId?: string;
    aktivitetId?: string;
    hidden?: boolean;
    children: React.ReactNode;
}

function LenkeTilDialog(props: Props) {
    const { className, dialogId, aktivitetId, hidden, children } = props;
    const history = useHistory();
    const erVeileder = useSelector(selectErVeileder);

    const onClick = (event: MouseEvent) => {
        if (erVeileder) {
            history.replace('/');
            byttFlate(event, aktivitetId, dialogId);
        }
    };

    if (hidden) {
        return null;
    }

    return (
        <a href={dialogLenke(erVeileder, aktivitetId, dialogId)} onClick={onClick} className={className}>
            {children}
        </a>
    );
}

export default LenkeTilDialog;
