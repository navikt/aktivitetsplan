import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import InternLenke from '../../felles-komponenter/utils/InternLenke';
import { formaterDatoKortManed } from '../../utils';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';
import {
    selectErEskalert,
    selectGjeldendeEskaleringsVarsel,
    selectTilHorendeDialogId,
} from '../oppfolging-status/oppfolging-selector';
import styles from './varslinger.module.less';

function VeilederVarsel() {
    const dispatch = useReduxDispatch();
    const erEskalert = useSelector(selectErEskalert);
    const dialogId = useSelector(selectTilHorendeDialogId);
    const eskaleringsVarsel = useSelector(selectGjeldendeEskaleringsVarsel, shallowEqual);
    const doVelgNavarendePeriode = () => dispatch(velgHistoriskPeriode(null));

    if (!erEskalert || !eskaleringsVarsel) {
        return null;
    }
    const dato = formaterDatoKortManed(eskaleringsVarsel.opprettetDato);

    return (
        <div className="container">
            <AlertStripeAdvarsel className={styles.varsling}>
                <Normaltekst>
                    NAV har sendt varsel {dato}{' '}
                    <InternLenke href={`/dialog/${dialogId}`} onClick={doVelgNavarendePeriode}>
                        Les meldingen
                    </InternLenke>
                </Normaltekst>
            </AlertStripeAdvarsel>
        </div>
    );
}

export default VeilederVarsel;
