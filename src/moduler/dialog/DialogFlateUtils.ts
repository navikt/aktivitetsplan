import { MouseEvent } from 'react';

import { ARBEIDSRETTET_DIALOG_URL } from '../../constant';

interface DialogEventDetails {
    dialogId?: string;
    aktivitetId?: string;
}

export const byttTilDialogFlate = ({
    event,
    aktivitetId,
    dialogId,
    fnr,
}: {
    event: MouseEvent;
    fnr?: string;
    aktivitetId?: string;
    dialogId?: string;
}) => {
    event.preventDefault();
    window.history.pushState('', 'Dialog', getDialogLenke({ erVeileder: true, fnr, aktivitetId, dialogId }));
    window.dispatchEvent(
        new CustomEvent<DialogEventDetails>('visDialog', {
            detail: {
                dialogId: dialogId,
                aktivitetId: aktivitetId,
            },
        })
    );
};

export const getDialogLenke = ({
    dialogId,
    fnr,
    aktivitetId,
    erVeileder,
}: {
    erVeileder: boolean;
    fnr?: string;
    aktivitetId?: string;
    dialogId?: string;
}) => {
    if (erVeileder && fnr) {
        if (dialogId) {
            return `/${fnr}/${dialogId}`;
        }
        if (aktivitetId) {
            return `/${fnr}/ny?aktivitetId=${aktivitetId}`;
        }
        return `/${fnr}`;
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
