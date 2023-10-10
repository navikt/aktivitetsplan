import { MouseEvent } from 'react';

import { ARBEIDSRETTET_DIALOG_URL } from '../../constant';
import { saveReduxStateToSessionStorage } from '../../store';

interface DialogEventDetails {
    dialogId?: string;
    aktivitetId?: string;
}

export const byttTilDialogFlate = ({
    event,
    aktivitetId,
    dialogId,
}: {
    event: MouseEvent;
    fnr?: string;
    aktivitetId?: string;
    dialogId?: string;
}) => {
    event.preventDefault();
    saveReduxStateToSessionStorage();
    window.history.pushState('', 'Dialog', getDialogLenke({ erVeileder: true, aktivitetId, dialogId }));
    window.dispatchEvent(
        new CustomEvent<DialogEventDetails>('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktivitetId,
            },
        }),
    );
};

export const getDialogLenke = ({
    dialogId,
    aktivitetId,
    erVeileder,
}: {
    erVeileder: boolean;
    fnr?: string;
    aktivitetId?: string;
    dialogId?: string;
}) => {
    if (erVeileder) {
        if (dialogId) {
            return `/${dialogId}`;
        }
        if (aktivitetId) {
            return `/ny?aktivitetId=${aktivitetId}`;
        }
        return `/`;
    } else {
        if (dialogId) {
            return `${ARBEIDSRETTET_DIALOG_URL}/${dialogId}`;
        }
        if (aktivitetId) {
            return `${ARBEIDSRETTET_DIALOG_URL}/ny?aktivitetId=${aktivitetId}`;
        }
        return `${ARBEIDSRETTET_DIALOG_URL}`;
    }
};
