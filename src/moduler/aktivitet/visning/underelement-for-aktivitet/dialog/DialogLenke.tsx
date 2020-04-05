import { Aktivitet, Dialog } from '../../../../../types';
import { useSelector } from 'react-redux';
import { selectErVeileder } from '../../../../identitet/identitet-selector';
import { selectErBrukerManuell, selectReservasjonKRR } from '../../../../oppfolging-status/oppfolging-selector';
import styles from './dialogunderelement.module.less';
import DialogLenkeInnhold from './DialogLenkeInnhold';
import DeleLinje from '../../delelinje/delelinje';
import React from 'react';
import LenkeTilDialog from '../../../../dialog/DialogLink';
import DialogIkon from './DialogIkon';
import { HoyreChevron } from 'nav-frontend-chevron';
import { createSelectDialogForAktivitetId } from '../../../../dialog/dialog-selector';

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
    const uleste = henvendelser.filter(h => !h.lest).length;

    return (
        <>
            <LenkeTilDialog className={styles.dialogLinke} dialogId={dialogId} aktivitetId={aktivitetId}>
                <DialogLenkeInnhold henvendelser={antallHenvendelser} uleste={uleste} erVeileder={erVeileder} />
                <DialogPil antallUleste={uleste} />
            </LenkeTilDialog>

            <DeleLinje hidden={skulDelelingje} />
        </>
    );
}

export default DialogLenke;
