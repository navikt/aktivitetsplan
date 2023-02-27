import { MouseEvent } from 'react';

import { getContextPath } from '../../utils';
import { hentFnrFraUrl } from '../../utils/fnr-util';

export const byttTilDialogFlate = (event: MouseEvent, aktiviteId?: string, dialogId?: string) => {
    event.preventDefault();
    window.history.pushState('', 'Dialog', getDialogLenke(true, aktiviteId, dialogId));
    window.dispatchEvent(
        new CustomEvent('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktiviteId,
            },
        })
    );
};

const ARBEIDSRETTET_DIALOG_URL = import.meta.env.VITE_ARBEIDSRETTET_DIALOG_URL;

export const getDialogLenke = (erVeileder: boolean, aktiviteId?: string, dialogId?: string) => {
    if (erVeileder) {
        const fnr = hentFnrFraUrl();
        if (dialogId) {
            return `${getContextPath()}/${fnr}/${dialogId}`;
        }
        if (aktiviteId) {
            return `${getContextPath()}/${fnr}/ny?aktivitetId=${aktiviteId}`;
        }
        return `${getContextPath()}/${fnr}`;
    }

    if (dialogId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/${dialogId}`;
    }
    if (aktiviteId) {
        return `${ARBEIDSRETTET_DIALOG_URL}/ny?aktivitetId=${aktiviteId}`;
    }
    return `${ARBEIDSRETTET_DIALOG_URL}`;
};
