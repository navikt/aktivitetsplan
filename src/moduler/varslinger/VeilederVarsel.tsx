import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoKortManed } from '../../utils/dateUtils';
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
            <Alert variant="warning" className="my-4">
                <BodyShort>
                    Nav har sendt varsel {dato}.{' '}
                    <LenkeTilDialog dialogId={tilhorendeDialogId}>Les meldingen.</LenkeTilDialog>
                </BodyShort>
            </Alert>
        </div>
    );
};

export default VeilederVarsel;
