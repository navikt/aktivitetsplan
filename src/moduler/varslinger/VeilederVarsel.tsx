import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { formaterDatoKortManed } from '../../utils';
import LenkeTilDialog from '../dialog/DialogLink';
import {
    selectErEskalert,
    selectGjeldendeEskaleringsVarsel,
    selectTilHorendeDialogId,
} from '../oppfolging-status/oppfolging-selector';
import styles from './varslinger.module.less';

function VeilederVarsel() {
    const erEskalert = useSelector(selectErEskalert);
    const dialogId = useSelector(selectTilHorendeDialogId);
    const eskaleringsVarsel = useSelector(selectGjeldendeEskaleringsVarsel, shallowEqual);

    if (!erEskalert || !eskaleringsVarsel) {
        return null;
    }
    const dato = formaterDatoKortManed(eskaleringsVarsel.opprettetDato);

    return (
        <div className="container">
            <AlertStripeAdvarsel className={styles.varsling}>
                <Normaltekst>
                    NAV har sendt varsel {dato} <LenkeTilDialog dialogId={dialogId}>Les meldingen</LenkeTilDialog>
                </Normaltekst>
            </AlertStripeAdvarsel>
        </div>
    );
}

export default VeilederVarsel;
