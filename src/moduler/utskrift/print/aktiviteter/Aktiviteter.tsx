import React from 'react';

import { AktivitetStatus, AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import Gruppe from './Gruppe';

interface Props {
    aktiviteter?: AlleAktiviteter[];
    dialoger?: Dialog[];
}

const Aktiviteter = (props: Props) => {
    const { aktiviteter, dialoger } = props;

    if (!aktiviteter) {
        return null;
    }

    const gruperteAktiviteter = aktiviteter.reduce(
        (acc: { [key: string]: AlleAktiviteter[] | undefined }, a: AlleAktiviteter) => {
            const status = acc[a.status];
            if (status) {
                status.push(a);
            } else {
                acc[a.status] = [a];
            }
            return acc;
        },
        {}
    );

    return (
        <>
            <Gruppe
                tittel="Aktiviteter jeg gjennomfører nå"
                aktiviteter={gruperteAktiviteter[AktivitetStatus.GJENNOMFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Planlagte aktiviteter"
                aktiviteter={gruperteAktiviteter[AktivitetStatus.PLANLAGT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Forslag til aktiviteter"
                aktiviteter={gruperteAktiviteter[AktivitetStatus.BRUKER_ER_INTRESSERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Fullførte aktiviteter"
                aktiviteter={gruperteAktiviteter[AktivitetStatus.FULLFOERT]}
                dialoger={dialoger}
            />
            <Gruppe
                tittel="Avbrutte aktiviteter"
                aktiviteter={gruperteAktiviteter[AktivitetStatus.AVBRUTT]}
                dialoger={dialoger}
            />
        </>
    );
};

export default Aktiviteter;
