import { MouseEvent } from 'react';

import { getFodselsnummer } from '../../utils/fnr-util';

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
        const fnr = getFodselsnummer();
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
