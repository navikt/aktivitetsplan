import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, shallowEqual } from 'react-redux';
import { selectDialoger, selectSistOppdatert } from '../dialog/dialog-selector';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { selectErVeileder } from '../identitet/identitet-selector';
import DialogIkon from '../aktivitet/visning/underelement-for-aktivitet/dialog/DialogIkon';
import { hentDialog } from '../dialog/dialog-reducer';
import { hentSistOppdatert } from '../dialog/dialog-api';
import { Dialog } from '../../types';
import moment from 'moment';

const DITTNAV_PATH = '/dittnav/';
const DIALOG_PATH = '/arbeidsrettet-dialog';

function Navigasjonslinje() {
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const sistOppdatert = useSelector(selectSistOppdatert, shallowEqual);
    const antallUlesteDialoger: number = useSelector(selectDialoger, shallowEqual).filter((d: Dialog) => !d.lest)
        .length;

    const dispatch = useDispatch();

    useEffect(() => {
        const doHentDialog = () => dispatch(hentDialog());

        if (!erVeileder) {
            let interval: NodeJS.Timeout;

            const pollForChanges = () =>
                hentSistOppdatert()
                    .then((data: { sistOppdatert?: string }) => {
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
            <div className="navigasjonslinje">
                <LenkepanelBase className="tilDittNav" href={DITTNAV_PATH}>
                    <span className="tilDittNavTekst">Ditt NAV</span>
                </LenkepanelBase>
                <LenkepanelBase className="tilDialog" href={DIALOG_PATH}>
                    <DialogIkon antallUleste={antallUlesteDialoger} />
                    <span className="avstand" hidden={antallUlesteDialoger > 0} />
                    <span className="tilDialogTekst">Dialog</span>
                </LenkepanelBase>
            </div>
        );
    }
}

export default Navigasjonslinje;
