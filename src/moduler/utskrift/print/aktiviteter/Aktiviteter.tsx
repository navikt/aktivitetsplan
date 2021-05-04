import React from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import Gruppe from './Gruppe';

interface Props {
    aktiviteter?: Aktivitet[];
    dialoger?: Dialog[];
}

const Aktiviteter = (props: Props) => {
    const { aktiviteter, dialoger } = props;

    if (!aktiviteter) {
        return null;
    }

    const gruperteAktiviteter = aktiviteter.reduce((acc: { [key: string]: Aktivitet[] | undefined }, a: Aktivitet) => {
        const status = acc[a.status];
        if (status) {
            status.push(a);
        } else {
            acc[a.status] = [a];
        }
        return acc;
    }, {});

    return (
        <>
            <Gruppe
                tittel="Aktiviteter jeg gjennomfører nå"
                aktiviteter={gruperteAktiviteter[STATUS_GJENNOMFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Planlagte aktiviteter"
                aktiviteter={gruperteAktiviteter[STATUS_PLANLAGT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Forslag til aktiviteter"
                aktiviteter={gruperteAktiviteter[STATUS_BRUKER_ER_INTRESSERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Fullførte aktiviteter"
                aktiviteter={gruperteAktiviteter[STATUS_FULLFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Avbrutte aktiviteter"
                aktiviteter={gruperteAktiviteter[STATUS_AVBRUTT]}
                dialoger={dialoger}
            />
        </>
    );
};

export default Aktiviteter;
