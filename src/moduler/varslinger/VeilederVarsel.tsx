import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoKortManed } from '../../utils';
import LenkeTilDialog from '../dialog/DialogLink';
import styles from './Varslinger.module.css';

interface Props {
    tilhorendeDialogId?: string;
    opprettetDato?: string;
    erEskalert: boolean;
}

const VeilederVarsel = (props: Props) => {
    const { tilhorendeDialogId, opprettetDato, erEskalert } = props;

    if (!erEskalert) {
        return null;
    }

    const dato = formaterDatoKortManed(opprettetDato);

    return (
        <div className="container">
            <AlertStripeAdvarsel className={styles.varslingVeileder}>
                <Normaltekst>
                    NAV har sendt varsel {dato}{' '}
                    <LenkeTilDialog dialogId={tilhorendeDialogId}>Les meldingen</LenkeTilDialog>
                </Normaltekst>
            </AlertStripeAdvarsel>
        </div>
    );
};

export default VeilederVarsel;
