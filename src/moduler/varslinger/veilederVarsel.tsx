import { shallowEqual, useSelector } from 'react-redux';
import React from 'react';
import { selectGjeldendeEskaleringsVarsel, selectTilHorendeDialogId } from '../oppfolging-status/oppfolging-selector';
import { erEskalertBruker } from '../../mocks/demo/sessionstorage';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';
import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import { formaterDatoKortManed } from '../../utils';
import styles from './varslinger.module.less';
import InternLenke from '../../felles-komponenter/utils/internLenke';

function VeilederVarsel() {
    const dispatch = useReduxDispatch();
    const erEskalert = useSelector(erEskalertBruker);
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
