import { MouseEvent } from 'react';

import { ARBEIDSRETTET_DIALOG_URL } from '../../constant';

interface DialogEventDetails {
    dialogId?: string;
    aktivitetId?: string;
}

export const byttTilDialogFlate = (event: MouseEvent, fnr?: string, aktiviteId?: string, dialogId?: string) => {
    event.preventDefault();
    window.history.pushState('', 'Dialog', getDialogLenke(true, fnr, aktiviteId, dialogId));
    window.dispatchEvent(
        new CustomEvent<DialogEventDetails>('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktiviteId,
            },
        })
    );
};

export const getDialogLenke = (erVeileder: boolean, fnr?: string, aktiviteId?: string, dialogId?: string) => {
    if (erVeileder && fnr) {
        if (dialogId) {
            return `/${fnr}/${dialogId}`;
        }
        if (aktiviteId) {
            return `/${fnr}/ny?aktivitetId=${aktiviteId}`;
        }
        return `/${fnr}`;
    } else {
        if (dialogId) {
            return `${ARBEIDSRETTET_DIALOG_URL}/${dialogId}`;
        }
        if (aktiviteId) {
            return `${ARBEIDSRETTET_DIALOG_URL}/ny?aktivitetId=${aktiviteId}`;
        }
        return `${ARBEIDSRETTET_DIALOG_URL}`;
    }
};
