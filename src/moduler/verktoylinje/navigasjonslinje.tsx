import { Heading, Link } from '@navikt/ds-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { AnyAction } from 'redux';

import { fetchSistOppdatert } from '../../api/dialogAPI';
import { Dialog } from '../../datatypes/dialogTypes';
import loggEvent, { APNE_OM_TJENESTEN } from '../../felles-komponenter/utils/logging';
import DialogIkon from '../aktivitet/visning/underelement-for-aktivitet/dialog/DialogIkon';
import { hentDialog } from '../dialog/dialog-reducer';
import { selectDialoger, selectSistOppdatert } from '../dialog/dialog-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import styles from './navigasjonslinje.module.less';

const MINSIDE_PATH = process.env.REACT_APP_MINSIDE_URL;
const DIALOG_PATH = process.env.REACT_APP_ARBEIDSRETTET_DIALOG_URL;

function Navigasjonslinje() {
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const sistOppdatert = useSelector(selectSistOppdatert, shallowEqual);
    const antallUlesteDialoger: number = useSelector(selectDialoger, shallowEqual).filter(
        (d: Dialog) => !d.lest
    ).length;

    const dispatch = useDispatch();

    useEffect(() => {
        const doHentDialog = () => dispatch(hentDialog() as unknown as AnyAction);

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
            <div className="flex flex-col gap-y-2">
                <div className="flex gap-y-2 gap-x-8 flex-col sm:flex-row">
                    <Link href={MINSIDE_PATH}>Min side</Link>
                    <Link href={DIALOG_PATH}>
                        <span className={styles.tilDialogTekst}>Min dialog med veileder</span>
                        <DialogIkon antallUleste={antallUlesteDialoger} />
                        <span className={styles.avstand} hidden={antallUlesteDialoger > 0} />
                    </Link>
                    <ReactRouterLink
                        to="/informasjon"
                        className="text-text-action underline"
                        onClick={() => loggEvent(APNE_OM_TJENESTEN)}
                    >
                        Hva er aktivitetsplanen?
                    </ReactRouterLink>
                </div>
                <Heading level="1" size="xlarge">
                    Aktivitetsplan
                </Heading>
            </div>
        );
    }
}

export default Navigasjonslinje;
