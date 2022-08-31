import { HoyreChevron } from 'nav-frontend-chevron';
import React from 'react';
import { useSelector } from 'react-redux';

import { STILLING_FRA_NAV_TYPE } from '../../../../../constant';
import { Aktivitet } from '../../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../../datatypes/dialogTypes';
import { createSelectDialogForAktivitetId } from '../../../../dialog/dialog-selector';
import LenkeTilDialog from '../../../../dialog/DialogLink';
import { selectErVeileder } from '../../../../identitet/identitet-selector';
import { selectErBrukerManuell, selectReservasjonKRR } from '../../../../oppfolging-status/oppfolging-selector';
import DeleLinje from '../../delelinje/delelinje';
import DialogIkon from './DialogIkon';
import DialogLenkeInnhold from './DialogLenkeInnhold';
import styles from './Dialogunderelement.module.css';

interface Props {
    aktivitet: Aktivitet;
    hidden?: boolean;
    skulDelelingje: boolean;
}

function DialogPil(props: { antallUleste: number }) {
    return (
        <div className={styles.dialogPil} aria-hidden>
            <DialogIkon antallUleste={props.antallUleste} />
            <HoyreChevron />
        </div>
    );
}

function DialogLenke(props: Props) {
    const { aktivitet, hidden, skulDelelingje } = props;
    const aktivitetId = aktivitet.id;
    const dialog: Dialog | undefined = useSelector(createSelectDialogForAktivitetId(aktivitetId));
    const erVeileder: boolean = !!useSelector(selectErVeileder);
    const manuellBruker: boolean = useSelector(selectErBrukerManuell);
    const reservertKrr = useSelector(selectReservasjonKRR);

    const skulVisIkkeDialog = manuellBruker || aktivitet.historisk || reservertKrr;

    if (hidden) {
        return null;
    }

    if (skulVisIkkeDialog && !dialog) {
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

            <DeleLinje hidden={skulDelelingje} />
        </>
    );
}

export default DialogLenke;
