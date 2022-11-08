import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

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

export function UpdateEventHandler() {
    const dispatch = useDispatch();

    useEventListener<UpdateEventType>(eventName, (event) => {
        const updateType = event.detail.uppdate;
        const avsender = event.detail.avsender;

        if (avsender === 'aktivitetsplan') {
            return;
        }

        switch (updateType) {
            case UpdateTypes.Aktivitet:
                return dispatch(hentAktiviteter() as unknown as AnyAction);
            case UpdateTypes.Dialog:
                return dispatch(hentDialog() as unknown as AnyAction);
            case UpdateTypes.Oppfolging:
                return dispatch(hentOppfolging() as unknown as AnyAction);
        }
    });

    return <></>;
}
