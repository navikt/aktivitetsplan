import { MouseEvent } from 'react';

import { ARBEIDSRETTET_DIALOG_URL } from '../../constant';
import { hentFnrFraUrl } from '../../utils/fnr-util';

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

const BASE_URL = import.meta.env.BASE_URL;

export const getDialogLenke = (erVeileder: boolean, aktiviteId?: string, dialogId?: string) => {
    if (erVeileder) {
        const fnr = hentFnrFraUrl();
        if (dialogId) {
            return `${BASE_URL}${fnr}/${dialogId}`;
        }
        if (aktiviteId) {
            return `${BASE_URL}${fnr}/ny?aktivitetId=${aktiviteId}`;
        }
        return `${BASE_URL}${fnr}`;
    }

    if (dialogId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/${dialogId}`;
    }
    if (aktiviteId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/ny?aktivitetId=${aktiviteId}`;
    }
    return `${ARBEIDSRETTET_DIALOG_URL}`;
};
