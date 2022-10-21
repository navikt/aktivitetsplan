import React from 'react';
import { useDispatch } from 'react-redux';

import { TabChangeEvent } from '../datatypes/types';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentDialog } from '../moduler/dialog/dialog-reducer';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-reducer';

export enum UpdateTypes {
    Dialog = 'DIALOG',
    Oppfolging = 'OPPFOLGING',
    Aktivitet = 'AKTIVITET',
}

interface UpdateEventType {
    uppdate: string;
    avsender?: string;
}

const eventName = 'uppdate';

export function widowEvent(update: UpdateTypes) {
    window.dispatchEvent(
        new CustomEvent<UpdateEventType>(eventName, { detail: { uppdate: update, avsender: 'aktivitetsplan' } })
    );
}

const isUpdateEvent = (toBeDetermined: Event): toBeDetermined is CustomEvent<UpdateEventType> =>
    !!(toBeDetermined as CustomEvent<UpdateEventType>).type;

export const isTabEvent = (toBeDetermined: Event): toBeDetermined is CustomEvent<TabChangeEvent> =>
    !!(toBeDetermined as CustomEvent<TabChangeEvent>).type;

export function UppdateEventHandler() {
    const dispatch = useDispatch();

    useEventListener(eventName, (event) => {
        if (!isUpdateEvent(event)) {
            return;
        }

        const updateType = event.detail.uppdate;
        const avsennder = event.detail.avsender;

        if (avsennder === 'aktivitetsplan') {
            return;
        }

        switch (updateType) {
            case UpdateTypes.Aktivitet:
                return dispatch(hentAktiviteter());
            case UpdateTypes.Dialog:
                return dispatch(hentDialog());
            case UpdateTypes.Oppfolging:
                return dispatch(hentOppfolging());
        }
    });

    return <></>;
}
