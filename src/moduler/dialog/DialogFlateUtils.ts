import { MouseEvent } from 'react';

import { ARBEIDSRETTET_DIALOG_URL } from '../../constant';
import { BASE_URL } from '../../environment';

interface DialogEventDetails {
    dialogId?: string;
    aktivitetId?: string;
}

export const byttTilDialogFlate = (event: MouseEvent, aktiviteId?: string, dialogId?: string) => {
    event.preventDefault();
    window.history.pushState('', 'Dialog', getDialogLenke(true, aktiviteId, dialogId));
    window.dispatchEvent(
        new CustomEvent<DialogEventDetails>('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktiviteId,
            },
        })
    );
};

export const getDialogLenke = (erVeileder: boolean, aktiviteId?: string, dialogId?: string) => {
    if (erVeileder) {
        if (dialogId) {
            return `${BASE_URL}/${dialogId}`;
        }
        if (aktiviteId) {
            return `${BASE_URL}/ny?aktivitetId=${aktiviteId}`;
        }
        return `${BASE_URL}`;
    }

    if (dialogId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/${dialogId}`;
    }
    if (aktiviteId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/ny?aktivitetId=${aktiviteId}`;
    }
    return `${ARBEIDSRETTET_DIALOG_URL}`;
};
