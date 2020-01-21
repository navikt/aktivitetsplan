import React, { MouseEvent } from 'react';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { useSelector } from 'react-redux';
import { selectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import { Aktivitet, Dialog } from '../../../../types';
import styles from './underelementer.module.less';
import { fnrFraUrl } from '../../../../bootstrap/fnr-provider';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { selectErBrukerManuell, selectReservasjonKRR } from '../../../oppfolging-status/oppfolging-selector';
import DeleLinje from '../delelinje/delelinje';
import DailogLenkeInnhold from './DialogLenkeInnhold';
import { useHistory } from 'react-router-dom';

interface Props {
    aktivitet: Aktivitet;
    hidden?: boolean;
    skulDelelingje: boolean;
}

const createSelector = (aktivitetId: string) => (state: any) => selectDialogForAktivitetId(state, aktivitetId);

//TODO fiks for eksternbruker
const dialogLenke = (aktiviteId: string, dialog?: Dialog) => {
    const fnr = fnrFraUrl();
    if (dialog) {
        return `/veilarbpersonflatefs/${fnr}/${dialog.id}`;
    }
    return `/veilarbpersonflatefs/${fnr}/ny?aktivitetId=${aktiviteId}`;
};

const byttFlate = (event: MouseEvent, aktiviteId: string, erVeileder: boolean, dialog?: Dialog) => {
    if (!erVeileder) {
        return;
    }
    event.preventDefault();
    window.history.pushState('', 'Dialog', dialogLenke(aktiviteId, dialog));
    window.dispatchEvent(
        new CustomEvent('visDialog', {
            detail: {
                dialogId: dialog && dialog.id,
                aktivitetId: aktiviteId
            }
        })
    );
};

function UlestMarkering(props: { hidden: boolean }) {
    if (props.hidden) {
        return null;
    }
    return <div className={styles.uleste} />;
}

function DialogLink(props: Props) {
    const { aktivitet, hidden, skulDelelingje } = props;
    const aktivitetId = aktivitet.id;
    const dialog: Dialog | undefined = useSelector(createSelector(aktivitetId));
    const erVeileder: boolean = !!useSelector(selectErVeileder);
    const manuellBruker: boolean = useSelector(selectErBrukerManuell);
    const reservertKrr = useSelector(selectReservasjonKRR);
    const history = useHistory();

    const skulVisIkkeDialog = manuellBruker || aktivitet.historisk || reservertKrr;

    if (hidden) {
        return null;
    }

    if (skulVisIkkeDialog && !dialog) {
        return null;
    }

    const onClick = (event: MouseEvent) => {
        history.replace('/');
        byttFlate(event, aktivitetId, erVeileder, dialog);
    };

    const henvendelser = dialog && dialog.henvendelser ? dialog.henvendelser : [];
    const antallHenvendelser = henvendelser.length;
    const uleste = henvendelser.filter(h => !h.lest).length;

    return (
        <>
            <section className="aktivitetvisning__underseksjon">
                <LenkepanelBase href={dialogLenke(aktivitetId, dialog)} onClick={onClick} border className={styles.svg}>
                    <UlestMarkering hidden={!uleste} />
                    <div className={styles.margin + ' lenkepanel__heading'}>
                        <DailogLenkeInnhold henvendelser={antallHenvendelser} uleste={uleste} erVeileder={erVeileder} />
                    </div>
                </LenkepanelBase>
            </section>
            <DeleLinje hidden={skulDelelingje} />
        </>
    );
}

export default DialogLink;
