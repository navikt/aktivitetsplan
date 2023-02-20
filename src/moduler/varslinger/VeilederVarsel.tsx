import { Alert } from '@navikt/ds-react';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoKortManed } from '../../utils';
import LenkeTilDialog from '../dialog/DialogLink';

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
            <Alert variant="warning" className="mb-5">
                <Normaltekst>
                    NAV har sendt varsel {dato}{' '}
                    <LenkeTilDialog dialogId={tilhorendeDialogId}>Les meldingen</LenkeTilDialog>
                </Normaltekst>
            </Alert>
        </div>
    );
};

export default VeilederVarsel;
