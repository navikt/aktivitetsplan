import { Next } from '@navikt/ds-icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { STILLING_FRA_NAV_TYPE } from '../../../../../constant';
import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../../datatypes/dialogTypes';
import { createSelectDialogForAktivitetId } from '../../../../dialog/dialog-selector';
import LenkeTilDialog from '../../../../dialog/DialogLink';
import { selectErVeileder } from '../../../../identitet/identitet-selector';
import { selectErBrukerManuell, selectReservasjonKRR } from '../../../../oppfolging-status/oppfolging-selector';
import DeleLinje from '../../delelinje/delelinje';
import DialogIkon from './DialogIkon';
import DialogLenkeInnhold from './DialogLenkeInnhold';
import styles from './Dialogunderelement.module.less';

interface Props {
    aktivitet: AlleAktiviteter;
    hidden?: boolean;
}

function DialogPil(props: { antallUleste: number }) {
    return (
        <div className={styles.dialogPil} aria-hidden>
            <DialogIkon antallUleste={props.antallUleste} />
            <Next />
        </div>
    );
}

function DialogLenke(props: Props) {
    const { aktivitet, hidden } = props;
    // Note:
    //   Hvis aktivitet er arenaaktivitet:
    //        Hvis aktivitet er migrert: id er tekniskid
    //        Hvis ikke migrert        : id er arenaid
    //   Hvis veilarbaktivitet:          id er tekniskid
    const aktivitetId = aktivitet.id;
    const dialog: Dialog | undefined = useSelector(createSelectDialogForAktivitetId(aktivitet));
    const erVeileder: boolean = !!useSelector(selectErVeileder);
    const manuellBruker: boolean = useSelector(selectErBrukerManuell);
    const reservertKrr = useSelector(selectReservasjonKRR);

    const historisk = isVeilarbAktivitet(aktivitet) ? aktivitet.historisk : false;
    const skjulNyDialogLenke = manuellBruker ?? historisk ?? reservertKrr;

    if (hidden) {
        return null;
    }

    if (skjulNyDialogLenke && !dialog) {
        return null;
    }

    const henvendelser = dialog && dialog.henvendelser ? dialog.henvendelser : [];
    const dialogId = dialog && dialog.id;
    const antallHenvendelser = henvendelser.length;
    const uleste = henvendelser.filter((h) => !h.lest).length;
    const erStillingFraNav = aktivitet.type === STILLING_FRA_NAV_TYPE;

    return (
        <>
            <LenkeTilDialog className={styles.dialogLinke} dialogId={dialogId} aktivitetId={aktivitetId}>
                <DialogLenkeInnhold
                    henvendelser={antallHenvendelser}
                    uleste={uleste}
                    erVeileder={erVeileder}
                    erStillingFraNav={erStillingFraNav}
                />
                <DialogPil antallUleste={uleste} />
            </LenkeTilDialog>

            <DeleLinje hidden={isArenaAktivitet(aktivitet)} />
        </>
    );
}

export default DialogLenke;
