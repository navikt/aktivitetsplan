import React from 'react';

import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentDialoger } from '../moduler/dialog/dialog-slice';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';

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

export function windowEvent(update: UpdateTypes) {
    window.dispatchEvent(
        new CustomEvent<UpdateEventType>(eventName, { detail: { uppdate: update, avsender: 'aktivitetsplan' } }),
    );
}

export function UpdateEventHandler() {
    const dispatch = useAppDispatch();

    useEventListener<UpdateEventType>(eventName, (event) => {
        const updateType = event.detail.uppdate;
        const avsender = event.detail.avsender;

        if (avsender === 'aktivitetsplan') {
            return;
        }

        switch (updateType) {
            case UpdateTypes.Aktivitet:
                return dispatch(hentAktiviteter());
            case UpdateTypes.Dialog:
                return dispatch(hentDialoger(true));
            case UpdateTypes.Oppfolging:
                return dispatch(hentOppfolging());
        }
    });

    return <></>;
}
