import moment from 'moment';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { Undertittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { fetchSistOppdatert } from '../../api/dialogAPI';
import { Dialog } from '../../datatypes/dialogTypes';
import DialogIkon from '../aktivitet/visning/underelement-for-aktivitet/dialog/DialogIkon';
import { hentDialog } from '../dialog/dialog-reducer';
import { selectDialoger, selectSistOppdatert } from '../dialog/dialog-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import styles from './navigasjonslinje.module.less';

const DITTNAV_PATH = '/minside/';
const DIALOG_PATH = '/arbeidsrettet-dialog';

function Navigasjonslinje() {
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const sistOppdatert = useSelector(selectSistOppdatert, shallowEqual);
    const antallUlesteDialoger: number = useSelector(selectDialoger, shallowEqual).filter(
        (d: Dialog) => !d.lest
    ).length;

    const dispatch = useDispatch();

    useEffect(() => {
        const doHentDialog = () => dispatch(hentDialog());

        if (!erVeileder) {
            let interval: NodeJS.Timeout;

            const pollForChanges = () =>
                fetchSistOppdatert()
                    .then((data) => {
                        const localSistOppdatert = moment(sistOppdatert, moment.ISO_8601);
                        const remoteSistOppdatert = moment(data.sistOppdatert, moment.ISO_8601);
                        if (!!data.sistOppdatert && remoteSistOppdatert.isAfter(localSistOppdatert)) {
                            doHentDialog();
                        }
                    })
                    .catch(() => clearInterval(interval));

            interval = setInterval(pollForChanges, 10000);
            return () => clearInterval(interval);
        }
    }, [dispatch, erVeileder, sistOppdatert]);

    if (erVeileder) {
        return null;
    } else {
        return (
            <div className={styles.navigasjonslinje}>
                <LenkepanelBase className={styles.tilDittNav} href={DITTNAV_PATH}>
                    <span className={styles.tilDittNavTekst}>Min side</span>
                </LenkepanelBase>
                <Undertittel className={styles.tittel} tag="h1">
                    Aktivitetsplan
                </Undertittel>
                <a className={styles.tilDialog} href={DIALOG_PATH}>
                    <span className={styles.tilDialogTekst}>Dialog</span>
                    <DialogIkon antallUleste={antallUlesteDialoger} />
                    <span className={styles.avstand} hidden={antallUlesteDialoger > 0} />
                </a>
            </div>
        );
    }
}

export default Navigasjonslinje;
