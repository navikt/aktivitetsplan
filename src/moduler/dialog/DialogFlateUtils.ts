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
        return `/arbeidsrettet-dialog/${dialogId}`;
    }
    if (aktiviteId) {
        return `/arbeidsrettet-dialog/ny?aktivitetId=${aktiviteId}`;
    }
    return `/arbeidsrettet-dialog`;
};
