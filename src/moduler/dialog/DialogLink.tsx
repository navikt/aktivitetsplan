import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { fnrFraUrl } from '../../bootstrap/fnr-provider';
import { selectErVeileder } from '../identitet/identitet-selector';
import { useHistory } from 'react-router-dom';

//TODO fiks for eksternbruker
const dialogLenke = (aktiviteId?: string, dialogId?: string) => {
    const fnr = fnrFraUrl();
    if (dialogId) {
        return `/veilarbpersonflatefs/${fnr}/${dialogId}`;
    }
    if (aktiviteId) {
        return `/veilarbpersonflatefs/${fnr}/ny?aktivitetId=${aktiviteId}`;
    }
    return `/veilarbpersonflatefs/${fnr}/ny`;
};

const byttFlate = (event: MouseEvent, erVeileder: boolean, aktiviteId?: string, dialogId?: string) => {
    if (!erVeileder) {
        return;
    }
    event.preventDefault();
    window.history.pushState('', 'Dialog', dialogLenke(aktiviteId, dialogId));
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
        history.replace('/');
        byttFlate(event, erVeileder, aktivitetId, dialogId);
    };

    if (hidden) {
        return null;
    }

    return (
        <a href={dialogLenke(aktivitetId, dialogId)} onClick={onClick} className={className}>
            {children}
        </a>
    );
}

export default LenkeTilDialog;
